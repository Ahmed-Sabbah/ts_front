<template>
  <div>
      <h2>Reset your password</h2>
      <p v-if="errors.length">
        <b style="color: brown">Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </p>
      <form v-on:submit.prevent="resetPassword()" method="post">
        <div class="form-group">
        <label>New Password</label>
        <div class="password-input">
          <input type="password" name="password" v-model="password" />
          <img class="eye-show" src="../../assets/images/auth/eye-show.svg" alt="eye" @click="showPassword">
          <img class="eye-hide" src="../../assets/images/auth/eye-hide.svg" alt="eye" @click="showPassword">
        </div>
      </div>
        <div class="form-group">
          <label>Confirm New Password</label>
          <input type="password" name="confirmPassword" v-model="confirmPassword" />
        </div>
        <br />
        <div class="form-group">
          <button type="submit" id="loadingBtn">Confirm <img src="../../assets/images/loading.gif" alt="loading" /></button>
        </div>
      </form>
  </div>
</template>

<script>
import axios from "axios";
import $ from "jquery";

export default {
  name: "ResetNewPassword",
  data() {
    return {
      user: this.$route.query.user,
      password: "",
      confirmPassword: "",
      salt: this.$route.query.salt,
      errors: [],
    };
  },
  methods: {
    showPassword() {
      const password = document.querySelector(".password-input input");
      // toggle the type attribute
      const type =
        password.getAttribute("type") === "password" ? "text" : "password";
      password.setAttribute("type", type);
      // toggle the eye slash icon
      $(".password-input img.eye-show").toggle();
      $(".password-input img.eye-hide").toggle();
    },
    resetPassword() {
      this.errors = [];
      const isContainsNumber = /^(?=.*[0-9])/;
      const isContainsUppercase = /^(?=.*[A-Z])/;
      const isContainsLowercase = /^(?=.*[a-z])/;
      const isContainsSymbol = /^(?=.*[~`!@#$%^&*()--+=\]{}[|\\:;"'<>,.?/_₹])/;
      const isValidLength = /^.{8,16}$/;
      let password = this.password.replace(/\s+/g, "");

      if (password == "") {
        this.errors.push("Password required.");
      }
      if (
        !isContainsUppercase.test(password) &&
        !isContainsLowercase.test(password)
      ) {
        this.errors.push("The password should include Letters.");
      }
      if (!isContainsNumber.test(password)) {
        this.errors.push("The password should include Numbers.");
      }
      if (isContainsSymbol.test(password)) {
        this.errors.push("The password should not include special symbol.");
      }
      if (!isValidLength.test(password)) {
        this.errors.push(
          "The password should be more than 8 digits and no more than 16 digits."
        );
      }
      if (this.confirmPassword == "") {
        this.errors.push("Please confirm password.");
      }
      if (this.password != this.confirmPassword) {
        this.errors.push(
          " Please make sure that you renter the same password in the “Confirm Password” field "
        );
      }
      if (this.errors.length <= 0) {
        $(".auth-container .auth-form form #loadingBtn").prop("disabled", true);
        const formData = new FormData();
        formData.append("user", this.user);
        formData.append("salt", this.salt);
        formData.append("s_new_password", password);

        axios.post("/reset_password", formData).then(
          (response) => {
            if (response.data.status.success) {
              $(".auth-container .auth-form form #loadingBtn").prop(
                "disabled",
                false
              );
              this.$router.push("/ResetNewPasswordSuccessful");
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
