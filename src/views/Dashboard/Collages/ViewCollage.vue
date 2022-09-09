<template>
  <div class="show-collage">
    <div class="show-collage-box">
      <router-link to="/Dashboard/Collages" class="back-link">
        <img
          src="../../../assets/images/dashboard/contributors/back.svg"
          alt="back"
        />
        Back to collages
      </router-link>
      <div class="edit-collage-box">
        <div class="collage-info">
          <h2>{{ collage.s_name }}</h2>
          <p>Created by: {{ collage.s_creator_name }}</p>
          <span>{{ timestampToDate(collage.dt_created_date) }}</span>
        </div>
        <div class="btn-group" v-if="auth_user.e_type == 'GATEKEEPER'">
          <button
            class="download-collage-dropdown-btn"
            @click="showDropdown"
            v-if="collage.e_status != 'DRAFT' && collage.b_owner"
          >
            Download
            <img
              src="../../../assets/images/dashboard/collages/bottom-arrow.svg"
              alt="bottom-arrow"
            />
          </button>
          <div
            :class="
              collage.e_type == 'PRINTABLE' ? 'dropdown' : 'dropdown screenable'
            "
          >
            <p @click="downloadPDF(collage.pk_i_id)">Download as PDF</p>
            <p
              @click="showSendToPrinterModel"
              v-if="collage.e_type == 'PRINTABLE'"
            >
              Send to printer
            </p>
          </div>
          <button
            class="edit-collage-btn"
            @click="editCollage(collageID)"
            v-if="collage.b_owner"
          >
            Edit Collage
          </button>
        </div>
      </div>

      <div class="collage-images">
        <div class="images">
          <LandscapCollageSize20
            v-if="
              collage.e_orientation == 'LANDSCAPE' && collage.i_num_photo == 20
            "
          ></LandscapCollageSize20>
          <PortraitCollageSize20
            v-else-if="
              collage.e_orientation == 'PORTRAIT' && collage.i_num_photo == 20
            "
          ></PortraitCollageSize20>
          <LandscapCollageSize24
            v-else-if="
              collage.e_orientation == 'LANDSCAPE' && collage.i_num_photo == 24
            "
          ></LandscapCollageSize24>
          <PortraitCollageSize24
            v-else-if="
              collage.e_orientation == 'PORTRAIT' && collage.i_num_photo == 24
            "
          ></PortraitCollageSize24>
          <LandscapCollageSize32
            v-if="
              collage.e_orientation == 'LANDSCAPE' && collage.i_num_photo == 32
            "
          ></LandscapCollageSize32>
          <PortraitCollageSize32
            v-else-if="
              collage.e_orientation == 'PORTRAIT' && collage.i_num_photo == 32
            "
          ></PortraitCollageSize32>
          <LandscapCollageSize48
            v-else-if="
              collage.e_orientation == 'LANDSCAPE' && collage.i_num_photo == 48
            "
          ></LandscapCollageSize48>
          <PortraitCollageSize48
            v-else-if="
              collage.e_orientation == 'PORTRAIT' && collage.i_num_photo == 48
            "
          ></PortraitCollageSize48>

          <!-- <CollageViewMediaBox
            :mediaList="mediaList"
            @updateMediaList="updateMediaList"
            :emptyState="emptyState"
            :previewState="previewState"
            @updatePreviewState="updatePreviewState"
            :previewMedia="previewMedia"
            @updatePreviewMedia="updatePreviewMedia"
            :mediaComments="mediaComments"
            @updateMediaComments="updateMediaComments"
          ></CollageViewMediaBox> -->
        </div>
      </div>
    </div>
    <div class="model-container" id="sendToPrinter">
      <div class="model-box">
        <h3 class="model-title">Send to printer</h3>
        <div v-if="errors.length">
          <b style="color: brown">Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
        </div>
        <p class="note">
          Note: The resolution may differ when printing on large sizes
        </p>
        <div class="input-group">
          <label>Email Address</label>
          <input type="email" name="email" v-model="s_email" />
        </div>
        <div class="input-group">
          <label>Your Message</label>
          <textarea v-model="s_message"></textarea>
        </div>
        <div class="btn-group">
          <button class="btn-sm-light" @click="hideSendToPrinterModel">
            Cancel
          </button>
          <button class="btn-sm-dark" @click="sendToPrinter(collageID)">
            Send Collage
          </button>
        </div>
      </div>
    </div>

    <div class="model-container" id="sendToPrinterSuccessModel">
      <div class="model-box">
        <img
          src="../../../assets/images/dashboard/model-box/model-box-success.svg"
          alt="success"
        />
        <h3 class="model-title">Success</h3>
        <p>Your collage was successfully sent</p>
        <button class="btn-sm-dark" @click="hideSendToPrinterSuccessModel">
          Close
        </button>
      </div>
    </div>

    <div
      class="model-container"
      id="showMediaInfo"
      @click="hideShowMediaInfoModel($event)"
      v-if="!previewState"
    >
      <div class="model-box">
        <div class="media-img">
          <img :src="previewMedia.s_file" alt="media" />
        </div>
        <div class="media-info">
          <h3>Family & Frinds</h3>
          <p>{{ previewMedia.friends?.map((x) => x.s_name).join(", ") }}</p>
          <h3>Tags</h3>
          <p>{{ previewMedia.tags?.map((x) => x.s_name).join(", ") }}</p>
          <h3>Location</h3>
          <!-- :href="`https://maps.google.com/?ll=${previewMedia.d_longitude},${previewMedia.d_latitude}`" -->
          <a href="javascript:void(0)" class="location">{{
            previewMedia.s_street
          }}</a>
          <a
            href="javascript:void(0)"
            class="more-info"
            @click="previewMediaById()"
            >Tap for More Info</a
          >
        </div>
      </div>
    </div>

    <MediaPreview
      :mediaList="mediaList"
      @updateMediaList="updateMediaList"
      :emptyState="emptyState"
      @updateEmptyState="updateEmptyState"
      :previewState="previewState"
      @updatePreviewState="updatePreviewState"
      :previewMedia="previewMedia"
      :mediaComments="mediaComments"
      @updateMediaComments="updateMediaComments"
    ></MediaPreview>
  </div>
</template>

<script>
import $ from "jquery";
import MediaPreview from "../../../components/Dashboard/Media/MediaPreview.vue";
import axios from "axios";
// import CollageViewMediaBox from "../../../components/Dashboard/Collages/CollageViewMediaBox.vue";
import LandscapCollageSize20 from "../../../components/Dashboard/ViewCollage/LandscapCollageSize20.vue";
import PortraitCollageSize20 from "../../../components/Dashboard/ViewCollage/PortraitCollageSize20.vue";
import LandscapCollageSize24 from "../../../components/Dashboard/ViewCollage/LandscapCollageSize24.vue";
import PortraitCollageSize24 from "../../../components/Dashboard/ViewCollage/PortraitCollageSize24.vue";
import PortraitCollageSize32 from "../../../components/Dashboard/ViewCollage/PortraitCollageSize32.vue";
import LandscapCollageSize32 from "../../../components/Dashboard/ViewCollage/LandscapCollageSize32.vue";
import LandscapCollageSize48 from "../../../components/Dashboard/ViewCollage/LandscapCollageSize48.vue";
import PortraitCollageSize48 from "../../../components/Dashboard/ViewCollage/PortraitCollageSize48.vue";

export default {
  name: "ViewCollage",
  components: {
    MediaPreview,
    // CollageViewMediaBox,
    PortraitCollageSize20,
    LandscapCollageSize20,
    LandscapCollageSize24,
    PortraitCollageSize24,
    LandscapCollageSize32,
    PortraitCollageSize32,
    LandscapCollageSize48,
    PortraitCollageSize48,
  },
  data() {
    return {
      collageID: this.$route.params.id,
      collage: "",
      mediaList: [],
      emptyState: false,
      previewState: false,
      previewMedia: {},
      mediaComments: [],
      s_email: "",
      s_message: "",
      auth_user: "",
      errors: [],
    };
  },
  methods: {
    timestampToDate(val) {
      var date = new Date(val.replace(/-/g, "/"));
      return (
        date.toLocaleString("default", { month: "short" }) +
        " " +
        (date.getDay() + 1) +
        "," +
        " " +
        date.getFullYear()
      );
    },
    updateMediaList(val) {
      this.mediaList = val;
    },
    updateEmptyState(val) {
      this.emptyState = val;
    },
    updatePreviewState(val) {
      this.previewState = val;
    },
    updatePreviewMedia(val) {
      this.previewMedia = val;
      $(".preview-media .media-information .location-preview").css('display', 'none');
      $(".preview-media .media-information .comments-preview").css('display', 'none');
      $(".preview-media .media-information .information").css('display', 'block');
    },
    updateMediaComments(val) {
      this.mediaComments = val;
    },
    showDropdown() {
      $(
        ".show-collage .show-collage-box .edit-collage-box .btn-group .dropdown"
      ).toggle();
    },
    editCollage(collageID) {
      this.$router.push("/Dashboard/EditCollage/" + collageID);
    },
    showSendToPrinterModel() {
      $(
        ".show-collage .show-collage-box .edit-collage-box .btn-group .dropdown"
      ).toggle();
      $(".show-collage .model-container#sendToPrinter").css("display", "flex");
    },
    hideSendToPrinterModel() {
      $(".show-collage .model-container#sendToPrinter").css("display", "none");
    },
    showSendToPrinterSuccessModel() {
      $(".show-collage .model-container#sendToPrinterSuccessModel").css(
        "display",
        "flex"
      );
    },
    downloadPDF(collageID) {
      this.showDropdown();
      axios
        .get("/collages/download_pdf?i_collage_id=" + collageID, {
          responseType: "blob",
        })
        .then((res) => {
          // window.open(res.data);
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "collage.pdf"); //or any other extension
          document.body.appendChild(link);
          link.click();
          link.remove();
        });
    },
    sendToPrinter(collageID) {
      if (this.s_email == "") {
        this.errors.push("Email Required");
      } else if (this.s_message == "") {
        this.errors.push("Message Required");
      } else {
        let collagePinter = new FormData();
        collagePinter.append("fk_i_collage_id", collageID);
        collagePinter.append("s_email", this.s_email);
        collagePinter.append("s_message", this.s_message);
        axios.post("/collages/send", collagePinter).then((res) => {
          if (res.data.status.success) {
            //show success model
            this.hideSendToPrinterModel();
            this.showSendToPrinterSuccessModel();
          } else {
            this.errors.push("Server Error!");
          }
        });
      }
    },
    hideSendToPrinterSuccessModel() {
      $(".show-collage .model-container#sendToPrinterSuccessModel").css(
        "display",
        "none"
      );
    },
    hideShowMediaInfoModel(ev) {
      if ($(ev.target).hasClass("model-container")) {
        this.previewMedia = {};
        ev.target.style.display = "none";
        $(".show-collage .model-container#showMediaInfo")
          .find(".model-box")
          .removeClass("flipped");
      }
    },
    previewMediaById() {
      $(".show-collage .model-container#showMediaInfo").css("display", "none");
      $(".show-collage .model-container#showMediaInfo")
        .find(".model-box")
        .removeClass("flipped");
      this.previewState = true;
    },
  },
  async mounted() {
    $(".dashboard-container .content").css("padding", "0");
    $(".dashboard-container .content .show-collage .show-collage-box").css(
      "padding",
      "32px 25px 25px 25px"
    );

    await axios.get("/auth_user").then((res) => {
      if (res.data.status.success) {
        this.auth_user = res.data.users[0];
      }
    });

    await axios.get("/collages?id=" + this.collageID).then((res) => {
      if (res.data.status.success) {
        this.collage = res.data.collages[0];
        this.mediaList = res.data.collages[0].media;
        this.emptyState = true;
        this.$route.meta.title = res.data.collages[0].s_name;
      }
    });

    var DELAY = 700,
      clicks = 0,
      timer = null;

    let orientationLayout = "";
    if (
      this.collage.e_orientation == "LANDSCAPE" &&
      this.collage.i_num_photo == 20
    ) {
      orientationLayout = "#landscap-size20";
    } else if (
      this.collage.e_orientation == "LANDSCAPE" &&
      this.collage.i_num_photo == 24
    ) {
      orientationLayout = "#landscap-size24";
    } else if (
      this.collage.e_orientation == "LANDSCAPE" &&
      this.collage.i_num_photo == 32
    ) {
      orientationLayout = "#landscap-size32";
    } else if (
      this.collage.e_orientation == "PORTRAIT" &&
      this.collage.i_num_photo == 20
    ) {
      orientationLayout = "#portrait-size20";
    } else if (
      this.collage.e_orientation == "PORTRAIT" &&
      this.collage.i_num_photo == 24
    ) {
      orientationLayout = "#portrait-size24";
    } else if (
      this.collage.e_orientation == "PORTRAIT" &&
      this.collage.i_num_photo == 32
    ) {
      orientationLayout = "#portrait-size32";
    }

    for (const [key, value] of Object.entries(
      JSON.parse(this.collage.s_order)
    )) {
      let img = new Image();
      let media = this.mediaList.filter(function (media) {
        return media.pk_i_id == value;
      });
      img.src = media[0].s_file;
      img.setAttribute("data-id", value);
      $(".show-collage " + orientationLayout + " #" + key).append(img);

      $(".show-collage " + orientationLayout + " #" + key + " img").click(
        "click",
        (ev) => {
          clicks++;

          let mediaID = ev.target.getAttribute("data-id");
          axios.get("/media?id=" + mediaID).then((res) => {
            if (res.data.status.success) {
              this.previewMedia = res.data.media[0];
              axios
                .post("/media/action", {
                  fk_i_media_id: mediaID,
                  e_action_type: "VIEW",
                })
                .then((response) => {
                  if (response.data.status.success) {
                    //
                  }
                });
              axios
                .get("/media/comments?i_media_id=" + mediaID)
                .then((response) => {
                  if (response.data.status.success) {
                    this.mediaComments = response.data.comments;
                  }
                });
            }
          });

          if (clicks === 1) {
            timer = setTimeout(() => {
              // alert("Single Click");
              this.previewState = true;

              clicks = 0;
            }, DELAY);
          } else {
            clearTimeout(timer);
            // alert("Double Click");
            this.previewState = false;
            clicks = 0;
          }
        }
      );

      $(".show-collage " + orientationLayout + " #" + key + " img").on(
        "dblclick",
        (ev) => {
          ev.preventDefault();

          $(".show-collage .model-container#showMediaInfo")
            .css("display", "flex")
            .animate({
              transform: 'rotateY("360deg")',
            });

          $(".show-collage .model-container#showMediaInfo")
            .find(".model-box")
            .addClass("flipped");
        }
      );
    }
  },
};
</script>

<style scoped>
@import url("../../../assets/css/show-collages.css");
</style>


