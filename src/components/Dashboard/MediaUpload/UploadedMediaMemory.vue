<template>
  <div class="step-box next-step" id="mediaMemory">
    <div class="box-1">
      <h3 class="box-1-title">Memory</h3>
      <p class="box-1-description">Description paragraph</p>

      <div class="memory-form">
        <form>
          <textarea
            placeholder="Describe the memory of this media"
            v-model="mediaDescription"
            id="SMemory"
          ></textarea>
        </form>
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
        <button class="back-btn" @click="showMediaLocationStep">Back</button>
        <button class="next-btn" disabled @click="showMediaNotifyStep">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  name: "UploadedMediaMemory",
  props: [
    "props_e_type",
    "props_s_extension",
    "props_d_size",
    "props_dt_uploaded_by",
    "props_dt_uploaded_at",
    "uploaded_file",
    "props_s_memory",
  ],
  data() {
    return {
      mediaDescription: this.props_s_memory,
    };
  },
  methods: {
    showMediaLocationStep() {
      $("#mediaMemory").css("display", "none");
      $("#mediaLocation").css("display", "flex");
      $("#showMemory").removeClass("active");
      $("#showLocation").removeClass("done");
    },
    showMediaNotifyStep() {
      this.mediaDescription = $("#mediaMemory .memory-form #SMemory").val();
      this.$emit("update-s-memory", this.mediaDescription);

      $("#mediaMemory").css("display", "none");
      $("#mediaNotify").css("display", "flex");
      $("#showMemory").addClass("done");
      $("#showNotify").addClass("active");
    },
  },
  watch: {
    mediaDescription: function (val) {
      this.mediaDescription = val;

      if (this.mediaDescription == "") {
        $(".upload-media #mediaMemory .box-2 .btn-group .next-btn").prop(
          "disabled",
          true
        );
      } else {
        $(".upload-media #mediaMemory .box-2 .btn-group .next-btn").prop(
          "disabled",
          false
        );
      }
    },
  },
};
</script>
