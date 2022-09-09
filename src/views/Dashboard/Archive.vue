<template>
  <div class="archive">
    <div class="archive-box">
      <MediaFilter
          :mediaList="mediaList"
          @updateMediaList="updateMediaList"
        ></MediaFilter>

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
import MediaBox from "../../components/Dashboard/Archive/MediaBox.vue";
import MediaPreview from "../../components/Dashboard/Archive/MediaPreview.vue";
import MediaNavbar from "../../components/Dashboard/Archive/MediaNavbar.vue";
import MediaFilter from "../../components/Dashboard/Archive/MediaFilter.vue";
import axios from "axios";
export default {
  name: "Archive",
  components: { MediaBox, MediaPreview, MediaNavbar, MediaFilter },
  data() {
    return {
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
    updateMediaComments(val) {
      this.mediaComments = val;
    },
  },
  mounted() {
    $("body").css("background-image", "none");
    $(".dashboard-container .content").css('padding', '0')
    $(".dashboard-container .content .archive .archive-box").css(
      "padding",
      "32px 25px 0 25px"
    );

    axios.get("/archive").then((res) => {
      if (res.data.status.success) {
        this.mediaList = res.data.media;
        if (this.mediaList.length > 0) {
          this.emptyState = true;
        }
      }
    });
  },
};
</script>

<style scoped>
@import url("../../assets/css/contributor.css");
</style>