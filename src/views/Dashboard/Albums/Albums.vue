<template>
  <div class="albums">
    <div class="albums-items" v-if="emptyState">
      <div class="search">
        <div class="input-group">
          <label for="albumSearch">
            <img
              src="../../../assets/images/dashboard/media/search-3.svg"
              alt="search"
            />
          </label>
          <input
            type="text"
            name="album"
            id="albumSearch"
            v-model="albumName"
            placeholder="Search for album"
          />
        </div>
        <router-link
          to="/Dashboard/NewAlbum"
          tag="a"
          v-if="user_type == 'GATEKEEPER'"
          >New Album</router-link
        >
      </div>
      <div class="items-box">
        <div class="title">
          <h2>My Albums</h2>
          <select class="select-to" @change="switchSelect($event)">
            <option disabled selected>Sort By</option>
            <option value="desc">Newest to oldest</option>
            <option value="asc">Oldest to newest</option>
          </select>
        </div>
        <div class="items">
          <div class="item" v-for="item in albumsList" :key="item.pk_i_id">
            <!-- ../../../assets/images/dashboard/contributors/7.png -->
            <img
              @click="showAlbum(item.pk_i_id)"
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
                  <button @click="editAlbum(item.pk_i_id)" v-if="item.b_owner">
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
                    @click="revmoveAlbum(item.pk_i_id)"
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
          <div class="model-container" id="removeAlbumConfirm">
            <div class="model-box">
              <h3 class="model-title">Remove Album</h3>
              <p>Are you sure you want to remove this album ?</p>
              <div class="btn-group">
                <button class="btn-sm-light" @click="cancelAlbumRemove">
                  Cancel
                </button>
                <button
                  class="btn-sm-dark"
                  @click="confirmAlbumRemove(albumId)"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="empty-albums" v-else>
      <div class="new-album">
        <router-link
          to="/Dashboard/NewAlbum"
          tag="a"
          v-if="user_type == 'GATEKEEPER'"
          >New Album</router-link
        >
      </div>
      <div class="empty-state">
        <img
          src="../../../assets/images/dashboard/media/empty-state.svg"
          alt="404"
        />
        <p>No albums to show</p>
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
  </div>
</template>

<script>
import $ from "jquery";
import axios from "axios";

export default {
  name: "Albums",
  data() {
    return {
      albumsList: [],
      emptyState: false,
      sortSelected: "",
      albumId: "",
      albumName: "",
      shareAlbumId: "",
      s_fullname: "",
      s_email: "",
      s_message: "",
      expiryDate: true,
      s_date: "",
      user_type: "",
      errors: [],
    };
  },
  methods: {
    toggleDropdown(val) {
      $(
        ".albums .albums-items .items-box .items .item .tools #dropdown" + val
      ).toggle();
    },
    async switchSelect(event) {
      if (event.target.value) {
        this.sortSelected = event.target.value;
        await axios.get("/albums?order_by=" + this.sortSelected).then((res) => {
          if (res.data.status.success) {
            this.albumsList = res.data.media;
          }
        });
      }
    },
    showAlbum(id) {
      this.$router.push({ name: "ViewAlbum", params: { id: id } });
    },
    editAlbum(albumID) {
      this.$router.push({ name: "EditAlbum", params: { id: albumID } });
    },
    revmoveAlbum(albumID) {
      this.albumId = albumID;
      $(".albums .albums-items .model-container#removeAlbumConfirm").css(
        "display",
        "flex"
      );
      this.toggleDropdown(albumID);
    },
    cancelAlbumRemove() {
      this.albumId = "";
      $(".albums .albums-items .model-container#removeAlbumConfirm").hide();
    },
    showShareInfoModel(albumID) {
      this.shareAlbumId = albumID;
      $(".model-container#shareInfoModel").css("display", "flex");
      $(".albums .albums-items #dropdown" + albumID).toggle();
    },
    hideShareInfoModel() {
      $(".model-container#shareInfoModel").css("display", "none");
      this.shareAlbumId = "";
      this.s_fullname = "";
      this.s_email = "";
      this.s_message = "";
      this.expiryDate = true;
      this.s_date = "";
      this.errors = [];
    },
    async sendShareInfo() {
      const shareInfo = new FormData();
      shareInfo.set("s_albums_ids", this.shareAlbumId);
      shareInfo.set("s_fullname", this.s_fullname);
      shareInfo.set("s_email", this.s_email);
      shareInfo.set("s_message", this.s_message);
      shareInfo.set("dt_expiry_date", this.s_date);
      // shareInfo.set("s_date", this.s_date);
      $(".albums .model-container#shareInfoModel #loadingBtn").prop(
        "disabled",
        true
      );

      await axios.post("/share/add_edit", shareInfo).then(
        (res) => {
          this.errors = [];
          if (res.data.status.success) {
            this.hideShareInfoModel();
            this.shareAlbumId = "";
            this.s_fullname = "";
            this.s_email = "";
            this.s_message = "";
            this.expiryDate = true;
            this.s_date = "";
            this.errors = [];
            $(".albums .model-container#shareInfoModel #loadingBtn").prop(
              "disabled",
              false
            );
            this.$toast.success(res.data.status.message);
          } else {
            this.errors.push(res.data.status.message);
            $(".albums .model-container#shareInfoModel #loadingBtn").prop(
              "disabled",
              false
            );
          }
        },
        (error) => {
          if (error) {
            $(".albums .model-container#shareInfoModel #loadingBtn").prop(
              "disabled",
              false
            );
          }
        }
      );
    },
    async confirmAlbumRemove(albumID) {
      await axios.post("/albums/delete", { album_id: albumID }).then((res) => {
        if (res.data.status.success) {
          $(".albums .albums-items .model-container#removeAlbumConfirm").hide();
          axios.get("/albums").then((res) => {
            if (res.data.status.success) {
              this.albumsList = res.data.media;
              if (this.albumsList.length > 0) {
                this.emptyState = true;
              }
            }
          });
        }
      });
    },
  },
  watch: {
    albumName: function (val) {
      if (val != "") {
        this.albumName = val;
        axios.get("/albums?s_name=" + val).then((res) => {
          if (res.data.status.success) {
            this.albumsList = res.data.media;

            // if (this.albumsList.length > 0) {
            //   this.emptyState = true;
            // }
          }
        });
      } else {
        axios.get("/albums").then((res) => {
          if (res.data.status.success) {
            this.albumsList = res.data.media;

            if (this.albumsList.length > 0) {
              this.emptyState = true;
            }
          }
        });
      }
    },
    shareAlbumId: function (val) {
      this.shareAlbumId = val;
    },
    expiryDate: function (val) {
      this.expiryDate = val;
    },
  },
  async mounted() {
    $("body").css("background-image", "none");
    $(".dashboard-container .content").css("padding", "32px 25px 0 25px");

    await axios.get("/albums").then((res) => {
      if (res.data.status.success) {
        this.albumsList = res.data.media;
        this.user_type = res.data.e_user_type;

        if (this.albumsList.length > 0) {
          this.emptyState = true;
        }
      }
    });
  },
};
</script>

<style scoped>
@import url("../../../assets/css/albums.css");
</style>
