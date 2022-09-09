<template>
  <div class="home">
    <div class="memorial-cover">
      <img :src="s_cover" alt="memorial-cover" />
      <div class="memorial-info">
        <h1>{{ s_name }}</h1>
        <p>
          {{ timestampToDate(dt_live_from) }} -
          {{ timestampToDate(dt_live_to) }}
        </p>
      </div>
    </div>
    <div class="about-memorial">
      <h4>About</h4>
      <p v-if="s_about.length > 150">
        {{ aboutFilter }}
        <a href="javascript:void(0)" @click="seeMore">….. see more</a>
      </p>
      <p v-else>
        {{ s_about }}
      </p>
    </div>
    <div class="memorial-thoughts">
      <div class="head">
        <h4>Thoughts</h4>
        <a href="javascript:void(0)" @click="viewThoughts">View all</a>
      </div>
      <div class="thoughts-items">
        <div class="thought" v-for="item in thoughtsList" :key="item.pk_i_id">
          <h5>{{ item.s_name }}</h5>
          <span>{{ timestampToDate(item.dt_created_date) }}</span>
          <p v-if="item.s_thoughts.length > 150">
            {{ item.s_thoughts.substring(0, 60) + " ....." }}
          </p>
          <p v-else>
            {{ item.s_thoughts }}
          </p>
        </div>
      </div>
    </div>
    <div class="memorial-gallery">
      <div class="head">
        <h4>Gallery</h4>
        <a href="javascript:void(0)" @click="viewGallery">View all</a>
      </div>
      <div class="gallery-items">
        <div
          :class="'item ' + item.e_type"
          v-for="item in mediaList"
          :key="item.pk_i_id"
          @click="showMediaInfo(item.pk_i_id)"
        >
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
    <div class="log-visit-btn">
      <button @click="showLogVisit">Log Visit</button>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "GetStarted",
  props: [
    "s_name",
    "s_cover",
    "dt_live_from",
    "dt_live_to",
    "s_about",
    "thoughtsList",
    "mediaList",
    "mediaId",
  ],
  data() {
    return {
      mediaID: this.mediaId,
    };
  },
  methods: {
    timestampToDate(val) {
      var date = new Date(val.replace(/-/g, "/"));
      return (
        date.toLocaleString("default", { month: "short" }) +
        " " +
        date.getDate() +
        "," +
        " " +
        date.getFullYear()
      );
    },
    seeMore() {
      //   $(".about-pop-up").css("display", "none");
      $(".about-pop-up").css({ display: "block" }).animate({
        top: "0",
      });
    },
    viewThoughts() {
      $(".home").css("display", "none");
      $(".all-thoughts").css("display", "block");
    },
    viewGallery() {
      $(".home").css("display", "none");
      $(".show-gallery").css("display", "block");
    },
    showMediaInfo(id) {
      $(".home").css("display", "none");
      $(".media-info").css("display", "block");
      this.mediaID = id;
      this.$emit("updateMediaId", this.mediaID);
    },
    showLogVisit() {
      $(".home").css("display", "none");
      $(".log-visit").css("display", "block");
    },
  },
  computed: {
    aboutFilter() {
      return this.s_about.substring(0, 150);
    },
    // thoughtFilter() {
    //   return this.thoughtsList.s_thoughts.substring(0, 150) + " .....";
    // },
  },
};
</script>