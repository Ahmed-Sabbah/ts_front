<template>
  <ul class="media-nav">
    <li class="active" @click="filterMedia($event, 'ALL')">All Media</li>
    <li @click="filterMedia($event, 'PHOTO')">Photos</li>
    <li @click="filterMedia($event, 'VIDEO')">Videos</li>
    <li @click="filterMedia($event, 'AUDIO')">Audios</li>
    <li @click="filterMedia($event, 'DOCUMENT')">Documents</li>
  </ul>
</template>

<script>
import $ from "jquery";
import axios from "axios";

export default {
  name: "MediaNavbar",
  props: ["mediaList"],
  data() {
    return {
      media: this.mediaList,
      id: this.$route.params.id,
      page: this.$route.params.page,
      shareID: this.$route.params.shareID,
      type: "",
    };
  },
  methods: {
    filterMedia(e, type) {
      const filter = this.page;
      if (filter == "album") {
        this.type = "ALBUMS";
      } else {
        this.type = "JOURNEYS";
      }
      $(".media-nav li").removeClass("active");
      $(e.target).addClass("active");

      if (type == "ALL") {
        axios
          .get(
            "/media/filter?searchable_id=" +
              this.id +
              "&searchable_type=" +
              this.type +
              "&share_id=" +
              this.shareID
          )
          .then((res) => {
            if (res.data.status.success) {
              this.media = res.data.media;
              this.$emit("updateMediaList", this.media);
            }
          });
      } else {
        axios
          .get(
            "/media/filter?searchable_id=" +
              this.id +
              "&searchable_type=" +
              this.type +
              "&e_type=" +
              type +
              "&share_id=" +
              this.shareID
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
.media-nav {
  width: 519px;
  height: 42px;
  margin-top: 40px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  list-style-type: none;
  background-color: #ffffff;
  border-radius: 24px;
  -webkit-border-radius: 24px;
  -moz-border-radius: 24px;
  -ms-border-radius: 24px;
  -o-border-radius: 24px;
}

.media-nav li {
  display: inline-block;
  font-size: 16px;
  font-weight: 600;
  color: #b8c1cc;
  cursor: pointer;
}

.media-nav li.active {
  color: #7d7098;
  font-weight: bold;
}
</style>