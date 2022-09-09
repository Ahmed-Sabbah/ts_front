<template>
  <div>
    <h2>Reset your password</h2>
    <p class="reset-password-msg">
      Enter the email of your account to receive the reset of password
      instructions
    </p>
    <p v-if="errors.length">
      <b style="color: brown">Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </p>
    <form v-on:submit.prevent="sendEmail()" method="post">
      <div class="form-group">
        <label>Email Address</label>
        <input type="email" name="email" v-model="email" />
      </div>
      <br />
      <div class="form-group">
        <button type="submit" id="loadingBtn">Reset Password <img src="../../assets/images/loading.gif" alt="loading" /></button>
      </div>
    </form>
  </div>
</template>

<script>
import $ from "jquery";
import axios from "axios";
export default {
  name: "ResetPassword",
  data() {
    return {
      email: "",
      success: [],
      errors: [],
    };
  },
  methods: {
    async sendEmail() {
      this.errors = [];
      let email = this.email.toLowerCase();
      email = email.replace(/\s+/g, "");
      email = email.split("@");

      if (email == "") {
        this.errors.push("Email required.");
      }
      if (email[0].length < 3) {
        this.errors.push("Email must contain 3 characters at least.");
      }
      if (this.errors.length <= 0) {
        $(".auth-container .auth-form form #loadingBtn").prop("disabled", true);
        await axios.post("/users/forgetPassword", { s_email: this.email }).then(
          (response) => {
            if (response.data.status.success) {
              this.email = "";
              $(".auth-container .auth-form form #loadingBtn").prop(
                "disabled",
                false
              );
              this.$toast.success(response.data.status.message);
            } else {
              $(".auth-container .auth-form form #loadingBtn").prop(
                "disabled",
                false
              );
              this.errors.push(response.data.status.message);
            }
          },
          (error) => {
            $(".auth-container .auth-form form #loadingBtn").prop(
              "disabled",
              false
            );
            this.$toast.error(error.response.data.message);
          }
        );
      }
    },
  },
};
</script>
