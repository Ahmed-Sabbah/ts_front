<template>
  <div class="container" id="step1">
    <router-link to="/Dashboard/Memorials" class="back-link">
      <img
        src="../../../assets/images/dashboard/contributors/back.svg"
        alt="back"
      />
      Cancel the memorial
    </router-link>
    <div class="create-memorial-steps">
      <p>Step 1 of 3: <span>Cover Photo</span></p>
      <div class="range">
        <span style="width: 0"></span>
      </div>
    </div>
    <MediaFilter
      :mediaList="mediaList"
      @updateMediaList="updateMediaList"
    ></MediaFilter>

    <MediaBox
      :mediaList="mediaList"
      @updateMediaList="updateMediaList"
      :emptyState="emptyState"
      :memorialCover="memorialCoverObj"
      @updateMemorialCover="updateMemorialCover"
      :memorialCoverId="memorialCoverId"
      @updateMemorialCoverId="updateMemorialCoverId"
      :memorialCoverStatus="memorialCoverStatus"
      @updateMemorialCoverStatus="updateMemorialCoverStatus"
    ></MediaBox>
  </div>
  <div class="preview-memorial step1">
    <div class="selected-memorial-cover">
      <img :src="memorialCoverObj.s_file" alt="memorial-cover" v-if="memorialCoverStatus">
    </div>
    <div class="btn-group">
      <button class="back-btn" @click="cancelMemorial">Back</button>
      <button class="next-btn" :disabled="!memorialCoverStatus" @click="showStep2">Next</button>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import MediaFilter from "./MediaFilter.vue";
import MediaBox from "./MediaBox.vue";
import axios from "axios";

export default {
  name: "NewMemorial",
  components: { MediaBox, MediaFilter },
  props: ["s_cover"],
  data() {
    return {
      mediaList: [],
      emptyState: false,
      memorialCoverObj: '',
      memorialCoverId : this.s_cover,
      memorialCoverStatus: false,
    };
  },
  methods: {
    updateMediaList(val) {
      this.mediaList = val;
    },
    updateEmptyState(val) {
      this.emptyState = val;
    },
    updateMemorialCover(val) {
      this.memorialCoverObj = val;
      this.$emit('updateCoverObj', this.memorialCoverObj);
    },
    updateMemorialCoverId(val) {
      this.memorialCoverId = val;
      this.$emit('updateSCover', this.memorialCoverId);
    },
    updateMemorialCoverStatus(val) {
      this.memorialCoverStatus = val;
    },
    showStep2() {
        $('.create-memorial .container#step1').css('display', 'none');
        $('.create-memorial .preview-memorial.step1').css('display', 'none');
        $('.create-memorial .container#step2').css('display', 'block');
        $('.create-memorial .preview-memorial.step2').css('display', 'block');
    },
    cancelMemorial() {
      this.$router.push('/Dashboard/Memorials');
    }
  },
  async mounted() {
    $("body").css("background-image", "none");
    $(".dashboard-container .content").css("padding", "0");
    $(".dashboard-container .content .create-memorial .container").css(
      "padding",
      "32px 25px 40px 25px"
    );

    await axios.get("/media?e_type=PHOTO&e_status=PUBLIC").then((res) => {
      if (res.data.status.success) {
        this.mediaList = res.data.media;
        if (this.mediaList.length > 0) {
          this.emptyState = true;
        }
      }
    });
    // this.mediaList = res.data.media.filter((key) => key.e_type == "PHOTO");
  },
};
</script>

