<template>
  <div class="select-media-preview">
    <p v-if="coverState">Cover Image</p>
    <div v-if="coverState" class="selected-cover">
      <img class="item-img" :src="coverObj.s_file" alt="cover" />
      <span @click="unselectCover"
        ><img
          src="../../../assets/images/dashboard/media/unselect-media.svg"
          alt="unselect"
      /></span>
    </div>
    <p v-if="selectState">{{ selectedMediaArr.length }} media selected</p>
    <div class="selected-media" v-if="selectState">
      <div
        :class="'item ' + item.e_type"
        v-for="item in selectedMediaArr"
        :key="item.pk_i_id"
      >
        <img
          class="item-img"
          :src="item.s_file"
          alt="media"
          v-if="item.e_type == 'PHOTO'"
        />
        <img
          class="file item-img"
          v-else-if="item.e_type == 'DOCUMENT'"
          src="../../../assets/images/dashboard/media/file-text.svg"
          alt="file-text item-img"
        />
        <img
          class="audio item-img"
          v-else-if="item.e_type == 'AUDIO'"
          src="../../../assets/images/dashboard/media/headphones.svg"
          alt="headphones"
        />
        <video
          class="video item-img"
          v-else-if="item.e_type == 'VIDEO'"
          :src="item.s_file + '#' + 't=1'"
        ></video>
        <span @click="unselectMedia(item.pk_i_id)"
          ><img
            src="../../../assets/images/dashboard/media/unselect-media.svg"
            alt="unselect"
        /></span>
      </div>
    </div>
    <button
      class="save-btn"
      id="loadingBtn"
      v-if="selectState && coverState && submitType == 'new'"
      @click="saveJourny"
    >
      Save Journey <img src="../../../assets/images/loading.gif" alt="loading" />
    </button>
    <button
      class="save-btn"
      id="loadingBtn"
      v-if="selectState && coverState && submitType == 'edit'"
      @click="updateJourny(journeyID)"
    >
      Update Journey <img src="../../../assets/images/loading.gif" alt="loading" />
    </button>
    <button
      class="save-btn-disable"
      disabled
      v-else-if="(!selectState || !coverState) && submitType == 'new'"
    >
      Save Journey
    </button>
    <button
      class="save-btn-disable"
      disabled
      v-else-if="(!selectState || !coverState) && submitType == 'edit'"
    >
      Update Journey
    </button>
    <div class="empty-selected-media" v-if="!selectState">
      <h3>Select media<br />for your journey</h3>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import $ from "jquery";

export default {
  name: "SelectedJourneyMedia",
  props: [
    "journyName",
    "journyDescription",
    "coverState",
    "coverObj",
    "coverID",
    "selectState",
    "selectedMedia",
    "submitedMediaId",
    "submitType",
    "journeyID",
    "errors",
  ],
  data() {
    return {
      hasCover: this.coverState,
      selectedCover: this.coverObj,
      selectedCoverId: this.coverID,
      selectedPreview: this.selectState,
      selectedMediaArr: this.selectedMedia,
      selectedMediaId: this.submitedMediaId,
      journyErrors: this.errors,
    };
  },
  methods: {
    unselectCover() {
      this.hasCover = false;
      this.$emit("updateCoverState", this.hasCover);
      this.selectedCover = "";
      this.$emit("updateCoverObj", this.selectedCover);
      this.selectedCoverId = "";
      this.$emit("updateCoverID", this.selectedCoverId);
    },
    unselectMedia(val) {
      if (this.selectedMediaArr.length == 1) {
        this.selectedPreview = false;
        this.$emit("updateSelectState", this.selectedPreview);
      }
      this.selectedMediaArr.splice(
        this.selectedMediaArr.findIndex((a) => a.pk_i_id === val),
        1
      );
      this.$emit("updateSelectedMedia", this.selectedMediaArr);
      const index = this.selectedMediaId.indexOf(val);
      if (index > -1) {
        this.selectedMediaId.splice(index, 1);
      }
      this.$emit("updateSubmitedMediaId", this.selectedMediaId);
    },
    saveJourny() {
      $(".create-journey .select-media-preview #loadingBtn").prop("disabled", true);
      this.journyErrors = [];
      this.$emit("updateErrors", this.journyErrors);
      axios
        .post("/journeys/add_edit", {
          s_name: this.journyName,
          s_description: this.journyDescription,
          s_cover: this.coverID,
          s_media_ids: this.selectedMediaId.join(", "),
        })
        .then(
          (res) => {
            if (res.data.status.success) {
              $(".create-journey .select-media-preview #loadingBtn").prop("disabled", false);
              //show success model
              $(".create-journey .model-container#journeySuccessModel").css(
                "display",
                "flex"
              );
              // this.$router.push("/Dashboard/Journeys");
            }
          },
          (error) => {
            $(".create-journey .select-media-preview #loadingBtn").prop("disabled", false);
            this.journyErrors.push(error);
            this.$emit("updateErrors", this.journyErrors);
          }
        );
    },
    updateJourny(id) {
      $(".create-journey .select-media-preview #loadingBtn").prop("disabled", true);
      this.journyErrors = [];
      this.$emit("updateErrors", this.journyErrors);
      axios
        .post("/journeys/add_edit", {
          pk_i_id: id,
          s_name: this.journyName,
          s_description: this.journyDescription,
          s_media_ids: this.selectedMediaId.join(", "),
        })
        .then(
          (res) => {
            if (res.data.status.success) {
              $(".create-journey .select-media-preview #loadingBtn").prop("disabled", false);
              //show success model
              $(".create-journey .model-container#journeySuccessModel").css(
                "display",
                "flex"
              );
              // this.$router.push("/Dashboard/Journeys");
            }
          },
          (error) => {
            $(".create-journey .select-media-preview #loadingBtn").prop("disabled", false);
            this.journyErrors.push(error);
            this.$emit("updateErrors", this.journyErrors);
          }
        );
    },
  },
};
</script>