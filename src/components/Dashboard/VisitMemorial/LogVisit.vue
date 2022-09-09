<template>
  <div class="log-visit">
    <div class="head">
      <div class="back-link" @click="closeLogVisit">
        <img
          src="../../../assets/images/dashboard/memorial/left-arrow.svg"
          alt="back"
        />
      </div>
      <h3>Log visit</h3>
    </div>
    <p class="discription-paragraph">Description paragraph</p>
    <form @submit="logVisit($event)">
      <div class="input-group">
        <label>Name <span>*</span></label>
        <input type="text" v-model="s_name" />
      </div>
      <div class="input-group">
        <label>Phone Number</label>
        <input type="text" v-model="s_phone" />
      </div>
      <div class="input-group">
        <label>Email Address <span>*</span></label>
        <input type="email" v-model="s_email" />
      </div>
      <div class="input-group">
        <label>Others with you</label>
        <input type="text" v-model="s_others" />
      </div>
      <div class="input-group">
        <label>Thoughts <span>*</span></label>
        <textarea v-model="s_thoughts"></textarea>
      </div>
      <div class="submit-btn">
        <button type="submit" id="loadingBtn">
          Submit <img src="../../../assets/images/loading.gif" alt="loading" />
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import $ from "jquery";

export default {
  name: "LogVisit",
  props: ["thoughtsList"],
  data() {
    return {
      memorialID: this.$route.params.id,
      s_name: "",
      s_phone: "",
      s_email: "",
      s_others: "",
      s_thoughts: "",
      thoughts: [],
    };
  },
  methods: {
    closeLogVisit() {
      $(".log-visit").css("display", "none");
      $(".home").css("display", "block");
    },
    async logVisit(ev) {
      ev.preventDefault();

      $(".visit-memorial .log-visit form .submit-btn #loadingBtn").prop(
        "disabled",
        true
      );
      const data = new FormData();
      data.set("fk_i_memorial_id", this.memorialID);
      data.set("s_name", this.s_name);
      data.set("s_phone", this.s_phone);
      data.set("s_email", this.s_email);
      data.set("s_others", this.s_others);
      data.set("s_thoughts", this.s_thoughts);
      await axios.post("/memorials/log_visit", data).then((res) => {
        if (res.data.status.success) {
          $(".log-visit").css("display", "none");
          $(".visit-memorial .log-visit form .submit-btn #loadingBtn").prop(
            "disabled",
            false
          );
          this.s_name = "";
          this.s_phone = "";
          this.s_email = "";
          this.s_others = "";
          this.s_thoughts = "";
          $(".visit-memorial .log-visit-success").css("display", "block");
          axios.get("/memorials/by_id?id=" + this.memorialID).then((res) => {
            if (res.data.status.success) {
              this.thoughts = res.data.memorials[0].visits.reverse();
              this.$emit("update_thoughts_list", this.thoughts);
            }
          });
        } else {
          this.$toast.success(res.data.status.message);
          $(".visit-memorial .log-visit form .submit-btn #loadingBtn").prop(
            "disabled",
            false
          );
        }
      });
    },
  },
};
</script>