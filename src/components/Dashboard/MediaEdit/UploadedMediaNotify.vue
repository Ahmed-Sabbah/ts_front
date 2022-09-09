<template>
  <div class="step-box next-step" id="mediaNotify">
    <div class="box-1">
      <h3 class="box-1-title">Notify</h3>
      <p class="box-1-description">Description paragraph</p>

      <div class="tags">
        <div class="input-group" v-for="user in usersList" :key="user.pk_i_id">
          <label
            ><input
              type="checkbox"
              :value="user.pk_i_id"
              :checked="Object.values(selectedUsers).includes(user.pk_i_id)"
              @change="selectedUsersFilter($event)"
            /><span class="checkmark"></span>
            <p>{{ user.s_fullname }}</p></label
          >
        </div>
      </div>

      <div class="media-status">
        <p>Media Status</p>
        <div class="form-group">
          <div class="input-group">
            <label for="private">
              <input
                type="radio"
                name="status"
                value="false"
                :checked="props_b_public == false"
                id="private"
                @change="changeStatus($event)"
              />
              <span class="checkmark"></span>&emsp; Private
            </label>
          </div>
          <div class="input-group">
            <label for="public">
              <input
                type="radio"
                name="status"
                value="true"
                :checked="props_b_public == true"
                id="public"
                @change="changeStatus($event)"
              />
              <span class="checkmark"></span>&emsp; Public
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="box-2">
      <div class="image">
        <!-- {{ showImage }} -->
      </div>
      <div class="uploaded-media-info">
        <div>
          <span>Media Type</span>
          <p v-text="props_e_type"></p>
        </div>
        <div>
          <span>Media Format</span>
          <p v-text="props_s_extension"></p>
        </div>
        <div>
          <span>Media Size</span>
          <p v-text="props_d_size"></p>
        </div>
        <div>
          <span>Uploaded by</span>
          <p v-text="props_dt_uploaded_by"></p>
        </div>
        <div>
          <span>Uploaded at</span>
          <p v-text="props_dt_uploaded_at"></p>
        </div>
      </div>
      <div class="btn-group">
        <button class="back-btn" @click="showMediaMemoryStep">Back</button>
        <button class="next-btn" @click="submitMedia" id="loadingBtn">
          Save Media <img src="../../../assets/images/loading.gif" alt="loading" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import axios from "axios";

export default {
  name: "UploadedMediaNotify",
  props: [
    "props_s_file",
    "props_e_type",
    "props_s_extension",
    "props_d_size",
    "props_dt_uploaded_by",
    "props_dt_uploaded_at",
    "props_s_tags_ids",
    "props_s_friends_ids",
    "props_i_decade",
    "props_i_year",
    "props_i_month",
    "props_i_day",
    "props_d_longitude",
    "props_d_latitude",
    "props_s_street",
    "props_s_suite",
    "props_s_city",
    "props_s_state",
    "props_s_postal_code",
    "props_s_memory",
    "props_s_notified_users",
    "props_b_public",
  ],
  data() {
    return {
      file: this.props_s_file,
      type: this.props_e_type,
      extension: this.props_s_extension,
      size: this.props_d_size,
      tags: this.props_s_tags_ids,
      friends: this.props_s_friends_ids,
      uploadDate: this.props_dt_upload_date,
      longitude: this.props_d_longitude,
      latitude: this.props_d_latitude,
      street: this.props_s_street,
      suite: this.props_s_suite,
      city: this.props_s_city,
      state: this.props_s_state,
      postalCode: this.props_s_postal_code,
      memory: this.props_s_memory,
      usersList: [],
      selectedUsers: this.props_s_notified_users,
      mediaStatus: this.props_b_public,
      mediaID: this.$route.params.id,
    };
  },
  methods: {
    showMediaMemoryStep() {
      $("#mediaNotify").css("display", "none");
      $("#mediaMemory").css("display", "flex");
      $("#showNotify").removeClass("done");
      $("#showNotify").removeClass("active");
      $("#showMemory").removeClass("done");
    },
    async submitMedia() {
      $(".upload-media .box-2 .btn-group #loadingBtn").prop("disabled", true);
      const mediaData = new FormData();
      mediaData.append("s_file", this.props_s_file);
      mediaData.append("e_type", this.props_e_type);
      mediaData.append("s_extension", this.props_s_extension);
      mediaData.append("d_size", this.props_d_size);
      mediaData.append("s_tags_ids", this.props_s_tags_ids);
      mediaData.append("s_friends_ids", this.props_s_friends_ids);
      mediaData.append("i_decade", this.props_i_decade);
      mediaData.append("i_year", this.props_i_year);
      mediaData.append("s_month", this.props_i_month);
      mediaData.append("i_day", this.props_i_day);
      mediaData.append("d_longitude", this.props_d_longitude);
      mediaData.append("d_latitude", this.props_d_latitude);
      mediaData.append("s_street", this.props_s_street);
      mediaData.append("s_suite", this.props_s_suite);
      mediaData.append("s_city", this.props_s_city);
      mediaData.append("s_state", this.props_s_state);
      mediaData.append("s_postal_code", this.props_s_postal_code);
      mediaData.append("s_memory", this.props_s_memory);
      mediaData.append("s_notified_users", this.selectedUsers);
      mediaData.append("b_public", this.mediaStatus);
      mediaData.append("pk_i_id", this.mediaID);

      // console.log("s_file  =>  "+ this.props_s_file);
      // console.log("e_type  =>  "+ this.props_e_type);
      // console.log("s_extension  =>  "+ this.props_s_extension);
      // console.log("d_size  =>  "+ this.props_d_size);
      // console.log("s_tags_ids  =>  "+ this.props_s_tags_ids);
      // console.log("s_friends_ids  =>  "+ this.props_s_friends_ids);
      // console.log("i_decade  =>  "+ this.props_i_decade);
      // console.log("i_year  =>  "+ this.props_i_year);
      // console.log("i_month  =>  "+ this.props_i_month);
      // console.log("i_day  =>  "+ this.props_i_day);
      // console.log("d_longitude  =>  "+ this.props_d_longitude);
      // console.log("d_latitude  =>  "+ this.props_d_latitude);
      // console.log("s_street  =>  "+ this.props_s_street);
      // console.log("s_suite  =>  "+ this.props_s_suite);
      // console.log("s_city  =>  "+ this.props_s_city);
      // console.log("s_state  =>  "+ this.props_s_state);
      // console.log("s_postal_code  =>  "+ this.props_s_postal_code);
      // console.log("s_memory  =>  "+ this.props_s_memory);
      // console.log("s_notified_users  =>  "+ this.selectedUsers);
      // console.log("b_public  =>  "+ this.mediaStatus);

      await axios.post("/media/add_edit", mediaData).then(
        (response) => {
          if (!response.data.status.success) {
            $(".upload-media .box-2 .btn-group #loadingBtn").prop("disabled", false);
            this.$toast.error(response.data.status.message);
          } else {
            // console.log(response.data.media[0]);
            $(".upload-media .box-2 .btn-group #loadingBtn").prop("disabled", false);
            $(".upload-media .model-container#successModel").css("display", "flex");
          }
        }
      );

      $("#showNotify").addClass("done");
    },
    selectedUsersFilter(event) {
      if (event.target.checked) {
        const user_id = event.target.value;
        this.selectedUsers.push(user_id);
        this.$emit("update-s-notified-users", this.selectedUsers);
      } else {
        const user_id = event.target.value;
        let memberIndex = this.selectedUsers.indexOf(user_id);
        this.selectedUsers.splice(memberIndex, 1);
        this.$emit("update-s-notified-users", this.selectedUsers);
      }
    },
    changeStatus(event) {
      let status = event.target.value;
      this.mediaStatus = status;
      console.log(this.mediaStatus);
      this.$emit("update-b-public", this.mediaStatus);
    },
  },
  async mounted() {
    await axios.get("/users").then((res) => {
      if (res.data.status.success) {
        this.usersList = res.data.users;
      }
    });

    $("#mediaNotify .box-2 .btn-group .next-btn").prop("disabled", false);
  },
};
</script>