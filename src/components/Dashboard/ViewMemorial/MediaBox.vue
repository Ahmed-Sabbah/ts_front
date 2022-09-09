<template>
  <div>
    <div class="media" v-if="emptyState">
      <div class="sort">
        <span v-if="mediaList">{{ mediaList.length }} media</span>
        <span v-else>{{ media.length }} media</span>
        <select class="select-to" @change="switchSelect($event)">
          <option disabled selected>Sort By</option>
          <option value="desc">Newest to oldest</option>
          <option value="asc">Oldest to newest</option>
        </select>
      </div>

      <div class="files">
        <div
          :class="'item ' + item.e_type"
          v-for="item in mediaList"
          :key="item.pk_i_id"
          @click="showPreview(item.pk_i_id)"
        >
          <img :src="item.s_file" alt="file" v-if="item.e_type == 'PHOTO'" />
          <img
            class="file"
            v-else-if="item.e_type == 'DOCUMENT'"
            src="../../../assets/images/dashboard/media/file-text.svg"
            alt="file-text"
          />
          <img
            class="audio"
            v-else-if="item.e_type == 'AUDIO'"
            src="../../../assets/images/dashboard/media/headphones.svg"
            alt="headphones"
          />
          <video
            class="video"
            v-else-if="item.e_type == 'VIDEO'"
            :src="item.s_file + '#t' + '=1'"
          ></video>
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
      memorialID: this.$route.params.id,
      allowPreview: this.previewState,
      mediaById: this.previewMedia,
      media: this.mediaList,
      sortSelected: "",
      comments: this.mediaComments,
    };
  },
  methods: {
    async showPreview(val) {
      this.allowPreview = true;
      this.$emit("updatePreviewState", this.allowPreview);
      await axios.get("/media?id=" + val).then((res) => {
        if (res.data.status.success) {
          axios
            .post("/media/action", {
              fk_i_media_id: val,
              e_action_type: "VIEW",
            })
            .then((result) => {
              console.log(result.data.status.message);
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
      });
    },
    async switchSelect(event) {
      if (event.target.value) {
        this.sortSelected = event.target.value;
        await axios
          .get(
            "/media?order_by=" +
              this.sortSelected +
              "&searchable_id=" +
              this.memorialID +
              "&searchable_type=MEMORIALS"
          )
          .then((res) => {
            if (res.data.status.success) {
              this.media = res.data.media;
              this.$emit("updateMediaList", this.media);
            }
          });
      }
    },
  },
};
</script>

<style scoped>
@import url("../../../assets/css/media-files.css");
</style>
