<template>
  <div class="journeys">
    <div class="empty-journeys" v-if="emptyState">
      <div class="new-journey">
        <router-link to="/Dashboard/NewJourney" tag="a"
          >New Journey</router-link
        >
      </div>
      <div class="empty-state">
        <img
          src="../../../assets/images/dashboard/media/empty-state.svg"
          alt="404"
        />
        <p>No journeys to show</p>
      </div>
    </div>
    <div class="journeys-items" v-if="!emptyState">
      <div class="search">
        <div class="input-group">
          <label for="journeysearch">
            <img
              src="../../../assets/images/dashboard/media/search-3.svg"
              alt="search"
            />
          </label>
          <input
            type="text"
            name="journey"
            id="journeysearch"
            v-model="juornyName"
            placeholder="Search for journey"
          />
        </div>
        <router-link to="/Dashboard/NewJourney" tag="a"
          >New Journey</router-link
        >
      </div>
      <div class="items-box">
        <div class="title">
          <h2>My Journeys</h2>
          <select class="select-to" @change="switchSelect($event)">
            <option disabled selected>Sort By</option>
            <option value="desc">Newest to oldest</option>
            <option value="asc">Oldest to newest</option>
          </select>
        </div>
        <div class="items">
          <div class="item" v-for="item in journeysList" :key="item.pk_i_id">
            <img
              @click="showJourny(item.pk_i_id)"
              :src="item.s_cover.s_file"
              alt="media"
            />
            <div class="data">
              <h4>{{ item.s_name }}</h4>
              <div class="tools">
                <div class="head">
                  <span>By: {{ item.s_creator_name }}</span>
                  <img
                    src="../../../assets/images/dashboard/home-icons/overflow-menu-vertical.svg"
                    alt="menu-vertical"
                    @click="toggleDropdown(item.pk_i_id)"
                  />
                </div>
                <div class="dropdown" :id="'dropdown' + item.pk_i_id">
                  <button
                    @click="editJourney(item.pk_i_id)"
                    v-if="item.b_owner"
                  >
                    <img
                      src="../../../assets/images/dashboard/media/edit.svg"
                      alt="edit"
                    />
                    Edit
                  </button>
                  <button @click="showShareInfoModel(item.pk_i_id)">
                    <img
                      src="../../../assets/images/dashboard/media/external-link.svg"
                      alt="share"
                    />
                    Share
                  </button>
                  <button
                    class="danger-btn"
                    @click="revmoveJourney(item.pk_i_id)"
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
    <div class="other-journeys" v-if="otherJourneyList.length > 0">
      <div class="items-box">
        <div class="title">
          <h2>Other Journeys</h2>
          <select class="select-to" @change="switchSelectOther($event)">
            <option disabled selected>Sort By</option>
            <option value="desc">Newest to oldest</option>
            <option value="asc">Oldest to newest</option>
          </select>
        </div>
        <div class="items">
          <div
            class="item"
            v-for="item in otherJourneyList"
            :key="item.pk_i_id"
          >
            <img
              @click="showJourny(item.pk_i_id)"
              :src="item.s_cover.s_file"
              alt="media"
            />
            <div class="data">
              <h4>{{ item.s_name }}</h4>
              <div class="tools">
                <div class="head">
                  <span>By: {{ item.s_creator_name }}</span>
                  <img
                    src="../../../assets/images/dashboard/home-icons/overflow-menu-vertical.svg"
                    alt="menu-vertical"
                    @click="toggleDropdown(item.pk_i_id)"
                  />
                </div>
                <div class="dropdown" :id="'dropdown' + item.pk_i_id">
                  <button
                    @click="editJourney(item.pk_i_id)"
                    v-if="item.b_owner"
                  >
                    <img
                      src="../../../assets/images/dashboard/media/edit.svg"
                      alt="edit"
                    />
                    Edit
                  </button>
                  <button @click="showShareInfoModel(item.pk_i_id)">
                    <img
                      src="../../../assets/images/dashboard/media/external-link.svg"
                      alt="share"
                    />
                    Share
                  </button>
                  <button
                    class="danger-btn"
                    @click="revmoveJourney(item.pk_i_id)"
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
    <div class="model-container" id="shareInfoModel">
      <div class="model-box">
        <h3 class="model-title">Share</h3>
        <div v-if="errors.length">
          <b style="color: brown">Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
        </div>
        <div class="input-group">
          <label>Viewer Full Name</label>
          <input type="text" name="fullName" v-model="s_fullname" />
        </div>
        <div class="input-group">
          <label>Viewer Email address</label>
          <input type="email" name="email" v-model="s_email" />
        </div>
        <div class="input-group">
          <label>Message to the Viewer</label>
          <textarea v-model="s_message"></textarea>
        </div>
        <div class="contributor-permissions">
          <div class="select-permissions">
            <div class="flex-row">
              <p class="title">Expiry Date</p>
              <label class="switch">
                <input
                  type="checkbox"
                  value="true"
                  checked
                  v-model="expiryDate"
                />
                <span class="slider round"></span>
              </label>
            </div>
            <input
              type="date"
              :disabled="!expiryDate"
              placeholder="mm/dd/yy"
              :min="
                new Date(new Date().setDate(new Date().getDate() + 1))
                  .toISOString()
                  .split('T')[0]
              "
              v-model="s_date"
              id="dateInput"
            />
          </div>
        </div>
        <div class="btn-group">
          <button class="btn-sm-light" @click="hideShareInfoModel">
            Cancel
          </button>
          <button class="btn-sm-dark" id="loadingBtn" @click="sendShareInfo">
            Send share link
            <img src="../../../assets/images/loading.gif" alt="loading" />
          </button>
        </div>
      </div>
    </div>
    <div class="model-container" id="removeJourneyConfirm">
      <div class="model-box">
        <h3 class="model-title">Remove Journey</h3>
        <p>Are you sure you want to remove this journey ?</p>
        <div class="btn-group">
          <button class="btn-sm-light" @click="cancelJourneyRemove">
            Cancel
          </button>
          <button class="btn-sm-dark" @click="confirmJourneyRemove(journeyId)">
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
  name: "Journeys",
  data() {
    return {
      journeyId: "",
      journeysList: [],
      otherJourneyList: [],
      emptyState: true,
      sortSelected: "",
      juornyName: "",
      shareJuornyId: "",
      s_fullname: "",
      s_email: "",
      s_message: "",
      expiryDate: true,
      s_date: "",
      errors: [],
    };
  },
  methods: {
    toggleDropdown(val) {
      $(".journeys .items-box .items .item .tools #dropdown" + val).toggle();
    },
    async switchSelect(event) {
      if (event.target.value) {
        this.sortSelected = event.target.value;
        await axios
          .get("/journeys?order_by=" + this.sortSelected)
          .then((res) => {
            if (res.data.status.success) {
              this.journeysList = res.data.media;
            }
          });
      }
    },
    async switchSelectOther(event) {
      if (event.target.value) {
        this.sortSelected = event.target.value;
        await axios
          .get("/journeys?other_order_by=" + this.sortSelected)
          .then((res) => {
            if (res.data.status.success) {
              this.otherJourneyList = res.data.other_journeys;
            }
          });
      }
    },
    showJourny(id) {
      this.$router.push({ name: "ViewJourney", params: { id: id } });
    },
    editJourney(journyID) {
      this.$router.push({ name: "EditJourney", params: { id: journyID } });
    },
    revmoveJourney(journeyID) {
      this.journeyId = journeyID;
      $(".journeys .model-container#removeJourneyConfirm").css(
        "display",
        "flex"
      );
      this.toggleDropdown(journeyID);
    },
    cancelJourneyRemove() {
      this.journeyId = "";
      $(".journeys .model-container#removeJourneyConfirm").hide();
    },
    async confirmJourneyRemove(journeyID) {
      await axios
        .post("/journeys/delete", { journey_id: journeyID })
        .then((res) => {
          if (res.data.status.success) {
            this.cancelJourneyRemove();
            axios.get("/journeys").then((res) => {
              if (res.data.status.success) {
                this.journeysList = res.data.media;

                if (this.journeysList.length > 0) {
                  this.emptyState = true;
                }
              }
            });
          }
        });
    },
    showShareInfoModel(journyID) {
      this.shareJuornyId = journyID;
      $(".model-container#shareInfoModel").css("display", "flex");
      $(".journeys #dropdown" + journyID).toggle();
    },
    hideShareInfoModel() {
      $(".model-container#shareInfoModel").css("display", "none");
      this.shareJuornyId = "";
      this.s_fullname = "";
      this.s_email = "";
      this.s_message = "";
      this.expiryDate = true;
      this.s_date = "";
      this.errors = [];
    },
    async sendShareInfo() {
      const shareInfo = new FormData();
      shareInfo.set("s_journeys_ids", this.shareJuornyId);
      shareInfo.set("s_fullname", this.s_fullname);
      shareInfo.set("s_email", this.s_email);
      shareInfo.set("s_message", this.s_message);
      shareInfo.set("dt_expiry_date", this.s_date);
      // shareInfo.set("s_date", this.s_date);
      $(".journeys .model-container#shareInfoModel #loadingBtn").prop(
        "disabled",
        true
      );
      await axios.post("/share/add_edit", shareInfo).then(
        (res) => {
          this.errors = [];
          if (res.data.status.success) {
            this.hideShareInfoModel();
            this.shareJuornyId = "";
            this.s_fullname = "";
            this.s_email = "";
            this.s_message = "";
            this.expiryDate = true;
            this.s_date = "";
            this.errors = [];
            $(".journeys .model-container#shareInfoModel #loadingBtn").prop(
              "disabled",
              false
            );
            this.$toast.success(res.data.status.message);
          } else {
            this.errors.push(res.data.status.message);
            $(".journeys .model-container#shareInfoModel #loadingBtn").prop(
              "disabled",
              false
            );
          }
        },
        (error) => {
          if (error) {
            $(".journeys .model-container#shareInfoModel #loadingBtn").prop(
              "disabled",
              false
            );
          }
        }
      );
    },
  },
  watch: {
    juornyName: function (val) {
      if (val != "") {
        this.juornyName = val;
        axios.get("/journeys?s_name=" + val).then((res) => {
          if (res.data.status.success) {
            this.journeysList = res.data.media;
          }
        });
      } else {
        axios.get("/journeys").then((res) => {
          if (res.data.status.success) {
            this.journeysList = res.data.media;

            if (this.journeysList.length > 0) {
              this.emptyState = false;
            }
          }
        });
      }
    },
    shareJuornyId: function (val) {
      this.shareJuornyId = val;
    },
    expiryDate: function (val) {
      this.expiryDate = val;
    },
  },
  mounted() {
    $("body").css("background-image", "none");
    $(".dashboard-container .content").css("padding", "32px 25px 0 25px");

    axios.get("/journeys").then((res) => {
      if (res.data.status.success) {
        this.journeysList = res.data.media;
        this.otherJourneyList = res.data.other_journeys;
        if (this.journeysList.length > 0) {
          this.emptyState = false;
        }
      }
    });
  },
};
</script>

<style scoped>
@import url("../../../assets/css/journeys.css");
</style>