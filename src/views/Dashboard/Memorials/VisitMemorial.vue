<template>
  <div class="visit-memorial">
    <GetStarted
      :s_name="s_name"
      :s_cover="s_cover"
      :dt_live_from="dt_live_from"
      :dt_live_to="dt_live_to"
      v-if="isLoad"
    ></GetStarted>
    <Home
      :s_name="s_name"
      :s_cover="s_cover"
      :dt_live_from="dt_live_from"
      :dt_live_to="dt_live_to"
      :s_about="s_about"
      :thoughtsList="thoughtsList"
      :mediaList="mediaList"
      :mediaId="mediaId"
      @updateMediaId="updateMediaId"
      v-if="isLoad"
    ></Home>
    <Thoughts :thoughtsList="thoughtsList" v-if="isLoad"></Thoughts>
    <Gallery
      :mediaList="mediaList"
      @updateMediaList="updateMediaList"
      :mediaId="mediaId"
      @updateMediaId="updateMediaId"
      v-if="isLoad"
    ></Gallery>
    <MediaInfo
      :mediaObject="mediaObject"
      @updateMediaObject="updateMediaObject"
      :mediaComments="mediaComments"
      @updateMediaComments="updateMediaComments"
      ref="showMediaObject"
    ></MediaInfo>
    <LogVisit :thoughtsList="thoughtsList" @update_thoughts_list="updateMemorialThoughts"></LogVisit>
    <LogVisitSuccess></LogVisitSuccess>
    <About :s_about="s_about" v-if="isLoad"></About>
  </div>
</template>

<script>
import axios from "axios";
import GetStarted from "../../../components/Dashboard/VisitMemorial/GetStarted.vue";
import Home from "../../../components/Dashboard/VisitMemorial/Home.vue";
import $ from "jquery";
import Thoughts from "../../../components/Dashboard/VisitMemorial/Thoughts.vue";
import Gallery from "../../../components/Dashboard/VisitMemorial/Gallery.vue";
import MediaInfo from "../../../components/Dashboard/VisitMemorial/MediaInfo.vue";
import LogVisit from "../../../components/Dashboard/VisitMemorial/LogVisit.vue";
import LogVisitSuccess from "../../../components/Dashboard/VisitMemorial/LogVisitSuccess.vue";
import About from "../../../components/Dashboard/VisitMemorial/About.vue";

export default {
  name: "VisitMemorial",
  components: {
    GetStarted,
    Home,
    Thoughts,
    Gallery,
    MediaInfo,
    LogVisit,
    LogVisitSuccess,
    About,
  },
  data() {
    return {
      memorialID: this.$route.params.id,
      s_name: "",
      s_cover: "",
      dt_live_from: "",
      dt_live_to: "",
      s_about: "",
      thoughtsList: [],
      mediaList: [],
      mediaId: "",
      mediaObject: "",
      mediaComments: "",
      isLoad: false,
    };
  },
  methods: {
    async updateMediaId(val) {
      this.mediaId = val;
      await axios.get("/media/by_id?id=" + this.mediaId).then((res) => {
        if (res.data.status.success) {
          this.mediaObject = res.data.media;
          this.mediaComments = res.data.media[0].comments;
          this.$refs.showMediaObject.setObject(this.mediaObject);
          this.$refs.showMediaObject.setComments(this.mediaComments);
        }
      });
    },
    updateMediaList(val) {
      this.mediaList = val;
    },
    updateMediaObject(val) {
      this.mediaObject = val;
    },
    updateMediaComments(val) {
      this.mediaComments = val;
    },
    updateMemorialThoughts(val) {
      this.thoughtsList = val;
    }
  },
  async mounted() {
    $("body").css("background-image", "none");
    await axios.get("/memorials/by_id?id=" + this.memorialID).then((res) => {
      if (res.data.status.success) {
        this.s_name = res.data.memorials[0].s_name;
        this.s_cover = res.data.memorials[0].s_cover;
        this.dt_live_from = res.data.memorials[0].dt_live_from;
        this.dt_live_to = res.data.memorials[0].dt_live_to;
        this.s_about = res.data.memorials[0].s_about;
        this.thoughtsList = res.data.memorials[0].visits.reverse();
        this.mediaList = res.data.memorials[0].media;
        this.isLoad = true;
      }
    });
  },
};
</script>

<style scoped>
@import url("../../../assets/css/visit-memorial.css");
</style>