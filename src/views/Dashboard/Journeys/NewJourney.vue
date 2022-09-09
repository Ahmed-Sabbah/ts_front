<template>
  <div class="create-journey">
    <div class="create-journey-box">
      <a
        href="javascript:void(0)"
        @click="showCancelJourneyModel"
        class="back-link"
      >
        <img
          src="../../../assets/images/dashboard/contributors/back.svg"
          alt="back"
        />
        Cancel the journey
      </a>
      <div class="journey-steps">
        <p>
          Step {{ stepNumber }} of 2:
          <span>{{ stepNumber == 1 ? "Journey Info" : "Journey Media" }}</span>
        </p>
        <div class="range">
          <span :style="'width:' + stepRange"></span>
        </div>
      </div>
      <div style="margin: 10px 0" v-if="errors.length">
        <b style="color: brown">Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </div>
      <div class="first-step">
        <form @submit="submitFirstStep">
          <div class="input-group">
            <label>Journey Name</label>
            <input type="text" v-model="journyName" />
          </div>
          <div class="input-group">
            <label>Describe your Feelings</label>
            <textarea v-model="journyDescription"></textarea>
          </div>
          <div class="btn-group">
            <button type="submit">Enter</button>
          </div>
        </form>
      </div>
      <div class="second-step">
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
          :emptyState="emptyState"
          :mediaList="mediaList"
          @updateMediaList="updateMediaList"
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
        ></MediaBox>
      </div>
    </div>
    <SelectedJourneyMedia
      :journyName="journyName"
      :journyDescription="journyDescription"
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
      :errors="errors"
      :submitType="submitType"
      @updateErrors="updateErrors"
    ></SelectedJourneyMedia>

    <div class="model-container" id="journeySuccessModel">
      <div class="model-box">
        <img
          src="../../../assets/images/dashboard/model-box/model-box-success.svg"
          alt="success"
        />
        <h3 class="model-title">Success</h3>
        <p>Your journey was successfully saved</p>
        <button class="btn-sm-dark">
          <router-link to="/Dashboard/Journeys" tag="a"
            >Go to journeys</router-link
          >
        </button>
      </div>
    </div>
    <div class="model-container" id="cancelJourneyModel">
      <div class="model-box">
        <h3 class="model-title">Cancel the journey</h3>
        <p>
          By confirming cancellation , all the data <br />
          will not be saved , are you sure you <br />
          want to cancel ?
        </p>
        <div class="btn-group">
          <button class="btn-sm-light" @click="cancelJourneyCancel">
            Cancel
          </button>
          <button class="btn-sm-dark" @click="confirmJourneyCancel">
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import SelectedJourneyMedia from "../../../components/Dashboard/Journeys/SelectedJourneyMedia.vue";
import MediaNavbar from "../../../components/Dashboard/Media/MediaNavbar.vue";
import MediaFilter from "../../../components/Dashboard/Media/MediaFilter.vue";
import MediaBox from "../../../components/Dashboard/Journeys/MediaBox.vue";
import axios from "axios";

export default {
  name: "NewJourney",
  components: { SelectedJourneyMedia, MediaNavbar, MediaFilter, MediaBox },
  data() {
    return {
      stepNumber: 1,
      stepRange: "0",
      journyName: "",
      journyDescription: "",
      coverState: false,
      coverObj: "",
      coverID: "",
      mediaList: [],
      emptyState: true,
      selectState: false,
      selectedMedia: [],
      submitedMediaId: [],
      submitType: "new",
      errors: [],
    };
  },
  methods: {
    submitFirstStep(e) {
      e.preventDefault();
      this.errors = [];
      if (this.journyName == "") {
        this.errors.push("Journy name can't be empty.");
      } else if (this.journyDescription == "") {
        this.errors.push("Journy description can't be empty.");
      } else {
        this.stepNumber = 2;
        this.stepRange = "50%";
        $(".create-journey .create-journey-box .first-step").toggle();
        $(".create-journey .create-journey-box .second-step").toggle();
      }
    },
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
    showCancelJourneyModel() {
      $(".create-journey .model-container#cancelJourneyModel").css(
        "display",
        "flex"
      );
    },
    cancelJourneyCancel() {
      $(".create-journey .model-container#cancelJourneyModel").hide();
    },
    confirmJourneyCancel() {
      this.$router.push("/Dashboard/Journeys");
    },
  },
  async mounted() {
    $("body").css("background-image", "none");
    $(".dashboard-container .content").css("padding", "0");
    $(".dashboard-container .content .create-journey .create-journey-box").css(
      "padding",
      "32px 25px 0 25px"
    );

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
@import url("../../../assets/css/journeys.css");
</style>
