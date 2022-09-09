<template>
  <div class="create-collage" id="step1">
    <div class="create-collage-box">
      <a
        href="javascript:void(0)"
        @click="showCancelCollageModel"
        class="back-link"
      >
        <img
          src="../../../assets/images/dashboard/contributors/back.svg"
          alt="back"
        />
        Cancel the collages
      </a>
      <div class="collage-steps">
        <p>Step 1 of 3: <span>General Info</span></p>
        <div class="range">
          <span style="width: 0"></span>
        </div>
      </div>
      <div class="first-step">
        <form>
          <div class="input-group">
            <label>Collage Name <span>*</span></label>
            <input type="text" name="collage_name" v-model="collageName" />
          </div>
        </form>
        <div class="collage-type">
          <h2>Collage Type</h2>
          <p>Select the type of your collage <span>*</span></p>
          <button
            class="screen"
            @click="selectCollageType('SCREEN', $event)"
            :disabled="collageType != 'SCREEN'"
          >
            <!-- :disabled="collageType != 'SCREEN'" -->
            Screen Collage
          </button>
          <button
            class="printable"
            @click="selectCollageType('PRINTABLE', $event)"
            :disabled="collageType != 'PRINTABLE'"
          >
            <!-- :disabled="collageType != 'PRINTABLE'" -->
            Printable Collage
          </button>
        </div>
      </div>
    </div>
    <div class="model-container" id="cancelCollageModel">
      <div class="model-box">
        <h3 class="model-title">Cancel the collage</h3>
        <p>
          By confirming cancellation , all the data <br />
          will not be saved , are you sure you <br />
          want to cancel ?
        </p>
        <div class="btn-group">
          <button class="btn-sm-light" @click="cancelCollageCancel">
            Cancel
          </button>
          <button class="btn-sm-dark" @click="confirmCollageCancel">
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "NewCollageStep1",
  props: ["s_name", "e_type"],
  data() {
    return {
      collageName: this.s_name,
      collageType: this.e_type,
    };
  },
  methods: {
    selectCollageType() {
      // this.collageType = type;
      // this.$emit("update_e_type", this.collageType);
      // $(".create-collage#step1 .collage-type button").removeClass("selected");
      // $(e.target).addClass("selected");
      $(".create-collage#step1").hide();
      $(".create-collage#step2").show();
    },
    showCancelCollageModel() {
      $(".create-collage#step1 .model-container#cancelCollageModel").css(
        "display",
        "flex"
      );
    },
    cancelCollageCancel() {
      $(".create-collage#step1 .model-container#cancelCollageModel").hide();
    },
    confirmCollageCancel() {
      this.$router.push("/Dashboard/Collages");
    },
  },
  watch: {
    collageName: function (val) {
      this.collageName = val;
      this.$emit("update_s_name", this.collageName);
      if (this.collageName == "") {
        $(".create-collage#step1 .collage-type button").removeClass("selected");
        $(".create-collage#step1 .collage-type button").attr("disabled", true);
      } else {
        if (this.collageType == "SCREEN") {
          $(".create-collage#step1 .collage-type button.screen").attr(
            "disabled",
            false
          );
        } else {
          $(".create-collage#step1 .collage-type button.printable").attr(
            "disabled",
            false
          );
        }
      }
    },
  },
};
</script>

