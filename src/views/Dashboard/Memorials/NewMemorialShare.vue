<template>
  <div class="create-memorial" id="share">
    <div class="container">
      <img
        class="success-image"
        src="../../../assets/images/dashboard/memorial/successfull.svg"
        alt="successfull"
      />
      <div
        class="memorial-share"
        data-target="memorialShare"
        id="memorialShare"
      >
        <h2 class="title">Congrats ! Your QR code has been just generated</h2>
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
                <button type="submit">Send Email</button>
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
                <button type="submit">Send Email</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="preview-memorial">
      <div class="selected-memorial-cover">
        <img
          :src="memorial.s_cover"
          alt="memorial-cover"
          v-if="memorial.s_cover"
        />
        <img
          v-else
          src="../../../assets/images/dashboard/memorial/preview-memorial.png"
          alt="memorial-cover"
        />
        <div class="memorial-info">
          <img
            :src="memorial.s_qr_png_image"
            alt="qr_code"
            v-if="memorial.s_qr_png_image"
          />
        </div>
      </div>
      <div class="btn-group">
        <button class="view-btn" @click="showMemorial">View Memorial</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import $ from "jquery";

export default {
  name: "NewMemorialShare",
  data() {
    return {
      memorialID: this.$route.params.id,
      memorial: "",
      s_email: "",
      s_description: "",
    };
  },
  methods: {
    showMemorial() {
      this.$router.push("/Dashboard/ViewMemorial/" + this.memorialID);
    },
    showShareQRCode(e) {
      this.s_email = "";
      this.s_description = "";
      $(".create-memorial#share .share-options .choices button").removeClass(
        "active"
      );
      $(e.target).addClass("active");
      $(".create-memorial#share .share-options #shareQRCodeToPrinter").css(
        "display",
        "none"
      );
      $(".create-memorial#share .share-options #shareQRCode").css(
        "display",
        "block"
      );
    },
    showShareQRCodePrinter(e) {
      this.s_email = "";
      this.s_description = "";
      $(".create-memorial#share .share-options .choices button").removeClass(
        "active"
      );
      $(e.target).addClass("active");
      $(".create-memorial#share .share-options #shareQRCode").css(
        "display",
        "none"
      );
      $(".create-memorial#share .share-options #shareQRCodeToPrinter").css(
        "display",
        "block"
      );
    },
    shareQRCode(e) {
      e.preventDefault();
      const formData = new FormData();
      formData.set("fk_i_memorial_id", this.memorialID);
      formData.set("s_email", this.s_email);
      formData.set("s_message", this.s_description);
      formData.set("e_type", "SHARE");
      axios.post("/memorials/memorial_action", formData).then((res) => {
        if (res.data.status.success) {
          this.s_email = "";
          this.s_description = "";
          $(".create-memorial#share .share-options #shareQRCode").css(
            "display",
            "none"
          );
        }
      });
    },
    shareQRCodeToPrinter(e) {
      e.preventDefault();
      const formData = new FormData();
      formData.set("fk_i_memorial_id", this.memorialID);
      formData.set("s_email", this.s_email);
      formData.set("s_message", this.s_description);
      formData.set("e_type", "SEND");
      axios.post("/memorials/memorial_action", formData).then((res) => {
        if (res.data.status.success) {
          this.s_email = "";
          this.s_description = "";
          $(".create-memorial#share .share-options #shareQRCodeToPrinter").css(
            "display",
            "none"
          );
        }
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
  },
  mounted() {
    $("body").css("background-image", "none");
    $(".dashboard-container .content").css("padding", "0");
    $(".dashboard-container .content .create-memorial .container").css(
      "padding",
      "32px 25px 40px 25px"
    );

    axios.get("/memorials?id=" + this.memorialID).then((res) => {
      if (res.data.status.success) {
        this.memorial = res.data.memorials[0];

        this.$route.meta.title = res.data.memorials[0].s_name;
      }
    });
  },
};
</script>

<style scoped>
@import url("../../../assets/css/memorial-share-qr.css");
</style>