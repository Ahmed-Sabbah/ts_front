<template>
  <div class="container" id="step3">
    <router-link to="/Dashboard/Memorials" class="back-link">
      <img
        src="../../../assets/images/dashboard/contributors/back.svg"
        alt="back"
      />
      Back to memorials
    </router-link>
    <div class="create-memorial-steps">
      <p>Step 3 of 3: <span>Media</span></p>
      <div class="range">
        <span style="width: 66.666%"></span>
      </div>
    </div>
    <MediaFilter
      :mediaList="mediaList"
      @updateMediaList="updateMediaList"
    ></MediaFilter>

    <MediaNavbar
      :mediaList="mediaList"
      @updateMediaList="updateMediaList"
    ></MediaNavbar>
    <SelecteMediaBox
      :mediaList="mediaList"
      @updateMediaList="updateMediaList"
      :emptyState="emptyState"
      :selectedMediaList="selectedMediaList"
      @updateSelectedMediaList="updateSelectedMediaList"
      :selectState="selectState"
      @updateSelectState="updateSelectState"
      :mediaIds="mediaIds"
      @updateSubmitedMediaId="updateSubmitedMediaId"
    ></SelecteMediaBox>
  </div>
  <div class="preview-memorial step3">
    <div class="selected-memorial-cover">
      <div class="selected-media">
        <!-- <div class="item">
          <img
            src="../../../assets/images/dashboard/memorial/memorial.png"
            alt="memorial-cover"
          />
        </div> -->
        <div
          :class="'item ' + item.e_type"
          v-for="item in selectedMediaList"
          :key="item.pk_i_id"
          @click="removeSelectedMedia(item.pk_i_id)"
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
          <!-- <span @click="unselectMedia(item.pk_i_id)"
            ><img
              src="../../../assets/images/dashboard/media/unselect-media.svg"
              alt="unselect"
          /></span> -->
        </div>
      </div>
    </div>
    <div class="btn-group">
      <button class="back-btn" @click="showStep2">Back</button>
      <button
        class="next-btn"
        :disabled="mediaIds.length == 0 || mediaIds.length < 0"
        @click="saveMemorial"
        id="loadingBtn"
      >
        Save
        <img src="../../../assets/images/loading.gif" alt="loading" />
      </button>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import MediaFilter from "../../../components/Dashboard/Media/MediaFilter.vue";
import SelecteMediaBox from "../../../components/Dashboard/Memorials/SelecteMediaBox.vue";
import MediaNavbar from "../../../components/Dashboard/Media/MediaNavbar.vue";
import axios from "axios";

export default {
  name: "NewMemorialStep3",
  components: { SelecteMediaBox, MediaFilter, MediaNavbar },
  props: [
    "s_cover",
    "s_name",
    "dt_live_from",
    "dt_live_to",
    "i_age",
    "s_about",
    "props_d_longitude",
    "props_d_latitude",
    "props_s_street",
    "props_s_suite",
    "props_s_city",
    "props_s_state",
    "props_s_postal_code",
    "s_media_ids",
  ],
  data() {
    return {
      mediaList: [],
      emptyState: false,
      selectedMediaList: [],
      selectState: false,
      mediaIds: this.s_media_ids,
    };
  },
  methods: {
    updateMediaList(val) {
      this.mediaList = val;
    },
    updateEmptyState(val) {
      this.emptyState = val;
    },
    updateSelectedMediaList(val) {
      this.selectedMediaList = val;
    },
    updateSelectState(val) {
      this.selectState = val;
    },
    updateSubmitedMediaId(val) {
      this.mediaIds = val;
      this.$emit("updateSMediaIds", this.mediaIds);
    },
    showStep2() {
      $(".create-memorial .container#step3").css("display", "none");
      $(".create-memorial .preview-memorial.step3").css("display", "none");
      $(".create-memorial .container#step1").css("display", "none");
      $(".create-memorial .preview-memorial.step1").css("display", "none");
      $(".create-memorial .container#step2").css("display", "block");
      $(".create-memorial .preview-memorial.step2").css("display", "block");
    },
    removeSelectedMedia(mediaID) {
      this.selectedMediaList.splice(
        this.selectedMediaList.findIndex((a) => a.pk_i_id === mediaID),
        1
      );
      this.$emit("updateSelectedMediaList", this.selectedMediaList);
      const index = this.mediaIds.indexOf(mediaID);
      if (index > -1) {
        this.mediaIds.splice(index, 1);
      }
      this.$emit("updateSubmitedMediaId", this.mediaIds);
    },
    saveMemorial() {
      $(".create-memorial .preview-memorial .btn-group #loadingBtn").addClass(
        "disabled"
      );

      const formData = new FormData();
      formData.append("s_cover", this.s_cover);
      formData.append("s_name", this.s_name);
      formData.append("dt_live_from", this.dt_live_from);
      formData.append("dt_live_to", this.dt_live_to);
      formData.append("i_age", this.i_age);
      formData.append("s_about", this.s_about);
      formData.append("d_longitude", this.props_d_longitude);
      formData.append("d_latitude", this.props_d_latitude);
      formData.append("s_street", this.props_s_street);
      formData.append("s_suite", this.props_s_suite);
      formData.append("s_city", this.props_s_city);
      formData.append("s_state", this.props_s_state);
      formData.append("s_postal_code", this.props_s_postal_code);
      formData.append("s_media_ids", this.s_media_ids);

      axios.post("/memorials/add_edit", formData).then(
        (res) => {
          if (res.data.status.success) {
            $(
              ".create-memorial .preview-memorial .btn-group #loadingBtn"
            ).removeClass("disabled");
            this.$router.push(
              "/Dashboard/NewMemorialShare/" + res.data.memorials[0].pk_i_id
            );
          } else {
            $(
              ".create-memorial .preview-memorial .btn-group #loadingBtn"
            ).removeClass("disabled");
          }
        },
        (error) => {
          if (error) {
            $(
              ".create-memorial .preview-memorial .btn-group #loadingBtn"
            ).removeClass("disabled");
          }
        }
      );
    },
  },
  async mounted() {
    $("body").css("background-image", "none");
    $(".dashboard-container .content").css("padding", "0");
    $(".dashboard-container .content .create-memorial .container").css(
      "padding",
      "32px 25px 40px 25px"
    );

    await axios.get("/media?e_status=PUBLIC").then((res) => {
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
