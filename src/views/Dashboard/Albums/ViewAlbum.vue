<template>
  <div class="show-album">
    <div class="show-album-box">
      <router-link to="/Dashboard/Albums" class="back-link">
        <img
          src="../../../assets/images/dashboard/contributors/back.svg"
          alt="back"
        />
        Back to albums
      </router-link>
      <div class="edit-album-box">
        <MediaFilter
          :mediaList="mediaList"
          @updateMediaList="updateMediaList"
        ></MediaFilter>

        <button class="edit-album-btn" @click="editAlbum(albumID)" v-if="album.b_owner">
          Edit Album
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
import MediaBox from "../../../components/Dashboard/AlbumView/MediaBox.vue";
import MediaPreview from "../../../components/Dashboard/Media/MediaPreview.vue";
import MediaNavbar from "../../../components/Dashboard/AlbumView/MediaNavbar.vue";
import MediaFilter from "../../../components/Dashboard/AlbumView/MediaFilter.vue";
import axios from "axios";

export default {
  name: "ViewAlbum",
  components: { MediaBox, MediaPreview, MediaNavbar, MediaFilter },
  data() {
    return {
      albumID: this.$route.params.id,
      album: "",
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
    editAlbum(albumID) {
      this.$router.push({ name: "EditAlbum", params: { id: albumID } });
    },
    updateMediaComments(val) {
      this.mediaComments = val;
    },
  },
  async mounted() {
    $("body").css("background-image", "none");
    $(".dashboard-container .content").css("padding", "0");
    $(".dashboard-container .content .show-album .show-album-box").css(
      "padding",
      "32px 25px 0 25px"
    );

    await axios.get("/albums?id=" + this.albumID).then((res) => {
      if (res.data.status.success) {
        this.album = res.data.media[0];
        this.mediaList = res.data.media[0].media;
        this.$route.meta.title = res.data.media[0].s_name;
        this.emptyState = true;
      }
    });
  },
};
</script>

<style scoped>
@import url("../../../assets/css/albums.css");
</style>
