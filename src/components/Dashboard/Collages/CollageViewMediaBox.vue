<template>
  <div>
    <div class="media" v-if="emptyState">
      <div class="files">
        <div
          :class="'item ' + item.e_type"
          v-for="item in mediaList"
          :key="item.pk_i_id"
          @click="showPreview(item.pk_i_id)"
        >
          <img
            :src="item.s_file"
            alt="file"
            :data-id="item.pk_i_id"
            :id="'drag' + item.pk_i_id"
          />
        </div>
      </div>
    </div>

    <div class="media-empty" v-else>
      <img
        src="../../../assets/images/dashboard/media/empty-state.svg"
        alt="404"
      />
      <p>No medias to show</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MediaBox",
  props: [
    "mediaList",
    "emptyState",
    "previewState",
    "previewMedia",
    "mediaComments",
  ],
  data() {
    return {
      allowPreview: this.previewState,
      mediaById: this.previewMedia,
      media: this.mediaList,
      comments: this.mediaComments,
    };
  },
  methods: {
    async showPreview(val) {
      this.allowPreview = true;
      this.$emit("updatePreviewState", this.allowPreview);
      await axios.get("/media?id=" + val).then(
        (res) => {
          if (res.data.status.success) {
            axios
              .post("/media/action", {
                fk_i_media_id: val,
                e_action_type: "VIEW",
              })
              .then((response) => {
                if (response.data.status.success) {
                  this.$toast.success(response.data.status.message);
                }
              });
            this.mediaById = res.data.media[0];
            this.$emit("updatePreviewMedia", this.mediaById);
            axios.get("/media/comments?i_media_id=" + val).then((response) => {
              if (response.data.status.success) {
                this.comments = response.data.comments;
                this.$emit("updateMediaComments", this.comments);
              }
            });
          }
        }
      );
    },
  },
};
</script>

<style scoped>
@import url("../../../assets/css/media-files.css");
</style>
