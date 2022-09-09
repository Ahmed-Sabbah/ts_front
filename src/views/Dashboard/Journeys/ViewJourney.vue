<template>
  <div class="show-journey">
    <div class="show-journey-box">
      <router-link to="/Dashboard/Journeys" class="back-link">
        <img
          src="../../../assets/images/dashboard/contributors/back.svg"
          alt="back"
        />
        Back to journeys
      </router-link>
      <div class="edit-journey-box">
        <MediaFilter
          :mediaList="mediaList"
          @updateMediaList="updateMediaList"
        ></MediaFilter>

        <button class="edit-journey-btn" @click="editJourney(journyID)" v-if="journey.b_owner">
          Edit Journey
        </button>
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
</template>

<script>
import $ from "jquery";
import MediaBox from "../../../components/Dashboard/JourneysView/MediaBox.vue";
import MediaPreview from "../../../components/Dashboard/Media/MediaPreview.vue";
import MediaNavbar from "../../../components/Dashboard/JourneysView/MediaNavbar.vue";
import MediaFilter from "../../../components/Dashboard/JourneysView/MediaFilter.vue";
import axios from "axios";

export default {
  name: "ViewJourney",
  components: { MediaBox, MediaPreview, MediaNavbar, MediaFilter },
  data() {
    return {
      journyID: this.$route.params.id,
      journey: "",
      mediaList: [],
      emptyState: false,
      previewState: false,
      previewMedia: {},
      mediaComments: [],
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
      $(".preview-media .media-information .location-preview").css('display', 'none');
      $(".preview-media .media-information .comments-preview").css('display', 'none');
      $(".preview-media .media-information .information").css('display', 'block');
    },
    editJourney(journyID) {
      this.$router.push({ name: "EditJourney", params: { id: journyID } });
    },
    updateMediaComments(val) {
      this.mediaComments = val;
    },
  },
  mounted() {
    $("body").css("background-image", "none");
    $(".dashboard-container .content").css("padding", "0");
    $(".dashboard-container .content .show-journey .show-journey-box").css(
      "padding",
      "32px 25px 0 25px"
    );

    axios.get("/journeys?id=" + this.journyID).then((res) => {
      if (res.data.status.success) {
        this.journey = res.data.media[0];
        this.mediaList = res.data.media[0].media;
        this.emptyState = true;
        this.$route.meta.title = res.data.media[0].s_name;
      }
    });
  },
};
</script>

<style scoped>
@import url("../../../assets/css/journeys.css");
</style>