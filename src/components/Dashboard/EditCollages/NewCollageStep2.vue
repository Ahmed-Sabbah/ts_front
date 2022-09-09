<template>
  <div class="create-collage" id="step2">
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
        <p>Step 2 of 3: <span>Layout</span></p>
        <div class="range">
          <span style="width: 33.333%"></span>
        </div>
      </div>
      <div class="second-step">
        <div class="layout-info">
          <div class="collage-type">
            <h2 class="title">Collage Type</h2>
            <div class="edit-collage disabled">
              <p>{{ e_type }} Collage</p>
              <img
                src="../../../assets/images/dashboard/media/edit.svg"
                alt="edit"
              />
            </div>
          </div>
          <div class="photos-num">
            <span>No. Of photos</span>
            <button
              :class="{
                selected: collagePhotosNo == 20,
                disabled: collagePhotosNo != 20,
              }"
            >
              20
            </button>
            <button
              :class="{
                selected: collagePhotosNo == 24,
                disabled: collagePhotosNo != 24,
              }"
            >
              24
            </button>
            <button
              :class="{
                selected: collagePhotosNo == 32,
                disabled: collagePhotosNo != 32,
              }"
            >
              32
            </button>
            <button
              :class="{
                selected: collagePhotosNo == 48,
                disabled: collagePhotosNo != 48,
              }"
            >
              48
            </button>
          </div>
          <div class="collage-orientation">
            <h2 class="title">Collage Orientation</h2>
            <div class="orientation disabled" style="display: flex">
              <p>{{ collageOrientation }}</p>
              <img
                src="../../../assets/images/dashboard/media/edit.svg"
                alt="edit"
              />
            </div>
          </div>
          <div class="print-size" v-if="e_type == 'PRINTABLE'">
            <span>Size of final print</span>
            <div class="selected-size">
              <p>{{ s_size }}</p>
              <img
                src="../../../assets/images/dashboard/media/edit.svg"
                alt="edit"
              />
            </div>
          </div>
          <div
            class="print-size-choice portrait"
            v-if="e_type == 'PRINTABLE' && e_orientation == 'PORTRAIT'"
          >
            <button disabled v-if="s_size == '17’’ × 24’’'">17’’ × 24’’</button>
            <button disabled v-if="s_size == '24’’ × 36’’'">24’’ × 36’’</button>
            <button disabled v-if="s_size == '36’’ × 48’’'">36’’ × 48’’</button>
          </div>
          <div
            class="print-size-choice landscape"
            v-if="e_type == 'PRINTABLE' && e_orientation == 'LANDSCAPE'"
          >
            <button disabled v-if="s_size == '17’’ × 24’’'">17’’ × 24’’</button>
            <button disabled v-if="s_size == '24’’ × 36’’'">24’’ × 36’’</button>
            <button disabled v-if="s_size == '36’’ × 48’’'">36’’ × 48’’</button>
          </div>
          <div
            class="btn-group"
            v-if="collagePhotosNo != '' && collageOrientation != ''"
          >
            <button @click="showStep3()">Next</button>
          </div>
        </div>
        <div class="layout-shap">
          <h2>Collage Layout</h2>
          <img
            id="portrait-layout-size-20"
            class="portrait-layout"
            src="../../../assets/images/dashboard/collages/portrait-layout-size-20.svg"
            alt="portrait-layout-size-20"
            v-if="collagePhotosNo == 20 && collageOrientation == 'PORTRAIT'"
          />
          <img
            id="landscape-layout-size-20"
            class="landscape-layout"
            src="../../../assets/images/dashboard/collages/landscape-layout-size-20.svg"
            alt="landscape-layout-size-20"
            v-else-if="
              collagePhotosNo == 20 && collageOrientation == 'LANDSCAPE'
            "
          />
          <img
            id="portrait-layout-size-24"
            class="portrait-layout"
            src="../../../assets/images/dashboard/collages/portrait-layout-size-24.svg"
            alt="portrait-layout-size-24"
            v-if="collagePhotosNo == 24 && collageOrientation == 'PORTRAIT'"
          />
          <img
            id="landscape-layout-size-24"
            class="landscape-layout"
            src="../../../assets/images/dashboard/collages/landscape-layout-size-24.svg"
            alt="landscape-layout-size-24"
            v-else-if="
              collagePhotosNo == 24 && collageOrientation == 'LANDSCAPE'
            "
          />
          <img
            id="portrait-layout-size-32"
            class="portrait-layout"
            src="../../../assets/images/dashboard/collages/portrait-layout-size-32.svg"
            alt="portrait-layout-size-32"
            v-if="collagePhotosNo == 32 && collageOrientation == 'PORTRAIT'"
          />
          <img
            id="landscape-layout-size-32"
            class="landscape-layout"
            src="../../../assets/images/dashboard/collages/landscape-layout-size-32.svg"
            alt="landscape-layout-size-32"
            v-else-if="
              collagePhotosNo == 32 && collageOrientation == 'LANDSCAPE'
            "
          />
          <img
            id="portrait-layout-size-48"
            class="portrait-layout"
            src="../../../assets/images/dashboard/collages/portrait-layout-size-48.svg"
            alt="portrait-layout-size-48"
            v-if="collagePhotosNo == 48 && collageOrientation == 'PORTRAIT'"
          />
          <img
            id="landscape-layout-size-48"
            class="landscape-layout"
            src="../../../assets/images/dashboard/collages/landscape-layout-size-48.svg"
            alt="landscape-layout-size-48"
            v-else-if="
              collagePhotosNo == 48 && collageOrientation == 'LANDSCAPE'
            "
          />
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
  name: "NewCollageStep2",
  props: ["e_type", "i_num_photo", "e_orientation", "s_size"],
  data() {
    return {
      collagePhotosNo: this.i_num_photo,
      collageOrientation: this.e_orientation,
      collagePrintSize: this.s_size,
    };
  },
  methods: {
    defaultCollagePhotosNo(num) {
      this.collagePhotosNo = num;
      this.$emit("update_i_num_photo", this.collagePhotosNo);
    },
    showStep3() {
      $(".create-collage#step2").hide();
      $(".create-collage#step3").css("display", "flex");
      $(".create-collage#step3")
        .closest(".dashboard-container .content")
        .css("padding", "0");
      $(".create-collage#step3 .step3").css("padding", "32px 25px 0 25px");
    },
    showCancelCollageModel() {
      $(".create-collage#step2 .model-container#cancelCollageModel").css(
        "display",
        "flex"
      );
    },
    cancelCollageCancel() {
      $(".create-collage#step2 .model-container#cancelCollageModel").hide();
    },
    confirmCollageCancel() {
      this.$router.push("/Dashboard/Collages");
    },
  },
  mounted() {
    this.defaultCollagePhotosNo(this.collagePhotosNo);
  },
};
</script>

