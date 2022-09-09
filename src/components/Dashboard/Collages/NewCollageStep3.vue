<template>
  <div class="create-collage" id="step3">
    <div class="create-collage-box step3">
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
        <p>Step 3 of 3: <span>Build</span></p>
        <div class="range">
          <span style="width: 66.666%"></span>
        </div>
      </div>
      <input type="file" hidden id="screenshotFile" ref="screenshotPhoto" />
      <!-- <div id="out_image"></div> -->
      <MediaFilter
        :mediaList="mediaList"
        @updateMediaList="updateMediaList"
      ></MediaFilter>
      <MediaBox
        :mediaList="mediaList"
        @updateMediaList="updateMediaList"
        :emptyState="emptyState"
      ></MediaBox>
    </div>
    <div class="preview-collage">
      <div class="preview-collage-box">
        <h2>Collage Preview</h2>
        <p>Drag the selected photo and drop in the collage</p>
        <LandscapCollageSize20
          v-if="e_orientation == 'LANDSCAPE' && i_num_photo == 20"
          :droppedMediaList="droppedMediaList"
          @updateDroppedMediaList="updateDroppedMediaList"
          :orderKeysArr="orderKeysArr"
          @updateOrderKeysArr="updateOrderKeysArr"
          :orderValuesArr="orderValuesArr"
          @updateOrderValuesArr="updateOrderValuesArr"
        ></LandscapCollageSize20>
        <PortraitCollageSize20
          v-else-if="e_orientation == 'PORTRAIT' && i_num_photo == 20"
          :droppedMediaList="droppedMediaList"
          @updateDroppedMediaList="updateDroppedMediaList"
          :orderKeysArr="orderKeysArr"
          @updateOrderKeysArr="updateOrderKeysArr"
          :orderValuesArr="orderValuesArr"
          @updateOrderValuesArr="updateOrderValuesArr"
        ></PortraitCollageSize20>
        <LandscapCollageSize24
          v-else-if="e_orientation == 'LANDSCAPE' && i_num_photo == 24"
          :droppedMediaList="droppedMediaList"
          @updateDroppedMediaList="updateDroppedMediaList"
          :orderKeysArr="orderKeysArr"
          @updateOrderKeysArr="updateOrderKeysArr"
          :orderValuesArr="orderValuesArr"
          @updateOrderValuesArr="updateOrderValuesArr"
        ></LandscapCollageSize24>
        <PortraitCollageSize24
          v-else-if="e_orientation == 'PORTRAIT' && i_num_photo == 24"
          :droppedMediaList="droppedMediaList"
          @updateDroppedMediaList="updateDroppedMediaList"
          :orderKeysArr="orderKeysArr"
          @updateOrderKeysArr="updateOrderKeysArr"
          :orderValuesArr="orderValuesArr"
          @updateOrderValuesArr="updateOrderValuesArr"
        ></PortraitCollageSize24>
        <LandscapCollageSize32
          v-if="e_orientation == 'LANDSCAPE' && i_num_photo == 32"
          :droppedMediaList="droppedMediaList"
          @updateDroppedMediaList="updateDroppedMediaList"
          :orderKeysArr="orderKeysArr"
          @updateOrderKeysArr="updateOrderKeysArr"
          :orderValuesArr="orderValuesArr"
          @updateOrderValuesArr="updateOrderValuesArr"
        ></LandscapCollageSize32>
        <PortraitCollageSize32
          v-else-if="e_orientation == 'PORTRAIT' && i_num_photo == 32"
          :droppedMediaList="droppedMediaList"
          @updateDroppedMediaList="updateDroppedMediaList"
          :orderKeysArr="orderKeysArr"
          @updateOrderKeysArr="updateOrderKeysArr"
          :orderValuesArr="orderValuesArr"
          @updateOrderValuesArr="updateOrderValuesArr"
        ></PortraitCollageSize32>
        <LandscapCollageSize48
          v-else-if="e_orientation == 'LANDSCAPE' && i_num_photo == 48"
          :droppedMediaList="droppedMediaList"
          @updateDroppedMediaList="updateDroppedMediaList"
          :orderKeysArr="orderKeysArr"
          @updateOrderKeysArr="updateOrderKeysArr"
          :orderValuesArr="orderValuesArr"
          @updateOrderValuesArr="updateOrderValuesArr"
        ></LandscapCollageSize48>
        <PortraitCollageSize48
          v-else-if="e_orientation == 'PORTRAIT' && i_num_photo == 48"
          :droppedMediaList="droppedMediaList"
          @updateDroppedMediaList="updateDroppedMediaList"
          :orderKeysArr="orderKeysArr"
          @updateOrderKeysArr="updateOrderKeysArr"
          :orderValuesArr="orderValuesArr"
          @updateOrderValuesArr="updateOrderValuesArr"
        ></PortraitCollageSize48>
        <input type="file" id="collageCoverScreen" hidden />
        <div class="btn-group">
          <button @click="showStep2">Back</button>
          <button @click="saveDraft">Save as draft</button>
          <button class="submit" @click="saveCollage" id="loadingBtn">
            Save Collage
            <img src="../../../assets/images/loading.gif" alt="loading" />
          </button>
        </div>
      </div>
    </div>
    <div class="model-container" id="collageSuccessModel">
      <div class="model-box">
        <img
          src="../../../assets/images/dashboard/model-box/model-box-success.svg"
          alt="success"
        />
        <h3 class="model-title">Success</h3>
        <p>Your collage was successfully saved</p>
        <button class="btn-sm-dark">
          <router-link to="/Dashboard/Collages" tag="a"
            >Go to collages</router-link
          >
        </button>
      </div>
    </div>
    <div class="model-container" id="saveNewCollageError">
      <div class="model-box">
        <h3 class="model-title">Error</h3>
        <p>
          This collage can’t be saved unless<br />all the spots are filled with
          photos
        </p>
        <div class="btn-group">
          <button class="btn-sm-light" @click="hideSaveNewCollageErrorModel">
            Cancel
          </button>
          <button class="btn-sm-dark" @click="saveDraft">Save as Draft</button>
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
import MediaBox from "../../../components/Dashboard/Collages/MediaBox.vue";
import MediaFilter from "../../../components/Dashboard/Collages/MediaFilter.vue";
import axios from "axios";
import html2canvas from "html2canvas";
import LandscapCollageSize20 from "./LandscapCollageSize20.vue";
import PortraitCollageSize20 from "./PortraitCollageSize20.vue";
import LandscapCollageSize24 from "./LandscapCollageSize24.vue";
import PortraitCollageSize24 from "./PortraitCollageSize24.vue";
import PortraitCollageSize32 from "./PortraitCollageSize32.vue";
import LandscapCollageSize32 from "./LandscapCollageSize32.vue";
import LandscapCollageSize48 from "./LandscapCollageSize48.vue";
import PortraitCollageSize48 from "./PortraitCollageSize48.vue";

export default {
  name: "NewCollageStep3",
  components: {
    MediaBox,
    MediaFilter,
    LandscapCollageSize20,
    PortraitCollageSize20,
    LandscapCollageSize24,
    PortraitCollageSize24,
    LandscapCollageSize32,
    PortraitCollageSize32,
    LandscapCollageSize48,
    PortraitCollageSize48,
  },
  props: [
    "s_name",
    "e_type",
    "s_cover",
    "i_num_photo",
    "e_orientation",
    "s_size",
    "s_media_ids",
  ],
  data() {
    return {
      mediaList: [],
      emptyState: false,
      collageCover: this.s_cover,
      droppedMediaList: this.s_media_ids,
      orderKeysArr: [],
      orderValuesArr: [],
      obj: {},
    };
  },
  methods: {
    updateMediaList(val) {
      this.mediaList = val;
    },
    updateDroppedMediaList(val) {
      this.droppedMediaList = val;
      this.$emit("update_s_media_ids", this.droppedMediaList);
    },
    updateOrderKeysArr(val) {
      this.orderKeysArr = val;
    },
    updateOrderValuesArr(val) {
      this.orderValuesArr = val;
    },
    showNewCollageSaveError() {
      $(".create-collage #saveNewCollageError").css("display", "flex");
    },
    hideSaveNewCollageErrorModel() {
      $(".create-collage #saveNewCollageError").css("display", "none");
    },
    showCancelCollageModel() {
      $(".create-collage#step3 .model-container#cancelCollageModel").css(
        "display",
        "flex"
      );
    },
    cancelCollageCancel() {
      $(".create-collage#step3 .model-container#cancelCollageModel").hide();
    },
    confirmCollageCancel() {
      this.$router.push("/Dashboard/Collages");
    },
    showStep2() {
      $(".create-collage#step3").hide();
      $(".create-collage#step2").css("display", "flex");
      $(".create-collage#step2")
        .closest(".dashboard-container .content")
        .css("padding", "32px 25px 0 25px");
    },
    async saveCollage() {
      if (this.i_num_photo == this.s_media_ids.length) {
        $(".create-collage#step3 .preview-collage #loadingBtn").prop(
          "disabled",
          true
        );

        let orientationLayout = "";
        if (this.e_orientation == "LANDSCAPE" && this.i_num_photo == 20) {
          orientationLayout = "#landscap-size20";
        } else if (
          this.e_orientation == "LANDSCAPE" &&
          this.i_num_photo == 24
        ) {
          orientationLayout = "#landscap-size24";
        } else if (
          this.e_orientation == "LANDSCAPE" &&
          this.i_num_photo == 32
        ) {
          orientationLayout = "#landscap-size32";
        } else if (
          this.e_orientation == "LANDSCAPE" &&
          this.i_num_photo == 48
        ) {
          orientationLayout = "#landscap-size48";
        } else if (this.e_orientation == "PORTRAIT" && this.i_num_photo == 20) {
          orientationLayout = "#portrait-size20";
        } else if (this.e_orientation == "PORTRAIT" && this.i_num_photo == 24) {
          orientationLayout = "#portrait-size24";
        } else if (this.e_orientation == "PORTRAIT" && this.i_num_photo == 32) {
          orientationLayout = "#portrait-size32";
        } else if (this.e_orientation == "PORTRAIT" && this.i_num_photo == 48) {
          orientationLayout = "#portrait-size48";
        }
        await html2canvas(document.querySelector(orientationLayout), {
          allowTaint: true,
          useCORS: true,
        }).then((canvas) => {
          let screenshotFile = document.querySelector("#screenshotFile");

          var dataURL = canvas.toDataURL("image/png");

          var arr = dataURL.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }

          let newFile = new File([u8arr], "collageScreenshot", {
            type: mime,
          });

          this.collageCover = newFile;
          this.$emit("update_s_cover", this.collageCover);
          const list = new DataTransfer();
          list.items.add(this.collageCover);
          screenshotFile.files = list.files;
        });

        for (var i = 0; i < this.orderKeysArr.length; i++) {
          this.obj[this.orderKeysArr[i]] = this.orderValuesArr[i];
        }
        const collage = new FormData();
        collage.set("s_name", this.s_name);
        collage.set("e_type", this.e_type);
        collage.set("i_num_photo", this.i_num_photo);
        collage.set("e_orientation", this.e_orientation);
        if (this.s_size == "" && this.e_type == "PRINTABLE") {
          collage.set("s_size", "17’’ × 24’’");
        } else if (this.s_size != "" && this.e_type == "PRINTABLE") {
          collage.set("s_size", this.s_size);
        } else {
          collage.set("s_size", "");
        }
        collage.set("s_media_ids", this.s_media_ids);
        collage.set("e_status", "FULL");
        collage.append("s_cover", this.$refs.screenshotPhoto.files[0]);
        collage.append("s_order", JSON.stringify(this.obj));

        axios.post("/collages/add_edit", collage).then(
          (res) => {
            if (res.data.status.success) {
              $(".create-collage#step3 .preview-collage #loadingBtn").prop(
                "disabled",
                false
              );
              $(".create-collage #collageSuccessModel").css("display", "flex");
            }
          },
          (error) => {
            $(".create-collage#step3 .preview-collage #loadingBtn").prop(
              "disabled",
              false
            );
            this.$toast.error(error.response.data.message);
          }
        );
      } else {
        this.showNewCollageSaveError();
      }
    },
    async saveDraft() {
      $(".create-collage #saveNewCollageError").css("display", "none");
      let orientationLayout = "";
      if (this.e_orientation == "LANDSCAPE" && this.i_num_photo == 20) {
        orientationLayout = "#landscap-size20";
      } else if (this.e_orientation == "LANDSCAPE" && this.i_num_photo == 24) {
        orientationLayout = "#landscap-size24";
      } else if (this.e_orientation == "LANDSCAPE" && this.i_num_photo == 32) {
        orientationLayout = "#landscap-size32";
      } else if (this.e_orientation == "LANDSCAPE" && this.i_num_photo == 48) {
        orientationLayout = "#landscap-size48";
      } else if (this.e_orientation == "PORTRAIT" && this.i_num_photo == 20) {
        orientationLayout = "#portrait-size20";
      } else if (this.e_orientation == "PORTRAIT" && this.i_num_photo == 24) {
        orientationLayout = "#portrait-size24";
      } else if (this.e_orientation == "PORTRAIT" && this.i_num_photo == 32) {
        orientationLayout = "#portrait-size32";
      } else if (this.e_orientation == "PORTRAIT" && this.i_num_photo == 48) {
        orientationLayout = "#portrait-size48";
      }
      await html2canvas(document.querySelector(orientationLayout), {
        allowTaint: true,
        useCORS: true,
      }).then((canvas) => {
        let screenshotFile = document.querySelector("#screenshotFile");
        var dataURL = canvas.toDataURL("image/png");

        var arr = dataURL.split(","),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);

        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }

        let newFile = new File([u8arr], "collageScreenshot", { type: mime });

        this.collageCover = newFile;
        this.$emit("update_s_cover", this.collageCover);
        const list = new DataTransfer();
        list.items.add(this.collageCover);
        screenshotFile.files = list.files;
      });

      for (var i = 0; i < this.orderKeysArr.length; i++) {
        this.obj[this.orderKeysArr[i]] = this.orderValuesArr[i];
      }

      const draftCollage = new FormData();
      draftCollage.append("s_name", this.s_name);
      draftCollage.append("e_type", this.e_type);
      draftCollage.append("i_num_photo", this.i_num_photo);
      draftCollage.append("e_orientation", this.e_orientation);
      if (this.s_size == "" && this.e_type == "PRINTABLE") {
        draftCollage.set("s_size", "17’’ × 24’’");
      } else if (this.s_size != "" && this.e_type == "PRINTABLE") {
        draftCollage.set("s_size", this.s_size);
      } else {
        draftCollage.set("s_size", "");
      }
      draftCollage.append("s_media_ids", this.s_media_ids);
      draftCollage.append("e_status", "DRAFT");
      draftCollage.append("s_cover", this.$refs.screenshotPhoto.files[0]);
      draftCollage.append("s_order", JSON.stringify(this.obj));

      axios.post("/collages/add_edit", draftCollage).then(
        (res) => {
          if (res.data.status.success) {
            $(".create-collage #collageSuccessModel").css("display", "flex");
          }
        },
        (error) => {
          this.$toast.error(error.response.data.message);
        }
      );
    },
  },
  async mounted() {
    await axios.get("/media?e_type=PHOTO&e_status=PUBLIC").then((res) => {
      if (res.data.status.success) {
        this.mediaList = res.data.media;
        if (this.mediaList.length > 0) {
          this.emptyState = true;
        }
      }
    });
    // this.mediaList = res.data.media.filter((key) => key.e_type == "PHOTO");
  },
};
</script>
