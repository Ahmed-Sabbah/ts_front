<template>
  <div class="profile">
    <div class="data">
      <div class="user">
        <div class="user-image">
          <img :src="userPhoto" alt="user" v-if="userPhoto" />
          <img
            src="../../assets/images/dashboard/side-menu-icons/accounts.svg"
            alt="accounts"
            v-else
          />
          <p @click="openFileExplorerForUserImage">upload image</p>
        </div>
        <input
          type="file"
          id="userImage"
          @change="uploadUserImage"
          hidden
        />
        <div class="info">
          <h3 v-text="fullName"></h3>
          <span>Gate Keeper</span>
          <a href="javascript:void(0)" @click="logout">Log out</a>
        </div>
      </div>
      <div class="submit">
        <button @click="submitAction" id="loadingBtn">
          Save Changes
          <img src="../../assets/images/loading.gif" alt="loading" />
        </button>
      </div>
    </div>
    <div class="setting">
      <form>
        <div class="information-setting">
          <p class="title">Information Settings</p>
          <div v-if="profileErrors.length" style="margin: 20px 0">
            <b style="color: brown">Please correct the following error(s):</b>
            <ul>
              <li v-for="error in profileErrors" :key="error">{{ error }}</li>
            </ul>
          </div>
          <div class="form-group">
            <label for="fullName">Full Name</label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              v-model="fullName"
            />
          </div>
          <div class="form-group">
            <label for="email">Email address</label>
            <input type="email" name="email" id="email" v-model="email" />
          </div>
          <div class="form-group">
            <label for="familyName">Family Name</label>
            <input
              type="text"
              name="familyName"
              id="familyName"
              v-model="familyName"
            />
          </div>
          <div class="form-group">
            <label for="familyPhoto">Family photo</label>
            <div
              id="familyphoto"
              @click="openFileExplorer"
              @dragover="familyPhotoDragOver"
              @dragleave="familyPhotoDragLeave"
              @drop="familyPhotoDrop"
            >
              <!-- <p>Click or drag<br>to upload</p> -->
              <input
                type="file"
                id="familyPhotoInput"
                @change="uploadFile"
                ref="image"
                hidden
              />
            </div>
          </div>
        </div>
        <div class="password-setting">
          <p class="title">Password Settings</p>
          <div v-if="passwordErrors.length" style="margin: 20px 0">
            <b style="color: brown">Please correct the following error(s):</b>
            <ul>
              <li v-for="error in passwordErrors" :key="error">{{ error }}</li>
            </ul>
          </div>
          <div class="form-group">
            <label for="oldPassword">Old Password</label>
            <input
              type="password"
              name="oldPassword"
              id="oldPassword"
              v-model="oldPassword"
            />
          </div>
          <div class="form-group">
            <label for="newPassword">New Password</label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              v-model="newPassword"
            />
          </div>
          <div class="form-group">
            <label for="confirmNewPassword">Confirm New Password</label>
            <input
              type="password"
              name="confirmNewPassword"
              id="confirmNewPassword"
              v-model="confirmNewPassword"
            />
          </div>
        </div>
      </form>
    </div>
    <div class="model-container" id="successfullModel">
      <div class="model-box">
        <img
          src="../../assets/images/dashboard/model-box/model-box-success.svg"
          alt="success"
        />
        <h3 class="model-title">Success</h3>
        <p>Changes done successfully</p>
        <button class="btn-sm-dark" @click="closeSuccessfullModel">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import axios from "axios";

export default {
  name: "GatekeeperProfile",
  props: ["authUser"],
  data() {
    return {
      userObj: this.authUser,
      fullName: "",
      email: "",
      familyName: "",
      familyImage: "",
      userPhoto: "",
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      file: "",
      profileErrors: [],
      passwordErrors: [],
    };
  },
  methods: {
    closeSuccessfullModel() {
      $(".profile #successfullModel").hide();
    },
    async submitAction() {
      this.profileErrors = [];
      this.passwordErrors = [];

      $(
        ".dashboard-container .content .profile .data .submit #loadingBtn"
      ).prop("disabled", true);
      const profileData = new FormData();
      profileData.set("s_fullname", this.fullName);
      profileData.set("s_family_name", this.familyName);
      profileData.set("s_email", this.email);
      if (this.oldPassword != "") {
        profileData.set("s_old_password", this.oldPassword);
      }
      if (this.newPassword != "") {
        profileData.set("s_new_password", this.newPassword);
        profileData.set("s_new_password_confirmation", this.confirmNewPassword);
      }
      let userImage = document.getElementById("userImage");
      if (userImage.files[0]) {
        profileData.set("s_image", userImage.files[0]);
      }
      if (this.$refs.image.files[0]) {
        profileData.set("s_family_image", this.$refs.image.files[0]);
      }

      await axios.post("/updateProfile", profileData).then(
        (response) => {
          if (!response.data.status.success) {
            $(
              ".dashboard-container .content .profile .data .submit #loadingBtn"
            ).prop("disabled", false);
            this.$toast.error(response.data.status.message);
          } else {
            axios.get("/auth_user").then((res) => {
              $(
                ".dashboard-container .content .profile .data .submit #loadingBtn"
              ).prop("disabled", false);
              $(".profile .data .user .user-image .test").remove("");
              this.$store.dispatch("GetUser", res.data.users[0]);
              this.userObj = res.data.users[0];
              this.$emit("update_user", this.userObj);
              this.fullName = res.data.users[0].s_fullname;
              this.email = res.data.users[0].s_email;
              this.familyName = res.data.users[0].s_family_name;
              this.familyImage = res.data.users[0].s_family_image;
              this.userPhoto = res.data.users[0].s_image;
              this.newPassword = "";
              this.confirmNewPassword = "";
              $(".profile #successfullModel").css("display", "flex");
            });
          }
        },
        (error) => {
          $(
            ".dashboard-container .content .profile .data .submit #loadingBtn"
          ).prop("disabled", false);
          let err = error.response.data.errors;
          for (const key in err) {
            for (let i = 0; i < err[key].length; i++) {
              if (
                key == "password" ||
                key == "s_old_password" ||
                key == "s_new_password"
              ) {
                this.passwordErrors.push(err[key][i]);
              } else {
                this.profileErrors.push(err[key][i]);
              }
            }
          }
          this.$toast.error(error.response.data.message);
        }
      );
    },
    openFileExplorer() {
      $("#familyphoto input").click();
    },
    openFileExplorerForUserImage() {
      $("input#userImage").click();
    },
    uploadFile(e) {
      let uploadedImages = document.querySelector("#familyphoto img");
      let familyPhotoInput = document.querySelector("#familyPhotoInput");
      if (uploadedImages != null) {
        document.querySelector("#familyphoto").removeChild(uploadedImages);
      }
      if (e.target.files[0]) {
        this.file = e.target.files[0];
        document.querySelector("#familyphoto").classList.add("active");
        familyPhotoInput.value;
        this.showFile();
      }
    },
    uploadUserImage(e) {
      let uploadedImages = document.querySelector(
        ".profile .data .user .user-image img"
      );
      if (uploadedImages != null) {
        document
          .querySelector(".profile .data .user .user-image")
          .removeChild(uploadedImages);
      }
      if (e.target.files[0]) {
        this.userPhoto = e.target.files[0];
        this.showUserImageFile();
      }
    },
    showFile() {
      const dropArea = document.querySelector("#familyphoto");
      let fileType = this.file.type;
      let validExtensions = ["image/jpeg", "image/jpg", "image/png"];
      if (validExtensions.includes(fileType)) {
        let fileReader = new FileReader();
        fileReader.onload = () => {
          let fileURL = fileReader.result;
          let imgTag = `<img src="${fileURL}" alt="image">`;
          $(dropArea).append(imgTag);
        };
        fileReader.readAsDataURL(this.file);
      } else {
        this.$toast.error("This is not an Image File!");
        dropArea.classList.remove("active");
      }
    },
    showUserImageFile() {
      let uploadedImages = document.querySelector(
        ".profile .data .user .user-image"
      );
      let fileType = this.userPhoto.type;
      let validExtensions = ["image/jpeg", "image/jpg", "image/png"];
      if (validExtensions.includes(fileType)) {
        let fileReader = new FileReader();
        fileReader.onload = () => {
          let fileURL = fileReader.result;
          let imgTag = `<img src="${fileURL}" alt="image">`;
          $(uploadedImages).prepend(imgTag);
        };
        fileReader.readAsDataURL(this.userPhoto);
      } else {
        this.userPhoto = "";
        this.$toast.error("This is not an Image File!");
      }
    },
    familyPhotoDragOver(e) {
      e.preventDefault();
      const dropArea = document.querySelector("#familyphoto");
      dropArea.classList.add("active");
    },
    familyPhotoDragLeave() {
      const dropArea = document.querySelector("#familyphoto");
      dropArea.classList.remove("active");
    },
    familyPhotoDrop(e) {
      e.preventDefault();
      let uploadedImages = document.querySelector("#familyphoto img");
      let familyPhotoInput = document.querySelector("#familyPhotoInput");
      if (uploadedImages != null) {
        document.querySelector("#familyphoto").removeChild(uploadedImages);
      }
      this.file = e.dataTransfer.files[0];
      const list = new DataTransfer();
      list.items.add(this.file);
      familyPhotoInput.files = list.files;
      document.querySelector("#familyphoto").classList.add("active");
      this.showFile();
    },
    logout() {
      this.$store.dispatch("Logout").then(() => {
        this.$router.push("/Login");
      });
    },
  },
  async mounted() {
    $("body").css("background-image", "none");
    $(".dashboard-container .content").css("padding", "32px 25px 0 25px");
    $(".dashboard-container .content .setting").css("padding-bottom", "80px");

    await axios.get("/auth_user").then((res) => {
      if (
        res.data.users[0].e_type == "CONTRIBUTOR") {
        this.$router.push("/ContributorProfile");
      }

      this.fullName = res.data.users[0].s_fullname;
      this.email = res.data.users[0].s_email;
      if (res.data.users[0].s_family_name == "null") {
        this.familyName = "";
      } else {
        this.familyName = res.data.users[0].s_family_name;
      }
      this.familyImage = res.data.users[0].s_family_image;
      this.userPhoto = res.data.users[0].s_image;
    });
  },
};
</script>

<style scoped>
@import "../../assets/css/profile.css";
</style>
