<template>
  <div class="show-memorial">
    <div class="container">
      <router-link to="/Dashboard/Memorials" class="back-link">
        <img
          src="../../../assets/images/dashboard/contributors/back.svg"
          alt="back"
        />
        Back to memorials
      </router-link>
      <div class="memorial-tools">
        <ul class="memorial-nav">
          <li
            class="active"
            id="memorialInfo"
            @click="stepMove('memorialInfo', $event)"
          >
            Info
          </li>
          <li id="memorialGallery" @click="stepMove('memorialGallery', $event)">
            Gallery
          </li>
          <li id="memorialVisits" @click="stepMove('memorialVisits', $event)">
            Visits
          </li>
          <li
            id="showMemorialShare"
            @click="stepMove('showMemorialShare', $event)"
          >
            Share
          </li>
          <li id="memorialQR" @click="stepMove('memorialQR', $event)">
            QR code
          </li>
        </ul>
        <button @click="editMemorial(memorialID)" v-if="b_owner">
          Edit Memorial
        </button>
      </div>

      <div class="memorial-info" data-target="memorialInfo">
        <h2>{{ s_name }}</h2>
        <span>
          {{ timestampToDate(dt_live_from) }} -
          {{ timestampToDate(dt_live_to) }}
        </span>
        <p>
          {{ s_about }}
        </p>
      </div>

      <div class="memorial-gallery" data-target="memorialGallery">
        <h2 class="title">Gallery</h2>
        <MediaNavbar
          :mediaList="mediaList"
          @updateMediaList="updateMediaList"
        ></MediaNavbar>

        <MediaBox
          :mediaList="mediaList"
          @updateMediaList="updateMediaList"
          :emptyState="emptyState"
          :previewState="previewState"
          @updatePreviewState="updatePreviewState"
          :previewMedia="previewMedia"
          @updatePreviewMedia="updatePreviewMedia"
          :mediaComments="mediaComments"
          @updateMediaComments="updateMediaComments"
        ></MediaBox>
      </div>

      <div class="memorial-visits" data-target="memorialVisits">
        <div class="filter">
          <h2 class="title">Logged Visits to the Site</h2>
          <select class="select-to" @change="switchSelect($event)">
            <option disabled selected>Sort By</option>
            <option value="desc">Newest to oldest</option>
            <option value="asc">Oldest to newest</option>
          </select>
        </div>
        <div class="visits-items">
          <div class="item" v-for="item in thoughtsList" :key="item.pk_i_id">
            <div class="title">
              <h3>{{ item.s_name }}</h3>
              <span>{{ timestampToDate(item.dt_created_date) }}</span>
            </div>
            <span
              >{{ item.s_phone ? item.s_phone + " | " : ""
              }}{{ item.s_email }}</span
            >
            <p>
              {{ item.s_thoughts }}
            </p>
          </div>
        </div>
      </div>

      <div class="memorial-share" data-target="showMemorialShare">
        <h2 class="title">Share QR code</h2>
        <p class="choose-option">Choose one of the below options to share</p>
        <div class="share-options">
          <div class="choices">
            <button @click="showShareQRCode($event)">Share QR code</button>
            <button @click="showShareQRCodePrinter($event)">
              Send QR code to printer
            </button>
          </div>
          <div class="selected-choice" id="shareQRCode">
            <h3>Share QR code</h3>
            <p>Delivered as a .PNG Graphic file</p>
            <form @submit="shareQRCode">
              <div class="form-group">
                <label>Email address</label>
                <input type="email" name="email" v-model="s_email" />
              </div>
              <div class="form-group">
                <label>Your message</label>
                <textarea v-model="s_description"></textarea>
              </div>
              <div class="form-group">
                <button type="submit" id="loadingShareBtn">
                  Send Email
                  <img src="../../../assets/images/loading.gif" alt="loading" />
                </button>
              </div>
            </form>
          </div>
          <div class="selected-choice" id="shareQRCodeToPrinter">
            <h3>Send QR code to printer</h3>
            <p>Delivered as a .PNG and TIF Vector Graphic file</p>
            <form @submit="shareQRCodeToPrinter">
              <div class="form-group">
                <label>Email address</label>
                <input type="email" name="email" v-model="s_email" />
              </div>
              <div class="form-group">
                <label>Your message</label>
                <textarea v-model="s_description"></textarea>
              </div>
              <div class="form-group">
                <button type="submit" id="loadingPrintBtn">
                  Send Email
                  <img src="../../../assets/images/loading.gif" alt="loading" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="memorial-qr-code" data-target="memorialQR">
        <h2 class="title">Share QR code</h2>
        <p class="scan-msg">
          You can Scan the Code using the camera on your Mobile Phone.
        </p>
        <div class="location">
          <p>Or you can visit Don at</p>
          <div class="location-card">
            <div class="location-info">
              <p>{{ s_street }}</p>
              <span>1272 Spring Grove Avenue</span>
              <span>Cincinnati, Ohio 45209</span>
              <span>513-987-0927</span>
              <a
                :href="'https://maps.google.com/?ll=' + lat + ',' + long"
                target="_blank"
                >Direction Link</a
              >
              <strong>Plot 234 Section F</strong>
            </div>
            <div class="location-map">
              <div class="map" id="map"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="preview-memorial" v-if="previewMemorialStatus">
      <div class="selected-memorial">
        <div class="main-memorial">
          <img :src="s_cover" alt="preview-memorial" />
        </div>
      </div>
    </div>
    <MediaPreview
      v-if="previewMediaStatus"
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
    <div class="preview-memorial memorial-qr" v-if="previewMemorialQR">
      <div class="selected-memorial-cover">
        <img :src="s_cover" alt="memorial-cover" />
        <div class="memorial-info">
          <img :src="s_qr_png_image" alt="qr" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import MediaBox from "../../../components/Dashboard/ViewMemorial/MediaBox.vue";
import MediaNavbar from "../../../components/Dashboard/ViewMemorial/MediaNavbar.vue";
import MediaPreview from "../../../components/Dashboard/Media/MediaPreview.vue";
import axios from "axios";

export default {
  name: "ViewMemorial",
  components: { MediaNavbar, MediaBox, MediaPreview },
  data() {
    return {
      sortSelected: "",
      memorialID: this.$route.params.id,
      b_owner: "",
      s_cover: "",
      s_name: "",
      dt_live_from: "",
      dt_live_to: "",
      s_about: "",
      mediaList: [],
      emptyState: false,
      previewState: false,
      previewMedia: {},
      mediaComments: [],
      thoughtsList: [],
      s_street: "",
      long: "",
      lat: "",
      s_qr_png_image: "",
      previewMemorialStatus: true,
      previewMediaStatus: false,
      previewMemorialQR: false,
      s_email: "",
      s_description: "",
    };
  },
  methods: {
    timestampToDate(val) {
      var date = new Date(val.replace(/-/g, "/"));
      return (
        date.toLocaleString("default", { month: "short" }) +
        " " +
        date.getDate() +
        "," +
        " " +
        date.getFullYear()
      );
    },
    async switchSelect(event) {
      if (event.target.value) {
        this.sortSelected = event.target.value;
        await axios
          .get(
            "/memorials/visits?order_by=" +
              this.sortSelected +
              "&i_memorial_id=" +
              this.memorialID
          )
          .then((res) => {
            if (res.data.status.success) {
              this.thoughtsList = res.data.memorials;
            }
          });
      }
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
    editMemorial(memorialID) {
      this.$router.push({ name: "EditMemorial", params: { id: memorialID } });
    },
    stepMove(section, e) {
      $(".memorial-nav li").removeClass("active");
      $(e.target).addClass("active");
      // this = e.target
      $("[data-target]").css("display", "none");
      let focus = $(`[data-target=${section}]`);
      focus.css("display", "block");
      if (section == "showMemorialShare") {
        if (
          !$(
            ".show-memorial .container .memorial-tools #showMemorialShare"
          ).hasClass("active")
        ) {
          $(
            ".show-memorial .container .memorial-tools #showMemorialShare"
          ).addClass("active");
        }
      } else if (section == "memorialGallery") {
        this.previewMemorialStatus = false;
        this.previewMediaStatus = true;
        this.previewMemorialQR = false;
      } else if (section == "memorialQR") {
        this.previewMemorialStatus = false;
        this.previewMediaStatus = false;
        this.previewMemorialQR = true;
        this.showLocationOnMap(this.lat, this.long);
      } else {
        this.previewMemorialStatus = true;
        this.previewMediaStatus = false;
        this.previewMemorialQR = false;
      }
    },
    showShareQRCode(e) {
      this.s_email = "";
      this.s_description = "";
      $(
        ".show-memorial .container .memorial-share .share-options .choices button"
      ).removeClass("active");
      $(e.target).addClass("active");
      $(
        ".show-memorial .container .memorial-share .share-options #shareQRCodeToPrinter"
      ).css("display", "none");
      $(
        ".show-memorial .container .memorial-share .share-options #shareQRCode"
      ).css("display", "block");
    },
    showShareQRCodePrinter(e) {
      this.s_email = "";
      this.s_description = "";
      $(
        ".show-memorial .container .memorial-share .share-options .choices button"
      ).removeClass("active");
      $(e.target).addClass("active");
      $(
        ".show-memorial .container .memorial-share .share-options #shareQRCode"
      ).css("display", "none");
      $(
        ".show-memorial .container .memorial-share .share-options #shareQRCodeToPrinter"
      ).css("display", "block");
    },
    async shareQRCode(e) {
      e.preventDefault();
      $(
        ".show-memorial .container .memorial-share .share-options #shareQRCode #loadingShareBtn"
      ).prop("disabled", true);
      const formData = new FormData();
      formData.set("fk_i_memorial_id", this.memorialID);
      formData.set("s_email", this.s_email);
      formData.set("s_message", this.s_description);
      formData.set("e_type", "SHARE");
      await axios.post("/memorials/memorial_action", formData).then((res) => {
        if (res.data.status.success) {
          this.s_email = "";
          this.s_description = "";
          $(
            ".show-memorial .container .memorial-share .share-options #shareQRCode #loadingShareBtn"
          ).prop("disabled", false);

          $(
            ".show-memorial .container .memorial-share .share-options #shareQRCode"
          ).css("display", "none");
          this.$toast.success(res.data.status.message);
        } else {
          $(
            ".show-memorial .container .memorial-share .share-options #shareQRCode #loadingShareBtn"
          ).prop("disabled", false);
        }
      });
    },
    async shareQRCodeToPrinter(e) {
      e.preventDefault();
      $(
        ".show-memorial .container .memorial-share .share-options #shareQRCode #loadingPrintBtn"
      ).prop("disabled", true);
      const formData = new FormData();
      formData.set("fk_i_memorial_id", this.memorialID);
      formData.set("s_email", this.s_email);
      formData.set("s_message", this.s_description);
      formData.set("e_type", "SEND");
      await axios.post("/memorials/memorial_action", formData).then((res) => {
        if (res.data.status.success) {
          this.s_email = "";
          this.s_description = "";
          $(
            ".show-memorial .container .memorial-share .share-options #shareQRCode #loadingPrintBtn"
          ).prop("disabled", false);

          $(
            ".show-memorial .container .memorial-share .share-options #shareQRCodeToPrinter"
          ).css("display", "none");
          this.$toast.success(res.data.status.message);
        } else {
          $(
            ".show-memorial .container .memorial-share .share-options #shareQRCode #loadingPrintBtn"
          ).prop("disabled", false);
        }
      });
    },
    showLocationOnMap(lat, lng) {
      const google = window.google;
      var mapProp = {
        zoom: 8,
        center: new google.maps.LatLng(lng, lat),
      };
      let map = new google.maps.Map(document.getElementById("map"), mapProp);

      new google.maps.Marker({
        position: new google.maps.LatLng(lng, lat),
        map: map,
      });
    },
  },
  watch: {
    s_email: function (val) {
      this.s_email = val;
    },
    s_description: function (val) {
      this.s_description = val;
    },
    thoughtsList: function (val) {
      this.thoughtsList = val;
    },
  },
  mounted() {
    $("body").css("background-image", "none");
    $(".dashboard-container .content").css("padding", "0");
    $(".dashboard-container .content .show-memorial .container").css(
      "padding",
      "32px 25px 40px 25px"
    );

    $(".memorial-nav li").on("click", function () {});

    axios.get("/memorials?id=" + this.memorialID).then((res) => {
      if (res.data.status.success) {
        this.b_owner = res.data.memorials[0].b_owner;
        this.s_cover = res.data.memorials[0].s_cover;
        this.dt_live_from = res.data.memorials[0].dt_live_from;
        this.dt_live_to = res.data.memorials[0].dt_live_to;
        this.s_about = res.data.memorials[0].s_about;
        this.mediaList = res.data.memorials[0].media;
        this.thoughtsList = res.data.memorials[0].visits;
        this.s_street = res.data.memorials[0].s_street;
        this.long = res.data.memorials[0].d_longitude;
        this.lat = res.data.memorials[0].d_latitude;
        this.s_qr_png_image = res.data.memorials[0].s_qr_png_image;
        if (res.data.memorials[0].media.length > 0) {
          this.emptyState = true;
        }
        this.$route.meta.title = res.data.memorials[0].s_name;
      }
    });

    let url = this.$route.params.share;
    if (url == "share") {
      let ev = $(
        ".show-memorial .container .memorial-tools #showMemorialShare"
      );
      this.stepMove("showMemorialShare", ev);
    }
  },
};
</script>

<style scoped>
@import url("../../../assets/css/memorials.css");
</style>