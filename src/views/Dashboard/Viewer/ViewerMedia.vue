<template>
  <div class="dashboard-container">
    <header>
      <h2>{{ familyName }}</h2>
      <div class="top-right-nav">
        <ul>
          <li class="account">
            <!-- <img
              :src="auth_user.s_image"
              alt="accounts"
              v-if="auth_user.s_image"
            /> -->
            <img
              src="../../../assets/images/dashboard/side-menu-icons/accounts.svg"
              alt="accounts"
            />
            <p>Welcome {{ username }}</p>
          </li>
        </ul>
      </div>
    </header>

    <div class="content big-screen">
      <div class="media-page">
        <div class="media-box">
          <a
            class="back-link"
            href="javascript:void(0);"
            onclick="javascript:history.go(-1);"
          >
            <img
              src="../../../assets/images/dashboard/contributors/back.svg"
              alt="back"
            />
            Back to main
          </a>
          <div class="upload-media-box">
            <MediaFilter
              :mediaList="mediaList"
              @updateMediaList="updateMediaList"
            ></MediaFilter>
          </div>

          <MediaNavbar
            :mediaList="mediaList"
            @updateMediaList="updateMediaList"
          ></MediaNavbar>

          <MediaBox
            :mediaList="mediaList"
            @updateMediaList="updateMediaList"
            :emptyState="emptyState"
            :previewState="previewState"
            @updatePreviewState="updatePreviewState"
            :previewMedia="previewMedia"
            @updatePreviewMedia="updatePreviewMedia"
            :mediaComments="mediaComments"
            @updateMediaComments="updateMediaComments"
          ></MediaBox>
        </div>
        <MediaPreview
          :mediaList="mediaList"
          @updateMediaList="updateMediaList"
          :emptyState="emptyState"
          @updateEmptyState="updateEmptyState"
          :previewState="previewState"
          @updatePreviewState="updatePreviewState"
          :previewMedia="previewMedia"
          :mediaComments="mediaComments"
          @updateMediaComments="updateMediaComments"
        ></MediaPreview>
      </div>
    </div>
    <div class="small-screen">
      <MediaPreviewSmall
        :mediaList="mediaList"
        :mediaLength="mediaLength"
        :previewState="previewState"
        v-if="allowLoad"
      ></MediaPreviewSmall>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import MediaBox from "../../../components/Dashboard/Viewer/MediaBox.vue";
import MediaPreview from "../../../components/Dashboard/Viewer/MediaPreview.vue";
import MediaNavbar from "../../../components/Dashboard/Viewer/MediaNavbar.vue";
import MediaFilter from "../../../components/Dashboard/Viewer/MediaFilter.vue";
import axios from "axios";
import MediaPreviewSmall from "../../../components/Dashboard/Viewer/MediaPreviewSmall.vue";

export default {
  name: "Media",
  components: {
    MediaBox,
    MediaPreview,
    MediaNavbar,
    MediaFilter,
    MediaPreviewSmall,
  },
  data() {
    return {
      // e_type: "",
      // auth_user: "",
      pageName: "",
      familyName: "",
      username: "",
      mediaList: [],
      mediaLength: "",
      emptyState: true,
      previewState: false,
      previewMedia: {},
      mediaComments: [],
      id: this.$route.params.id,
      page: this.$route.params.page,
      shareID: this.$route.params.shareID,
      allowLoad: false,
      // photos: [],
    };
  },
  methods: {
    updateMediaList(val) {
      this.mediaList = val;
    },
    updateEmptyState(val) {
      this.emptyState = val;
    },
    updatePreviewState(val) {
      this.previewState = val;
    },
    updatePreviewMedia(val) {
      this.previewMedia = val;
      $(".preview-media .media-information .location-preview").css(
        "display",
        "none"
      );
      $(".preview-media .media-information .comments-preview").css(
        "display",
        "none"
      );
      $(".preview-media .media-information .information").css(
        "display",
        "block"
      );
    },
    updateMediaComments(val) {
      this.mediaComments = val;
    },
  },
  async mounted() {
    $("body").css("background-image", "none");
    $(".dashboard-container .content").css("padding", "0");
    $(".dashboard-container .content").css("width", "100%");
    $(".dashboard-container header").css("width", "100%");
    $(".dashboard-container .content .media-page .media-box").css(
      "width",
      "calc(100% - 320px)"
    );
    $(".dashboard-container .content .media-page .media-box").css(
      "padding",
      "32px 25px 25px 25px"
    );

    if (this.page == "album") {
      await axios
        .get("/albums/by_id?id=" + this.id + "&share_id=" + this.shareID)
        .then((res) => {
          if (res.data.status.success) {
            this.familyName = res.data.s_familyname;
            this.username = res.data.s_fullname;
            this.mediaList = res.data.media[0].media;
            this.mediaLength = res.data.media[0].media.length;
            this.emptyState = false;
            this.allowLoad = true;
            // const files = res.data.media[0].media.map((key) => key.s_file && key.e_type == "PHOTO");
            // for (let index = 0; index < files.length; index++) {
            //   this.photos.push(files[index]);
            // }
            // this.pageName = res.data.albums[0].s_name;
          }
        });
    } else {
      await axios
        .get("/journeys/by_id?id=" + this.id + "&share_id=" + this.shareID)
        .then((res) => {
          if (res.data.status.success) {
            this.familyName = res.data.s_familyname;
            this.username = res.data.s_fullname;
            this.mediaList = res.data.media[0].media;
            this.mediaLength = res.data.media[0].media.length;
            this.emptyState = false;
            this.allowLoad = true;
            // const files = res.data.media[0].media.map((key) => key.s_file && key.e_type == "PHOTO");
            // for (let index = 0; index < files.length; index++) {
            //   this.photos.push(files[index]);
            // }
            // this.pageName = res.data.journeys[0].s_name;
          }
        });
    }
  },
};
</script>

<style scoped>
@import url("../../../assets/css/viewer-media.css");
</style>
