<template>
  <div class="step-box" id="emptyStatus">
    <div
      class="box-1"
      @click="openFileExplorer"
      @dragover="familyPhotoDragOver"
      @dragleave="familyPhotoDragLeave"
      @drop="familyPhotoDrop"
    >
      <button class="delete-btn" @click="removeUploadedImage">
        <img
          src="../../../assets/images/dashboard/media/trash-2.svg"
          alt="trash"
        />
        Delete
      </button>
      <input type="file" id="uploadMediaInput" @change="uploadFile" hidden />
    </div>
    <div class="box-2">
      <div class="uploaded-media-info">
        <div>
          <span>Media Type</span>
          <p v-text="eType"></p>
        </div>
        <div>
          <span>Media Format</span>
          <p v-text="sExtension"></p>
        </div>
        <div>
          <span>Media Size</span>
          <p v-text="dSize"></p>
        </div>
        <div>
          <span>Uploaded by</span>
          <p v-text="dtUploadedBy"></p>
        </div>
        <div>
          <span>Uploaded at</span>
          <p v-text="dtUploadedAt"></p>
        </div>
      </div>
      <button class="first-step-btn" disabled @click="showTagStep">Next</button>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import axios from "axios";
export default {
  name: "MediaUploadEmptyStatus",
  props: [
    "props_s_file",
    "props_e_type",
    "props_s_extension",
    "props_d_size",
    "props_dt_uploaded_by",
    "props_dt_uploaded_at",
    "uploaded_file",
  ],
  data() {
    return {
      file: this.props_s_file,
      eType: this.props_e_type,
      sExtension: this.props_s_extension,
      dSize: this.props_d_size,
      dtUploadedBy: this.props_dt_uploaded_by,
      dtUploadedAt: this.props_dt_uploaded_at,
      uploadedFile: this.uploaded_file,
    };
  },
  methods: {
    openFileExplorer() {
      const status = $("#emptyStatus .box-1").hasClass("uploaded");
      if (!status) {
        $("#emptyStatus .box-1 input").click();
      }
    },
    bytesToSize(bytes) {
      var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (bytes == 0) return "0 Byte";
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
    },
    showFile() {
      const dropArea = document.querySelector("#emptyStatus .box-1");
      let fileFormate = this.file.type;
      let fileSize = this.bytesToSize(this.file.size);
      let fileType = "";
      if (this.file.type.match("image.*")) {
        fileType = "PHOTO";
      }
      if (this.file.type.match("video.*")) {
        fileType = "VIDEO";
      }
      if (this.file.type.match("audio.*")) {
        fileType = "AUDIO";
      }
      if (this.file.type.match("application.*")) {
        fileType = "DOCUMENT";
      }

      let validExtensions = [
        "image/jpg",
        "image/jpeg",
        "image/png",
        "video/mp4",
        "audio/mp3",
        "audio/wav",
        "application/pdf",
      ];
      if (validExtensions.includes(fileFormate)) {
        if (this.file.type.match("image.*") && this.file.size > 15728640) {
          this.$toast.error("This image is too large try another one with size less than 15MB !");
          dropArea.classList.remove("uploaded");
          $(".first-step-btn").prop("disabled", true);
        } else if (
          this.file.type.match("video.*") &&
          this.file.size > 262144000
        ) {
          this.$toast.error(
            "This video is too large try another one with size less than 250MB !"
          );
          dropArea.classList.remove("uploaded");
          $(".first-step-btn").prop("disabled", true);
        } else if (
          this.file.type.match("audio.*") &&
          this.file.size > 31457280
        ) {
          this.$toast.error(
            "This audio is too large try another one with size less than 30MB !"
          );
          dropArea.classList.remove("uploaded");
          $(".first-step-btn").prop("disabled", true);
        } else {
          let fileReader = new FileReader();
          fileReader.onload = () => {
            let fileURL = fileReader.result;
            let fileElement = ``;
            if (this.file.type.match("image.*")) {
              fileElement = `<img class="uploaded-image" src="${fileURL}" alt="image">`;
            }
            if (this.file.type.match("video.*")) {
              fileElement = `<video class="uploaded-image" controls><source src="${fileURL}" type="${fileFormate}">Your browser does not support the video tag.</video>`;
            }
            if (this.file.type.match("audio.*")) {
              fileElement = `<audio class="uploaded-image" controls><source src="${fileURL}" type="${fileFormate}">Your browser does not support the audio element.</audio >`;
            }
            if (this.file.type.match("application.*")) {
              fileElement = `<object class="uploaded-image" data="${fileURL}#toolbar=0&navpanes=0&scrollbar=0" type="${fileFormate}"><iframe width="100%" height="100%" src="${fileURL}"></iframe></object>`;
            }
            $(dropArea).append(fileElement);
            this.uploadedFile = fileElement;
            this.$emit("update-uploaded-file", this.uploadedFile);
          };
          fileReader.readAsDataURL(this.file);
          this.eType = fileType;
          this.$emit("update-e-type", this.eType);
          this.sExtension = fileFormate.split("/")[1];
          this.$emit("update-s-extension", this.sExtension);
          this.dSize = fileSize;
          this.$emit("update-d-size", this.dSize);
          axios.get("/auth_user").then((res) => {
            this.dtUploadedBy = res.data.users[0].s_fullname;
            this.$emit("update-dt-uploaded-by", this.dtUploadedBy);
          });
          var today = new Date();
          var date =
            today.getFullYear() +
            "-" +
            (today.getMonth() + 1) +
            "-" +
            today.getDate();
          this.dtUploadedAt = date;
          this.$emit("update-dt-uploaded-at", this.dtUploadedAt);
        }
      } else {
        this.$toast.error("Please Upload Valid File!");
        dropArea.classList.remove("uploaded");
        $(".first-step-btn").prop("disabled", true);
      }
    },
    uploadFile(e) {
      let uploadedImages = document.querySelector(
        "#emptyStatus .uploaded-image"
      );
      let familyPhotoInput = document.querySelector("#uploadMediaInput");
      if (uploadedImages != null) {
        document
          .querySelector("#emptyStatus .box-1")
          .removeChild(uploadedImages);
      }
      if (e.target.files[0]) {
        this.file = e.target.files[0];
        this.$emit("update-s-file", this.file);
        document.querySelector("#emptyStatus .box-1").classList.add("uploaded");
        familyPhotoInput.value;
        $(".first-step-btn").prop("disabled", false);
        this.showFile();
      }
    },
    familyPhotoDragOver(e) {
      e.preventDefault();
      const dropArea = document.querySelector("#emptyStatus .box-1");
      dropArea.classList.add("uploaded");
    },
    familyPhotoDragLeave() {
      const dropArea = document.querySelector("#emptyStatus .box-1");
      dropArea.classList.remove("uploaded");
    },
    familyPhotoDrop(e) {
      e.preventDefault();
      let uploadedImages = document.querySelector(
        "#emptyStatus .uploaded-image"
      );
      let familyPhotoInput = document.querySelector("#uploadMediaInput");
      if (uploadedImages != null) {
        document
          .querySelector("#emptyStatus .box-1")
          .removeChild(uploadedImages);
      }
      this.file = e.dataTransfer.files[0];
      this.$emit("update-s-file", this.file);
      const list = new DataTransfer();
      list.items.add(this.file);
      familyPhotoInput.files = list.files;
      document.querySelector("#emptyStatus .box-1").classList.add("uploaded");
      $(".first-step-btn").prop("disabled", false);
      this.showFile();
    },
    removeUploadedImage() {
      let uploadedImages = document.querySelector(
        "#emptyStatus .box-1 .uploaded-image"
      );
      document.querySelector("#emptyStatus .box-1").removeChild(uploadedImages);
      $("#uploadMediaInput").val("");
      const dropArea = document.querySelector("#emptyStatus .box-1");
      $(dropArea).removeClass("uploaded");
      $(".first-step-btn").prop("disabled", true);
      this.file = "";
      this.$emit("update-s-file", this.file);
      this.eType = "--";
      this.$emit("update-e-type", this.eType);
      this.sExtension = "--";
      this.$emit("update-s-extension", this.sExtension);
      this.dSize = "--";
      this.$emit("update-d-size", this.dSize);
      this.dtUploadedBy = "--";
      this.$emit("update-dt-uploaded-by", this.dtUploadedBy);
      this.dtUploadedAt = "--";
      this.$emit("update-dt-uploaded-at", this.dtUploadedAt);
    },
    showTagStep() {
      $("#emptyStatus").css("display", "none");
      $("#mediaTag").css("display", "flex");
      $("#showUpload").addClass("done");
      $("#showTag").addClass("active");
      $(".box-2 .image .uploaded-image").remove();
      $(".box-2 .image").append(this.uploadedFile);
    },
    showMediaFile(media, type, formate) {
      const dropArea = $("#emptyStatus .box-1");
      $(dropArea).addClass("uploaded");
      $(".first-step-btn").prop("disabled", false);
      let fileElement = "";
      if (type == "PHOTO") {
        fileElement = `<img class="uploaded-image" src="${media}" alt="image">`;
      } else if (type == "VIDEO") {
        fileElement = `<video class="uploaded-image" controls><source src="${media}" type="video/${formate}">Your browser does not support the video tag.</video>`;
      } else if (type == "AUDIO") {
        fileElement = `<audio class="uploaded-image" controls><source src="${media}" type="audio/${formate}">Your browser does not support the audio element.</audio >`;
      } else if (type == "DOCUMENT") {
        fileElement = `<object class="uploaded-image" data="${media}#toolbar=0&navpanes=0&scrollbar=0" type="document/${formate}"><iframe width="100%" height="100%" src="${media}"></iframe></object>`;
      }
      $(dropArea).append(fileElement);
      this.uploadedFile = fileElement;
      this.$emit("update-uploaded-file", this.uploadedFile);
    },
  },
  mounted() {
    this.showMediaFile(this.file, this.eType, this.sExtension);
  },
};
</script>