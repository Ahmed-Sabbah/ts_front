<template>
  <div class="create-album">
    <div class="create-album-box">
      <a
        href="javascript:void(0)"
        @click="showCancelAlbumModel"
        class="back-link"
      >
        <img
          src="../../../assets/images/dashboard/contributors/back.svg"
          alt="back"
        />
        Cancel the album
      </a>
      <div v-if="errors.length">
        <b style="color: brown">Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </div>
      <div class="album-name">
        <label>Album Name</label>
        <input
          type="text"
          v-model="albumNameVal"
          @change="newAlbumName"
          id="albumName"
        />
      </div>
      <p class="choose-media-paragraph">Choose the media</p>
      <MediaFilter
        :mediaList="mediaList"
        @updateMediaList="updateMediaList"
      ></MediaFilter>

      <MediaNavbar
        :mediaList="mediaList"
        @updateMediaList="updateMediaList"
      ></MediaNavbar>

      <MediaBox
        :mediaList="mediaList"
        @updateMediaList="updateMediaList"
        :coverState="coverState"
        @updateCoverState="updateCoverState"
        :coverObj="coverObj"
        @updateCoverObj="updateCoverObj"
        :coverID="coverID"
        @updateCoverID="updateCoverID"
        :emptyState="emptyState"
        :selectState="selectState"
        @updateSelectState="updateSelectState"
        :selectedMedia="selectedMedia"
        @updateSelectedMedia="updateSelectedMedia"
        :submitedMediaId="submitedMediaId"
        @updateSubmitedMediaId="updateSubmitedMediaId"
      ></MediaBox>
    </div>

    <SelectedMedia
      :coverState="coverState"
      @updateCoverState="updateCoverState"
      :coverObj="coverObj"
      @updateCoverObj="updateCoverObj"
      :coverID="coverID"
      @updateCoverID="updateCoverID"
      :selectState="selectState"
      @updateSelectState="updateSelectState"
      :selectedMedia="selectedMedia"
      @updateSelectedMedia="updateSelectedMedia"
      :submitedMediaId="submitedMediaId"
      @updateSubmitedMediaId="updateSubmitedMediaId"
      :albumNameVal="albumNameVal"
      :errors="errors"
      @updateErrors="updateErrors"
      :submitType="submitType"
    ></SelectedMedia>

    <div class="model-container" id="albumSuccessModel">
      <div class="model-box">
        <img
          src="../../../assets/images/dashboard/model-box/model-box-success.svg"
          alt="success"
        />
        <h3 class="model-title">Success</h3>
        <p>Your album was successfully saved</p>
        <button class="btn-sm-dark">
          <router-link to="/Dashboard/Albums" tag="a">Go to albums</router-link>
        </button>
      </div>
    </div>
    <div class="model-container" id="cancelAlbumModel">
      <div class="model-box">
        <h3 class="model-title">Cancel the album</h3>
        <p>
          By confirming cancellation , all the data <br />
          will not be saved , are you sure you <br />
          want to cancel ?
        </p>
        <div class="btn-group">
          <button class="btn-sm-light" @click="cancelAlbumCancel">
            Cancel
          </button>
          <button class="btn-sm-dark" @click="confirmAlbumCancel">
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import MediaBox from "../../../components/Dashboard/Albums/MediaBox.vue";
import MediaNavbar from "../../../components/Dashboard/Media/MediaNavbar.vue";
import MediaFilter from "../../../components/Dashboard/Media/MediaFilter.vue";
import SelectedMedia from "../../../components/Dashboard/Albums/SelectedMedia.vue";
import axios from "axios";
export default {
  name: "NewAlbum",
  components: { MediaBox, MediaNavbar, MediaFilter, SelectedMedia },
  data() {
    return {
      mediaList: [],
      coverState: false,
      coverObj: "",
      coverID: "",
      emptyState: false,
      selectState: false,
      selectedMedia: [],
      submitedMediaId: [],
      albumNameVal: "",
      submitType: "new",
      errors: [],
    };
  },
  methods: {
    updateMediaList(val) {
      this.mediaList = val;
    },
    updateCoverState(val) {
      this.coverState = val;
    },
    updateCoverObj(val) {
      this.coverObj = val;
    },
    updateCoverID(val) {
      this.coverID = val;
    },
    updateSelectState(val) {
      this.selectState = val;
    },
    updateSelectedMedia(val) {
      this.selectedMedia = val;
    },
    updateSubmitedMediaId(val) {
      this.submitedMediaId = val;
    },
    updateErrors(val) {
      this.errors = val;
    },
    newAlbumName() {
      this.albumNameVal == $("#albumName").val();
    },
    showCancelAlbumModel() {
      $(".create-album .model-container#cancelAlbumModel").css(
        "display",
        "flex"
      );
    },
    cancelAlbumCancel() {
      $(".create-album .model-container#cancelAlbumModel").hide();
    },
    confirmAlbumCancel() {
      this.$router.push("/Dashboard/Albums");
    },
  },
  async mounted() {
    $("body").css("background-image", "none");
    $(".dashboard-container .content").css("padding", "0");
    $(".dashboard-container .content .create-album .create-album-box").css(
      "padding",
      "32px 25px 0 25px"
    );
    
    await axios.get("/auth_user").then((res) => {
      if (res.data.status.success) {
        if (res.data.users[0].e_type != "GATEKEEPER") {
          this.$router.push("/Dashboard/Albums");
        }
      }
    });

    await axios.get("/media").then((res) => {
      if (res.data.status.success) {
        this.mediaList = res.data.media;
        if (this.mediaList.length > 0) {
          this.emptyState = true;
        }
      }
    });
  },
};
</script>

<style scoped>
@import url("../../../assets/css/albums.css");
</style>
