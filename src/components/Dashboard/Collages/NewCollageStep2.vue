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
            <div class="edit-collage">
              <p>{{ e_type }} Collage</p>
              <img
                src="../../../assets/images/dashboard/media/edit.svg"
                alt="edit"
                @click="showFirstStep()"
              />
            </div>
          </div>
          <div class="photos-num">
            <span>No. Of photos</span>
            <button @click="selectCollagePhotosNo(20, $event)">20</button>
            <button @click="selectCollagePhotosNo(24, $event)">24</button>
            <button @click="selectCollagePhotosNo(32, $event)">32</button>
            <button @click="selectCollagePhotosNo(48, $event)">48</button>
          </div>
          <div class="collage-orientation">
            <h2 class="title">Collage Orientation</h2>
            <div class="orientation">
              <p>{{ collageOrientation }}</p>
              <img
                src="../../../assets/images/dashboard/media/edit.svg"
                alt="edit"
                @click="showOrientationsChoice()"
              />
            </div>
          </div>
          <div class="orientations-choice">
            <button
              id="portraitOrientation"
              @click="selectCollageOrientation('PORTRAIT')"
            >
              Portrait
            </button>
            <button
              id="landscapeOrientation"
              @click="selectCollageOrientation('LANDSCAPE')"
            >
              Landscape
            </button>
          </div>
          <div
            class="print-size"
            v-if="
              e_type == 'PRINTABLE' && e_orientation != '' && i_num_photo != ''
            "
          >
            <span>Size of final print</span>
            <div class="selected-size">
              <p>
                {{ collagePrintSize }}
              </p>
              <img
                src="../../../assets/images/dashboard/media/edit.svg"
                alt="edit"
                @click="showPrintSizeChoice()"
              />
            </div>
          </div>
          <div
            class="print-size-choice portrait"
            v-if="
              e_type == 'PRINTABLE' &&
              e_orientation == 'PORTRAIT' &&
              i_num_photo != ''
            "
          >
            <button @click="selectPrintSize('17’’ × 24’’')">17’’ × 24’’</button>
            <button @click="selectPrintSize('24’’ × 36’’')">24’’ × 36’’</button>
            <button @click="selectPrintSize('36’’ × 48’’')">36’’ × 48’’</button>
          </div>
          <div
            class="print-size-choice landscape"
            v-if="
              e_type == 'PRINTABLE' &&
              e_orientation == 'LANDSCAPE' &&
              i_num_photo != ''
            "
          >
            <button @click="selectPrintSize('17’’ × 24’’')">17’’ × 24’’</button>
            <button @click="selectPrintSize('24’’ × 36’’')">24’’ × 36’’</button>
            <button @click="selectPrintSize('36’’ × 48’’')">36’’ × 48’’</button>
          </div>

          <div
            class="btn-group"
            v-if="
              e_type == 'SCREEN' &&
              collagePhotosNo != '' &&
              collageOrientation != ''
            "
          >
            <button @click="showStep3()">Next</button>
          </div>
          <div
            class="btn-group"
            v-else-if="
              e_type == 'PRINTABLE' &&
              collagePhotosNo != '' &&
              collageOrientation != '' &&
              collagePrintSize != ''
            "
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
    showFirstStep() {
      $(".create-collage#step2").hide();
      $(".create-collage#step1").show();
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
    selectCollagePhotosNo(num, e) {
      this.collagePhotosNo = num;
      this.$emit("update_i_num_photo", this.collagePhotosNo);
      $(".create-collage#step2 .photos-num button").removeClass("selected");
      if (e) {
        $(e.target).addClass("selected");
      }
    },
    showOrientationsChoice() {
      $(".create-collage#step2 .orientation").hide();
      $(".create-collage#step2 .orientations-choice").css("display", "flex");
    },
    selectCollageOrientation(orientation) {
      this.collageOrientation = orientation;
      this.$emit("update_e_orientation", this.collageOrientation);
      $(".create-collage#step2 .orientations-choice").hide();
      $(".create-collage#step2 .orientation").css("display", "flex");
    },
    showPrintSizeChoice() {
      $(".create-collage#step2 .print-size .selected-size").hide();
      $(".create-collage#step2 .print-size-choice").css("display", "flex");
      this.collagePrintSize = "";
      this.$emit("update_s_size", this.collagePrintSize);
    },
    selectPrintSize(size) {
      this.collagePrintSize = size;
      this.$emit("update_s_size", this.collagePrintSize);
      $(".create-collage#step2 .print-size-choice").hide();
      $(".create-collage#step2 .print-size .selected-size").css(
        "display",
        "flex"
      );
    },
    showStep3() {
      $(".create-collage#step2").hide();
      $(".create-collage#step3").css("display", "flex");
      $(".create-collage#step3")
        .closest(".dashboard-container .content")
        .css("padding", "0");
      $(".create-collage#step3 .step3").css("padding", "32px 25px 0 25px");
    },
    // checkEType() {
    //   if (this.e_type == "PRINTABLE") {
    //     this.collagePrintSize = "17’’ × 24’’";
    //     this.$emit("update_s_size", this.collagePrintSize);
    //   } else {
    //     this.collagePrintSize = null;
    //     this.$emit("update_s_size", this.collagePrintSize);
    //   }
    //   return this.collagePrintSize;
    // },
  },
};
</script>

