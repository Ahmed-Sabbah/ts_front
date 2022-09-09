<template>
  <div class="upload-media">
    <a
      href="javascript:void(0)"
      @click="showCancelMediaModel"
      class="back-link"
    >
      <img
        src="../../../assets/images/dashboard/contributors/back.svg"
        alt="back"
      />
      Cancel the upload
    </a>
    <MediaUploadSteps></MediaUploadSteps>

    <MediaUploadEmptyStatus
      :props_uploaded_file="uploaded_file"
      @update-uploaded-file="onUpdateUploadedFile"
      :props_s_file="s_file"
      @update-s-file="onUpdateSFile"
      :props_e_type="e_type"
      @update-e-type="onUpdateEType"
      :props_s_extension="s_extension"
      @update-s-extension="onUpdateSExtension"
      :props_d_size="d_size"
      @update-d-size="onUpdateDSize"
      :props_dt_uploaded_by="dt_uploaded_by"
      @update-dt-uploaded-by="onUpdateDtUploadedBy"
      :props_dt_uploaded_at="dt_uploaded_at"
      @update-dt-uploaded-at="onUpdateDtUploadedAt"
    ></MediaUploadEmptyStatus>

    <UploadedMediaTags
      :props_e_type="e_type"
      :props_s_extension="s_extension"
      :props_d_size="d_size"
      :props_dt_uploaded_by="dt_uploaded_by"
      :props_dt_uploaded_at="dt_uploaded_at"
      :props_s_tags_ids="s_tags_ids"
      @update-s-tags-ids="onUpdateSTagsIds"
    ></UploadedMediaTags>

    <UploadedMediaFamilyAndFriends
      :props_e_type="e_type"
      :props_s_extension="s_extension"
      :props_d_size="d_size"
      :props_dt_uploaded_by="dt_uploaded_by"
      :props_dt_uploaded_at="dt_uploaded_at"
      :props_s_friends_ids="s_friends_ids"
      @update-s-friends-ids="onUpdateSFriendsIds"
    ></UploadedMediaFamilyAndFriends>

    <UploadedMediaTime
      :props_e_type="e_type"
      :props_s_extension="s_extension"
      :props_d_size="d_size"
      :props_dt_uploaded_by="dt_uploaded_by"
      :props_dt_uploaded_at="dt_uploaded_at"
      :props_i_decade="i_decade"
      @update_i_decade="obUpdateIDecade"
      :props_i_year="i_year"
      @update_i_year="obUpdateIYear"
      :props_i_month="i_month"
      @update_i_month="obUpdateIMonth"
      :props_i_day="i_day"
      @update_i_day="obUpdateIDay"
    ></UploadedMediaTime>

    <UploadedMediaLocation
      :props_e_type="e_type"
      :props_s_extension="s_extension"
      :props_d_size="d_size"
      :props_dt_uploaded_by="dt_uploaded_by"
      :props_dt_uploaded_at="dt_uploaded_at"
      :props_d_longitude="d_longitude"
      @update_d_longitude="onUpdateDLongitude"
      :props_d_latitude="d_latitude"
      @update_d_latitude="onUpdateDLatitude"
      :props_s_street="s_street"
      @update_s_street="onUpdateSStreet"
      :props_s_suite="s_suite"
      @update_s_suite="onUpdateSSuite"
      :props_s_city="s_city"
      @update_s_city="onUpdateSCity"
      :props_s_state="s_state"
      @update_s_state="onUpdateSState"
      :props_s_postal_code="s_postal_code"
      @update_s_postal_code="onUpdateSPostalCode"
    ></UploadedMediaLocation>

    <UploadedMediaMemory
      :props_e_type="e_type"
      :props_s_extension="s_extension"
      :props_d_size="d_size"
      :props_dt_uploaded_by="dt_uploaded_by"
      :props_dt_uploaded_at="dt_uploaded_at"
      :props_s_memory="s_memory"
      @update-s-memory="onUpdateSMemory"
    ></UploadedMediaMemory>

    <UploadedMediaNotify
      :props_s_file="s_file"
      :props_e_type="e_type"
      :props_s_extension="s_extension"
      :props_d_size="d_size"
      :props_dt_uploaded_by="dt_uploaded_by"
      :props_dt_uploaded_at="dt_uploaded_at"
      :props_s_tags_ids="s_tags_ids"
      :props_s_friends_ids="s_friends_ids"
      :props_i_decade="i_decade"
      :props_i_year="i_year"
      :props_i_month="i_month"
      :props_i_day="i_day"
      :props_d_longitude="d_longitude"
      :props_d_latitude="d_latitude"
      :props_s_street="s_street"
      :props_s_suite="s_suite"
      :props_s_city="s_city"
      :props_s_state="s_state"
      :props_s_postal_code="s_postal_code"
      :props_s_memory="s_memory"
      :props_s_notified_users="s_notified_users"
      @update-s-notified-users="onUpdateSNotifiedUsers"
      :props_b_public="b_public"
      @update-b-public="onUpdateBPublic"
    ></UploadedMediaNotify>

    <div class="model-container" id="successModel">
      <div class="model-box">
        <img
          src="../../../assets/images/dashboard/model-box/model-box-success.svg"
          alt="success"
        />
        <h3 class="model-title">Success</h3>
        <p>Your media was successfully saved</p>
        <button class="btn-sm-dark">
          <router-link to="/Dashboard/Media" tag="a">Go to media</router-link>
        </button>
      </div>
    </div>

    <div class="model-container" id="cancelMediaModel">
      <div class="model-box">
        <h3 class="model-title">Cancel the media</h3>
        <p>
          By confirming cancellation , all the data <br />
          will not be saved , are you sure you <br />
          want to cancel ?
        </p>
        <div class="btn-group">
          <button class="btn-sm-light" @click="cancelMediaCancel">
            Cancel
          </button>
          <button class="btn-sm-dark" @click="confirmMediaCancel">
            Confirm
          </button>
        </div>
      </div>
    </div>

    <div class="model-container" id="noMoreSpace">
      <div class="model-box">
        <h3 class="model-title">Error</h3>
        <p>
          There is no space for new media . You have reached the limited cloud
          storage
        </p>
        <div class="btn-group">
          <button class="btn-sm-light" @click="hideNoMoreSpaceModel">
            Close
          </button>
          <button class="btn-sm-dark" @click="upgradePlan">Upgrade Plan</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
// import axios from "axios";
import MediaUploadSteps from "../../../components/Dashboard/MediaUpload/MediaUploadSteps.vue";
import MediaUploadEmptyStatus from "../../../components/Dashboard/MediaUpload/MediaUploadEmptyStatus.vue";
import UploadedMediaTags from "../../../components/Dashboard/MediaUpload/UploadedMediaTags.vue";
import UploadedMediaFamilyAndFriends from "../../../components/Dashboard/MediaUpload/UploadedMediaFamilyAndFriends.vue";
import UploadedMediaTime from "../../../components/Dashboard/MediaUpload/UploadedMediaTime.vue";
import UploadedMediaLocation from "../../../components/Dashboard/MediaUpload/UploadedMediaLocation.vue";
import UploadedMediaMemory from "../../../components/Dashboard/MediaUpload/UploadedMediaMemory.vue";
import UploadedMediaNotify from "../../../components/Dashboard/MediaUpload/UploadedMediaNotify.vue";
export default {
  components: {
    MediaUploadSteps,
    MediaUploadEmptyStatus,
    UploadedMediaTags,
    UploadedMediaFamilyAndFriends,
    UploadedMediaTime,
    UploadedMediaLocation,
    UploadedMediaMemory,
    UploadedMediaNotify,
  },
  name: "MediaUpload",
  data() {
    return {
      s_file: "",
      uploaded_file: "",
      e_type: "--",
      s_extension: "--",
      d_size: "--",
      dt_uploaded_by: "--",
      dt_uploaded_at: "--",
      // ste2
      s_tags_ids: [],
      // ste3
      s_friends_ids: [],
      // ste4
      i_decade: "",
      i_year: "",
      i_month: "",
      i_day: "",
      // ste5
      d_longitude: "",
      d_latitude: "",
      s_street: "",
      s_suite: "",
      s_city: "",
      s_state: "",
      s_postal_code: "",
      // ste6
      s_memory: "",
      // ste7
      s_notified_users: [],
      b_public: false,
    };
  },
  methods: {
    onUpdateSFile(newValue) {
      this.s_file = newValue;
    },
    onUpdateUploadedFile(newValue) {
      this.uploaded_file = newValue;
    },
    onUpdateEType(newValue) {
      this.e_type = newValue;
    },
    onUpdateSExtension(newValue) {
      this.s_extension = newValue;
    },
    onUpdateDSize(newValue) {
      this.d_size = newValue;
    },
    onUpdateDtUploadedBy(newValue) {
      this.dt_uploaded_by = newValue;
    },
    onUpdateDtUploadedAt(newValue) {
      this.dt_uploaded_at = newValue;
    },
    onUpdateSTagsIds(newValue) {
      this.s_tags_ids = newValue;
    },
    onUpdateSFriendsIds(newValue) {
      this.s_friends_ids = newValue;
    },
    obUpdateIDecade(newValue) {
      this.i_decade = newValue;
    },
    obUpdateIYear(newValue) {
      this.i_year = newValue;
    },
    obUpdateIMonth(newValue) {
      this.i_month = newValue;
    },
    obUpdateIDay(newValue) {
      this.i_day = newValue;
    },
    onUpdateDLongitude(newValue) {
      this.d_longitude = newValue;
    },
    onUpdateDLatitude(newValue) {
      this.d_latitude = newValue;
    },
    onUpdateSStreet(newValue) {
      this.s_street = newValue;
    },
    onUpdateSSuite(newValue) {
      this.s_suite = newValue;
    },
    onUpdateSCity(newValue) {
      this.s_city = newValue;
    },
    onUpdateSState(newValue) {
      this.s_state = newValue;
    },
    onUpdateSPostalCode(newValue) {
      this.s_postal_code = newValue;
    },
    onUpdateSMemory(newValue) {
      this.s_memory = newValue;
    },
    onUpdateSNotifiedUsers(newValue) {
      this.s_notified_users = newValue;
    },
    onUpdateBPublic(newValue) {
      this.b_public = newValue;
    },
    showCancelMediaModel() {
      $(".upload-media .model-container#cancelMediaModel").css(
        "display",
        "flex"
      );
    },
    cancelMediaCancel() {
      $(".upload-media .model-container#cancelMediaModel").hide();
    },
    confirmMediaCancel() {
      this.$router.push("/Dashboard/Media");
    },
    hideNoMoreSpaceModel() {
      $(".upload-media .model-container#noMoreSpace").hide();
    },
    upgradePlan() {
      this.$router.push('/Dashboard/Setting');
    }
  },
  async mounted() {
    $("body").css("background-image", "none");
    $(".dashboard-container .content").css("padding", "32px 25px 25px 25px");

    $(".upload-steps div").removeClass("done");
    $(".upload-steps div").removeClass("active");
    $(".upload-steps div:first").addClass("active");
  },
};
</script>

<style scoped>
@import url("../../../assets/css/upload-media.css");
</style>
