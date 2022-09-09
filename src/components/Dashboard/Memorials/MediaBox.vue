<template>
  <div>
    <div class="media" v-if="emptyState">
      <div class="sort">
        <span v-if="mediaList">{{ mediaList.length }} photos</span>
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
          :id="'item' + item.pk_i_id"
          v-for="item in mediaList"
          :key="item.pk_i_id"
          @click="selectMemorialCover(item.pk_i_id)"
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
// import $ from "jquery";

import axios from "axios";

export default {
  name: "MediaBox",
  props: ["mediaList", "emptyState", "memorialCoverObj", "memorialCoverId", "memorialCoverStatus"],
  data() {
    return {
      media: this.mediaList,
      sortSelected: "",
      selectedMedia: this.memorialCoverObj,
      selectedMediaId: this.memorialCoverId,
      allowPreview: this.memorialCoverStatus,
    };
  },
  methods: {
    async selectMemorialCover(val) {
      this.allowPreview = true;
      this.$emit("updateMemorialCoverStatus", this.allowPreview);
      await axios.get("/media?id=" + val).then(
        (res) => {
          if (res.data.status.success) {
            this.selectedMedia = res.data.media[0];
            this.$emit("updateMemorialCover", this.selectedMedia);
            this.selectedMediaId = res.data.media[0].pk_i_id;
            this.$emit("updateMemorialCoverId", this.selectedMediaId);
          }
        },
      );
    },
    async switchSelect(event) {
      if (event.target.value) {
        this.sortSelected = event.target.value;
        await axios
          .get(
            "/media?e_type=PHOTO" +
              "&searchable_type=MEMORIALS" +
              "&e_status=PUBLIC" +
              "&order_by=" +
              this.sortSelected
          )
          .then(
            (res) => {
              if (res.data.status.success) {
                this.media = res.data.media;
                this.$emit("updateMediaList", this.media);
              }
            }
          );
      }
    },
  },
};
</script>

<style scoped>
@import url("../../../assets/css/media-files.css");
</style>
