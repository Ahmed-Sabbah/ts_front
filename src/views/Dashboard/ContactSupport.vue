<template>
  <div class="contact-support">
    <p class="page-title">
      Feel free to contact us if you have any question about the platform
    </p>
    <div v-if="errors.length">
      <b style="color: brown">Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </div>
    <form @submit="sendRequest">
      <div class="input-group">
        <label>Name <span>*</span></label>
        <input type="text" name="name" v-model="s_name" />
      </div>
      <div class="input-group">
        <label>Email Address <span>*</span></label>
        <input type="email" name="email" v-model="s_email" />
      </div>
      <div class="input-group">
        <label>Subject</label>
        <select v-model="s_subject">
          <option selected disabled>Select your question’s subject</option>
        </select>
      </div>
      <div class="input-group">
        <label>Your Question</label>
        <textarea v-model="s_question"></textarea>
      </div>
      <div class="btn-group">
        <button type="submit" id="loadingBtn">Send <img src="../../assets/images/loading.gif" alt="loading" /></button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import $ from "jquery";

export default {
  name: "ContactSupport",
  data() {
    return {
      s_name: "",
      s_email: "",
      s_subject: "",
      s_question: "",
      errors: [],
    };
  },
  methods: {
    sendRequest(e) {
      e.preventDefault();

      this.errors = [];
      if (this.s_name == "") {
        this.errors.push("Name is required");
      } else if (this.s_email == "") {
        this.errors.push("Email is required");
      } else if (this.s_question == "") {
        this.errors.push("Question field is required");
      } else {
        $(".contact-support form .btn-group #loadingBtn").prop("disabled", true);
        const formData = new FormData();
        formData.set("s_name", this.s_name);
        formData.set("s_email", this.s_email);
        formData.set("s_subject", this.s_subject);
        formData.set("s_question", this.s_question);
        axios.post("/contact", formData).then((res) => {
          if (res.data.status.success) {
            $(".contact-support form .btn-group #loadingBtn").prop("disabled", false);
            this.s_name = "";
            this.s_email = "";
            this.s_subject = "";
            this.s_question = "";
            this.errors = [];
            this.$toast.success(res.data.status.message);
          }
        });
      }
    },
  },
  mounted() {
    $("body").css("background-image", "none");
    $(".dashboard-container .content").css("padding", "32px 25px 0 25px");
  },
};
</script>

<style scoped>
@import url("../../assets/css/contact-support.css");
</style>