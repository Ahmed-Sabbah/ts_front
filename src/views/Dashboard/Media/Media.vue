<template>
  <div class="media-page">
    <div class="media-box">
      <div class="upload-media-box">
        <MediaFilter
          :mediaList="mediaList"
          @updateMediaList="updateMediaList"
        ></MediaFilter>
        <router-link to="/Dashboard/MediaUpload" class="upload-media-btn"
          >Upload Media</router-link
        >
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
import MediaFilter from "../../../components/Dashboard/Media/MediaFilter.vue";
import axios from "axios";

export default {
  name: "Media",
  components: { MediaBox, MediaPreview, MediaNavbar, MediaFilter },
  data() {
    return {
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
  watch: {
    "$route.params.id": function (id) {
      let type = this.$route.params.type;
      // let id = this.$route.params.id;

      if (type && type == "media") {
        axios.get("/media?id=" + id).then((res) => {
          if (res.data.status.success) {
            axios
              .post("/media/action", {
                fk_i_media_id: id,
                e_action_type: "VIEW",
              })
              .then((result) => {
                console.log(result.data.status.message);
              });
            this.updatePreviewMedia(res.data.media[0]);
            this.updatePreviewState(true);
            axios.get("/media/comments?i_media_id=" + id).then((response) => {
              if (response.data.status.success) {
                this.updateMediaComments(response.data.comments);
              }
            });
          }
        });
      } else if (type && type == "comment") {
        let commentId = this.$route.params.commentID;

        axios.get("/media?id=" + id).then((res) => {
          if (res.data.status.success) {
            axios
              .post("/media/action", {
                fk_i_media_id: id,
                e_action_type: "VIEW",
              })
              .then((result) => {
                console.log(result.data.status.message);
              });
            this.updatePreviewMedia(res.data.media[0]);
            this.updatePreviewState(true);
            axios.get("/media/comments?i_media_id=" + id).then((response) => {
              if (response.data.status.success) {
                let comments = response.data.comments;
                const index = comments.findIndex((object) => {
                  return object.pk_i_id == commentId;
                });
                let targetComment = comments[index];
                targetComment.selected = true;
                //Object.keys(comments).find(pk_i_id => comments[pk_i_id] === commentId)
                comments.splice(index, 1);
                comments.unshift(targetComment);
                this.updateMediaComments(comments);
              }
            });
          }
        });
      }
    },
  },
  async mounted() {
    $("body").css("background-image", "none");
    $(".dashboard-container .content").css("padding", "0");
    $(".dashboard-container .content .media-page .media-box").css(
      "padding",
      "32px 25px 0 25px"
    );

    await axios.get("/media").then((res) => {
      if (res.data.status.success) {
        this.mediaList = res.data.media;
        if (this.mediaList.length > 0) {
          this.emptyState = false;
        }
      }
    });

    let type = this.$route.params.type;
    let id = this.$route.params.id;

    if (type && type == "media") {
      await axios.get("/media?id=" + id).then((res) => {
        if (res.data.status.success) {
          axios
            .post("/media/action", {
              fk_i_media_id: id,
              e_action_type: "VIEW",
            })
            .then((result) => {
              console.log(result.data.status.message);
            });
          this.updatePreviewMedia(res.data.media[0]);
          this.updatePreviewState(true);
          axios.get("/media/comments?i_media_id=" + id).then((response) => {
            if (response.data.status.success) {
              this.updateMediaComments(response.data.comments);
            }
          });
        }
      });
    } else if (type && type == "comment") {
      let commentId = this.$route.params.commentID;

      axios.get("/media?id=" + id).then((res) => {
        if (res.data.status.success) {
          axios
            .post("/media/action", {
              fk_i_media_id: id,
              e_action_type: "VIEW",
            })
            .then((result) => {
              console.log(result.data.status.message);
            });
          this.updatePreviewMedia(res.data.media[0]);
          this.updatePreviewState(true);
          axios.get("/media/comments?i_media_id=" + id).then((response) => {
            if (response.data.status.success) {
              let comments = response.data.comments;
              const index = comments.findIndex((object) => {
                return object.pk_i_id == commentId;
              });
              let targetComment = comments[index];
              targetComment.selected = true;
              //Object.keys(comments).find(pk_i_id => comments[pk_i_id] === commentId)
              comments.splice(index, 1);
              comments.unshift(targetComment);
              this.updateMediaComments(comments);
            }
          });
        }
      });
    }
  },
};
</script>

<style scoped>
@import url("../../../assets/css/media.css");
</style>
