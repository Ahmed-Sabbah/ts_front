<template>
  <div class="dashboard-container">
    <header>
      <h2>{{ familyName }}</h2>
      <div class="top-right-nav">
        <ul>
          <li class="account">
            <img
              src="../../../assets/images/dashboard/side-menu-icons/accounts.svg"
              alt="accounts"
            />
            <p>Welcome {{ username }}</p>
          </li>
        </ul>
      </div>
    </header>

    <div class="content">
      <div class="share-media">
        <div class="mobile-filter">
          <p class="active" @click="showAlbums($event)">Albums</p>
          <p @click="showJourneys($event)">Journeys</p>
        </div>
        <div class="mobile-request-join-family">
          <button @click="showRequestToBeContributor">
            Request to be a contributor
          </button>
        </div>
        <div class="request-join-family">
          <h3 class="title" v-if="albums.length > 0">Albums</h3>
          <button @click="showRequestToBeContributor" v-if="albums.length > 0">
            Request to be a contributor
          </button>
        </div>
        <div class="albums" v-if="albums.length > 0">
          <div class="item" v-for="item in albums" :key="item.pk_i_id">
            <img
              :src="item.s_cover.s_file"
              alt="media"
              @click="showViewerMedia(item.pk_i_id, 'album')"
            />
            <div class="data">
              <h4>{{ item.s_name }}</h4>
              <span>By: {{ item.s_creator_name }}</span>
            </div>
          </div>
        </div>
        <div class="request-join-family">
          <h3 class="title" v-if="journeys.length > 0">Journeys</h3>
          <button
            @click="showRequestToBeContributor"
            v-if="albums.length <= 0 && journeys.length > 0"
          >
            Request to be a contributor
          </button>
        </div>
        <div class="journeys" v-if="journeys.length > 0">
          <div class="item" v-for="item in journeys" :key="item.pk_i_id">
            <img
              :src="item.s_cover.s_file"
              alt="media"
              @click="showViewerMedia(item.pk_i_id, 'journey')"
            />
            <div class="data">
              <h4>{{ item.s_name }}</h4>
              <span>By: {{ item.s_creator_name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="model-container" id="requestToBeContributor">
      <div class="model-box">
        <h3 class="model-title">Request to be a contributor</h3>
        <div v-if="errors.length">
          <b style="color: brown">Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
        </div>
        <div class="input-group">
          <label>Full Name</label>
          <input type="text" v-model="s_fullname" />
        </div>
        <div class="input-group">
          <label>Email address</label>
          <input type="email" name="email" v-model="s_email" />
        </div>
        <div class="input-group">
          <label>Message</label>
          <textarea v-model="s_message"></textarea>
        </div>
        <div class="btn-group">
          <button class="btn-sm-light" @click="hideRequestToBeContributor">
            Cancel
          </button>
          <button class="btn-sm-dark" id="loadingBtn" @click="sendRequest">
            Submit <img src="../../../assets/images/loading.gif" alt="loading" />
          </button>
        </div>
      </div>
    </div>

    <!-- <div class="user-dropmenu">
      <div class="user-info">
        <div class="user-img">
          <img
            :src="auth_user.s_image"
            alt="user-img"
            v-if="auth_user.s_image"
          />
        </div>
        <router-link
          to="/GatekeeperProfile"
          tag="a"
          v-if="e_type == 'GATEKEEPER'"
          >{{ auth_user.s_fullname }}</router-link
        >
        <router-link to="/ContributorProfile" tag="a" v-else>{{
          auth_user.s_fullname
        }}</router-link>
        <p v-if="e_type == 'GATEKEEPER'">Gate Keeper</p>
        <p v-else>Contributor</p>
      </div>
    </div> -->
  </div>
</template>

<script>
import $ from "jquery";
import axios from "axios";

export default {
  name: "Dashboard",
  data() {
    return {
      // e_type: "",
      // auth_user: "",
      familyName: "",
      username: "",
      shareID: this.$route.query.share_id,
      salt: this.$route.query.salt,
      albums: [],
      journeys: [],
      s_fullname: "",
      s_email: "",
      s_message: "",
      errors: [],
    };
  },
  methods: {
    showViewerMedia(id, page) {
      this.$router.push({
        name: "ViewerMedia",
        params: { id: id, page: page, shareID: this.shareID },
      });
    },
    showAlbums(e) {
      $(".mobile-filter p").removeClass("active");
      $(e.target).addClass("active");
      $(".dashboard-container .content .share-media .journeys").css(
        "display",
        "none"
      );
      $(".dashboard-container .content .share-media .albums").css(
        "display",
        "flex"
      );
    },
    showJourneys(e) {
      $(".mobile-filter p").removeClass("active");
      $(e.target).addClass("active");
      $(".dashboard-container .content .share-media .albums").css(
        "display",
        "none"
      );
      $(".dashboard-container .content .share-media .journeys").css(
        "display",
        "flex"
      );
    },
    showRequestToBeContributor() {
      $(".dashboard-container #requestToBeContributor").css("display", "flex");
    },
    hideRequestToBeContributor() {
      this.errors = [];
      this.s_fullname = "";
      this.s_email = "";
      this.s_message = "";
      $(".dashboard-container #requestToBeContributor").css("display", "none");
    },
    async sendRequest() {
      if (this.s_fullname == "" || this.s_email == "" || this.s_message == "") {
        this.errors.push("Please make sure all inputs fields are filled");
      } else {
        $(".dashboard-container .model-container#requestToBeContributor #loadingBtn").prop(
          "disabled",
          true
        );
        const requestData = new FormData();
        requestData.set("i_share_id", this.shareID);
        requestData.set("s_fullname", this.s_fullname);
        requestData.set("s_email", this.s_email);
        requestData.set("s_message", this.s_message);
        await axios.post("/contributors/request", requestData).then(
          (res) => {
            if (res.data.status.success) {
              this.hideRequestToBeContributor();
              $(
                ".dashboard-container .model-container#requestToBeContributor #loadingBtn"
              ).prop("disabled", false);
              this.$toast.success(res.data.status.message);
            }
          },
          (error) => {
            if (error) {
              $(
                ".dashboard-container .model-container#requestToBeContributor #loadingBtn"
              ).prop("disabled", false);
            }
          }
        );
      }
    },
  },
  async mounted() {
    $("body").css("background-image", "none");
    $(".dashboard-container .content").css("padding", "32px 25px 0 25px");
    $(".dashboard-container .content").css("width", "100%");
    $(".dashboard-container header").css("width", "100%");
    $("header ul li.account").click(function () {
      $(".dashboard-container .user-dropmenu").toggle();
    });

    const formData = new FormData();
    formData.append("share_id", this.shareID);
    formData.append("salt", this.salt);

    await axios
      .get("/share/show?share_id=" + this.shareID + "&salt=" + this.salt)
      .then((response) => {
        if (response.data.status.success) {
          if (!response.data.b_enabled) {
            this.$router.push("/404");
          } else {
            this.familyName = response.data.s_familyname;
            this.username = response.data.s_fullname;
            this.albums = response.data.albums;
            this.journeys = response.data.journeys;
          }
        }
      });
  },
};
</script>

<style scoped>
@import url("../../../assets/css/viewer-screen.css");
</style>
