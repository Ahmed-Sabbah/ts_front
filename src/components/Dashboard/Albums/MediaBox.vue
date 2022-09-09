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
          @click="addToSelectPreview(item.pk_i_id)"
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
            :src="item.s_file + '#' + 't=1'"
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
    "coverState",
    "coverObj",
    "coverID",
    "emptyState",
    "selectState",
    "selectedMedia",
    "submitedMediaId",
  ],
  data() {
    return {
      media: this.mediaList,
      hasCover: this.coverState,
      selectedCover: this.coverObj,
      selectedCoverId: this.coverID,
      allowPreview: this.selectState,
      mediaObjects: this.selectedMedia,
      mediaIds: this.submitedMediaId,
      sortSelected: "",
    };
  },
  methods: {
    async addToSelectPreview(val) {
      await axios.get("/media?id=" + val).then(
        (res) => {
          if (res.data.status.success) {
            if (this.coverObj == "") {
              if (res.data.media[0].e_type != "PHOTO") {
                this.$toast.error("The album cover should be a photo");
              } else {
                this.hasCover = true;
                this.$emit("updateCoverState", this.hasCover);
                this.selectedCover = res.data.media[0];
                this.$emit("updateCoverObj", this.selectedCover);
                this.selectedCoverId = val;
                this.$emit("updateCoverID", this.selectedCoverId);
              }
            } else {
              this.allowPreview = true;
              this.$emit("updateSelectState", this.allowPreview);
              this.mediaObjects.push(res.data.media[0]);
              this.$emit("updateSelectedMedia", this.mediaObjects);
              this.mediaIds.push(val);
              this.$emit("updateSubmitedMediaId", this.mediaIds);
            }
          }
        },
      );
    },
    async switchSelect(event) {
      if (event.target.value) {
        this.sortSelected = event.target.value;
        await axios.get("/media?order_by=" + this.sortSelected).then(
          (res) => {
            if (res.data.status.success) {
              this.media = res.data.media;
              this.$emit("updateMediaList", this.media);
            }
          },
        );
      }
    },
  },
};
</script>

<style scoped>
@import url("../../../assets/css/media-files.css");
</style>
