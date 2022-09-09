<template>
  <div class="show-gallery">
    <div class="head">
      <div class="title">
        <div class="back-link" @click="backToMain">
          <img
            src="../../../assets/images/dashboard/memorial/left-arrow.svg"
            alt="back"
          />
        </div>
        <h3>Gallery</h3>
      </div>
    </div>
    <p class="discription-paragraph">Description paragraph</p>
    <div class="media-nav-filter">
      <ul class="media-nav">
        <li class="active" @click="filterMedia($event, 'ALL')">All Media</li>
        <li @click="filterMedia($event, 'PHOTO')">Photos</li>
        <li @click="filterMedia($event, 'VIDEO')">Videos</li>
        <li @click="filterMedia($event, 'AUDIO')">Audios</li>
        <li @click="filterMedia($event, 'DOCUMENT')">Documents</li>
      </ul>
    </div>
    <div class="media-items" v-for="item in media" :key="item.pk_i_id">
      <div :class="'item ' + item.e_type" @click="showMediaInfo(item.pk_i_id)">
        <img
          :src="item.s_file"
          alt="memorial-cover"
          v-if="item.e_type == 'PHOTO'"
        />
        <img
          src="../../../assets/images/dashboard/media/file-text.svg"
          alt="file-text"
          v-else-if="item.e_type == 'DOCUMENT'"
        />
        <img
          src="../../../assets/images/dashboard/media/headphones.svg"
          alt="headphones"
          v-else-if="item.e_type == 'AUDIO'"
        />
        <video
          class="video"
          v-else-if="item.e_type == 'VIDEO'"
          :src="item.s_file + '#' + 't=1'"
        ></video>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import $ from "jquery";

export default {
  name: "Gallery",
  props: ["mediaList", "mediaId"],
  data() {
    return {
      memorialID: this.$route.params.id,
      media: this.mediaList,
      mediaID: this.mediaId,
    };
  },
  methods: {
    backToMain() {
      $(".show-gallery").css("display", "none");
      $(".home").css("display", "block");
    },
    showMediaInfo(id) {
      $(".show-gallery").css("display", "none");
      $(".media-info").css("display", "block");
      this.mediaID = id;
      this.$emit("updateMediaId", this.mediaID);
    },
    filterMedia(e, type) {
      $(".media-nav li").removeClass("active");
      $(e.target).addClass("active");

      if (type == "ALL") {
        axios
          .get(
            "/media?searchable_id=" + this.memorialID + "&searchable_type=MEMORIALS"
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
            "/media?searchable_id=" +
              this.memorialID +
              "&e_type=" +
              type +
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