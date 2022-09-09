<template>
  <div class="view-contributor">
    <div class="contributor">
      <router-link to="/Dashboard/Contributors" tag="a" class="back-link">
        <img
          src="../../../assets/images/dashboard/contributors/back.svg"
          alt="back"
        />
        Back to contributors
      </router-link>

      <div class="user">
        <img :src="contributor.s_image" alt="contributors-image" v-if="contributor.s_image" />
        <img
          src="../../../assets/images/dashboard/contributors/selected-media.png"
          alt="contributors-image"
          v-else
        />
        <div class="info">
          <h3>{{ contributor.s_fullname }}</h3>
          <span>{{ contributor.e_status == 'ACTIVE' ? 'Active' : 'Inactive' }} Contributor</span>
        </div>
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
import MediaBox from "../../../components/Dashboard/Media/MediaBox.vue";
import MediaPreview from "../../../components/Dashboard/Media/MediaPreview.vue";
import MediaNavbar from "../../../components/Dashboard/Media/MediaNavbar.vue";
import axios from "axios";
export default {
  name: "ViewContributor",
  components: { MediaBox, MediaPreview, MediaNavbar },
  data() {
    return {
      contributorID: this.$route.params.id,
      contributor: "",
      mediaList: [],
      emptyState: true,
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
  async mounted() {
    $("body").css("background-image", "none");
    $(".dashboard-container .content").css('padding', '0');
    $(".dashboard-container .content .view-contributor .contributor").css(
      "padding",
      "32px 25px 0 25px"
    );

    await axios.get("/contributors?id=" + this.contributorID).then((res) => {
      if (res.data.status.success) {
        if (res.data.contributors[0].e_status == 'PENDING') {
          this.$router.push("/Contributors");
        }
        this.contributor = res.data.contributors[0];
        this.mediaList = res.data.contributors[0].media;
        if (res.data.contributors[0].media.length > 0) {
          this.emptyState = false;
        }
      } else {
        this.$router.push("/404");
      }
    });
  },
};
</script>

<style scoped>
@import url("../../../assets/css/contributor.css");
</style>
