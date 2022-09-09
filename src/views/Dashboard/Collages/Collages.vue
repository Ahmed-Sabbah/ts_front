<template>
  <div class="collages">
    <div class="not-empty" v-if="collageStatus">
      <div class="search">
        <div class="input-group">
          <label for="collagesearch">
            <img
              src="../../../assets/images/dashboard/media/search-3.svg"
              alt="search"
            />
          </label>
          <input
            type="text"
            name="s_collage"
            v-model="collageName"
            id="collagesearch"
            placeholder="Search for collage"
          />
        </div>
        <router-link to="/Dashboard/NewCollage" tag="a"
          >New Collage</router-link
        >
      </div>
      <div class="my-collages" v-if="collageList.length > 0">
        <div class="title">
          <h2>My collages</h2>
          <select class="select-to" @change="switchSelect($event)">
            <option disabled selected>Sort By</option>
            <option value="desc">Newest to oldest</option>
            <option value="asc">Oldest to newest</option>
          </select>
        </div>
        <div class="items-box">
          <div
            v-for="item in collageList"
            :key="item.pk_i_id"
            :class="item.e_status == 'DRAFT' ? 'item in-progress' : 'item'"
          >
            <img
              class="item-img"
              :src="item.s_cover"
              alt="media"
              @click="showCollage(item.pk_i_id)"
            />
            <div class="data">
              <h4>{{ item.s_name }}</h4>
              <p class="collage-type">
                {{ item.e_type }}, {{ item.i_num_photo }} photos,
                {{ item.e_orientation }}, {{ item.s_size }}
              </p>
              <div class="tools">
                <div class="maker">
                  <span>By: {{ item.s_creator_name }}</span>
                  <img
                    src="../../../assets/images/dashboard/home-icons/overflow-menu-vertical.svg"
                    alt="menu-vertical"
                    @click="toggleDropdown(item.pk_i_id)"
                    v-if="item.b_owner"
                  />
                </div>
                <div class="dropdown" :id="'dropdown' + item.pk_i_id" v-if="item.b_owner">
                  <button
                    @click="editCollage(item.pk_i_id)"
                    v-if="item.b_owner"
                  >
                    <img
                      src="../../../assets/images/dashboard/media/edit.svg"
                      alt="edit"
                    />
                    Edit
                  </button>
                  <button
                    class="danger-btn"
                    @click="revmoveCollage(item.pk_i_id)"
                    v-if="item.b_owner"
                  >
                    <img
                      src="../../../assets/images/dashboard/media/trash.svg"
                      alt="trash"
                    />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="other-collages" v-if="otherCollageList.length > 0">
        <div class="title">
          <h2>Other collages</h2>
          <select class="select-to" @change="switchSelectOther($event)">
            <option disabled selected>Sort By</option>
            <option value="desc">Newest to oldest</option>
            <option value="asc">Oldest to newest</option>
          </select>
        </div>
        <div class="items-box">
          <div
            v-for="item in otherCollageList"
            :key="item.pk_i_id"
            :class="item.e_status == 'DRAFT' ? 'item in-progress' : 'item'"
          >
            <img
              class="item-img"
              :src="item.s_cover"
              alt="media"
              @click="showCollage(item.pk_i_id)"
            />
            <div class="data">
              <h4>{{ item.s_name }}</h4>
              <p class="collage-type">
                {{ item.e_type }}, {{ item.i_num_photo }} photos,
                {{ item.e_orientation }}, {{ item.s_size }}
              </p>
              <div class="tools">
                <div class="maker">
                  <span>By: {{ item.s_creator_name }}</span>
                  <img
                    src="../../../assets/images/dashboard/home-icons/overflow-menu-vertical.svg"
                    alt="menu-vertical"
                    @click="toggleDropdown(item.pk_i_id)"
                    v-if="item.b_owner"
                  />
                </div>
                <div class="dropdown" :id="'dropdown' + item.pk_i_id" v-if="item.b_owner">
                  <button
                    @click="editCollage(item.pk_i_id)"
                    v-if="item.b_owner"
                  >
                    <img
                      src="../../../assets/images/dashboard/media/edit.svg"
                      alt="edit"
                    />
                    Edit
                  </button>
                  <button
                    class="danger-btn"
                    @click="revmoveCollage(item.pk_i_id)"
                    v-if="item.b_owner"
                  >
                    <img
                      src="../../../assets/images/dashboard/media/trash.svg"
                      alt="trash"
                    />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="empty-collages" v-if="!collageStatus">
      <div class="new-collage">
        <router-link to="/Dashboard/NewCollage" tag="a"
          >New Collage</router-link
        >
      </div>
      <div class="empty-state">
        <img
          src="../../../assets/images/dashboard/media/empty-state.svg"
          alt="404"
        />
        <p>No collages to show</p>
      </div>
    </div>

    <div class="model-container" id="removeCollageConfirm">
      <div class="model-box">
        <h3 class="model-title">Remove Collage</h3>
        <p>Are you sure you want to remove this collage ?</p>
        <div class="btn-group">
          <button class="btn-sm-light" @click="cancelCollageRemove">
            Cancel
          </button>
          <button class="btn-sm-dark" @click="confirmCollageRemove(collageId)">
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import axios from "axios";

export default {
  name: "Collages",
  data() {
    return {
      collageId: "",
      collageList: [],
      otherCollageList: [],
      collageStatus: false,
      sortSelected: "",
      collageName: "",
    };
  },
  methods: {
    toggleDropdown(val) {
      $(".collages .items-box .item .tools #dropdown" + val).toggle();
    },
    async switchSelect(event) {
      if (event.target.value) {
        this.sortSelected = event.target.value;
        await axios.get("/collages?order_by=" + this.sortSelected).then(
          (res) => {
            if (res.data.status.success) {
              this.collageList = res.data.collages;
            }
          },
        );
      }
    },
    async switchSelectOther(event) {
      if (event.target.value) {
        this.sortSelected = event.target.value;
        await axios.get("/collages?other_order_by=" + this.sortSelected).then(
          (res) => {
            if (res.data.status.success) {
              this.otherCollageList = res.data.other_collages;
            }
          },
        );
      }
    },
    editCollage(collageID) {
      this.$router.push("/Dashboard/EditCollage/" + collageID);
    },
    revmoveCollage(collageID) {
      this.collageId = collageID;
      $(".collages .model-container#removeCollageConfirm").css(
        "display",
        "flex"
      );
      this.toggleDropdown(collageID);
    },
    cancelCollageRemove() {
      this.collageId = "";
      $(".collages .model-container#removeCollageConfirm").hide();
    },
    async confirmCollageRemove(collageID) {
      await axios
        .post("/collages/delete", { collage_id: collageID })
        .then((res) => {
          if (res.data.status.success) {
            this.cancelCollageRemove();
            axios.get("/collages").then(
              (res) => {
                if (res.data.status.success) {
                  this.collageList = res.data.collages;
                  if (this.collageList.length > 0) {
                    this.collageStatus = true;
                  }
                }
              },
              (error) => {
                if (error) {
                  this.collageStatus = false;
                }
              }
            );
          }
        });
    },
    showCollage(collageID) {
      this.$router.push("/Dashboard/ViewCollage/" + collageID);
    },
  },
  watch: {
    collageName: function (val) {
      if (val != "") {
        this.collageName = val;
        axios.get("/collages?s_name=" + val).then((res) => {
          if (res.data.status.success) {
            this.collageList = res.data.collages;
          }
        });
      } else {
        axios.get("/collages").then(
          (res) => {
            if (res.data.status.success) {
              this.collageList = res.data.collages;
              if (this.collageList.length > 0) {
                this.collageStatus = true;
              }
            }
          },
          (error) => {
            if (error) {
              this.collageStatus = false;
            }
          }
        );
      }
    },
  },
  mounted() {
    $(".dashboard-container .content").css("padding", "32px 25px 0 25px");

    axios.get("/collages").then(
      (res) => {
        if (res.data.status.success) {
          this.collageList = res.data.collages;
          this.otherCollageList = res.data.other_collages;
          if (this.collageList.length > 0 || this.otherCollageList.length > 0) {
            this.collageStatus = true;
          }
        }
      },
      (error) => {
        if (error) {
          this.collageStatus = false;
        }
      }
    );
  },
};
</script>

<style scoped>
@import url("../../../assets/css/collages.css");
</style>
