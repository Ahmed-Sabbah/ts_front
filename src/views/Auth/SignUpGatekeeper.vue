<template>
  <div>
    <h2>Hi, Welcome to TheirStory!</h2>
    <p class="msg">Start with your 10-days free trial</p>
    <p v-if="errors.length">
    <b style="color: brown">Please correct the following error(s):</b>
    <ul>
      <li v-for="error in errors" :key="error">{{ error }}</li>
    </ul>
  </p>
    <form v-on:submit.prevent="signUpSubmit" method="post">
      <div class="form-group">
        <label>Full Name</label>
        <input type="text" name="fullName" v-model="fullName" />
      </div>
      <div class="form-group">
        <label>Email Address</label>
        <input type="email" name="email" v-model="email" />
      </div>
      <div class="form-group">
        <label>Password</label>
        <div class="password-input">
          <input type="password" name="password" v-model="password" />
          <img class="eye-show" src="../../assets/images/auth/eye-show.svg" alt="eye" @click="showPassword">
          <img class="eye-hide" src="../../assets/images/auth/eye-hide.svg" alt="eye" @click="showPassword">
        </div>
      </div>
      <div class="form-group">
        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          v-model="confirmPassword"
        />      
        </div>
      <div class="form-group terms-conditions">
        <label>
          <input
            type="checkbox"
            name="signUpConditions"
            value="true"
            v-model="signUpConditions"
          />
          <span class="checkmark"></span>&nbsp;&ensp;&ensp; I agree to the
          <router-link to="/TermsAndConditions" tag="a">Terms & Conditions</router-link>
        </label>
      </div>
      <div class="form-group">
        <button type="submit" id="loadingBtn">Sign Up <img src="../../assets/images/loading.gif" alt="loading"></button>
      </div>
      <div class="form-group direct">
        <p>
          Already have an account ?
          <router-link to="/Login" tag="a">Login</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import $ from "jquery";

export default {
  name: "SignUpGatekeeper",
  data() {
    return {
      eType: "GATEKEEPER",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      signUpConditions: false,
      errors: [],
    };
  },
  methods: {
    async signUpSubmit() {
      this.errors = [];

      $(".auth-container .auth-form form #loadingBtn").prop("disabled", true);
      const signupData = {
        e_type: this.eType,
        s_fullname: this.fullName,
        s_email: this.email, //.join("@")
        s_password: this.password,
        s_password_confirmation: this.confirmPassword,
        terms_conditions: this.signUpConditions,
      };

      await axios.post("/users/sign_up", signupData).then(
        (response) => {
          if (response.data.status.success) {
            $(".auth-container .auth-form form #loadingBtn").prop(
              "disabled",
              false
            );
            this.$store
              .dispatch("Register", response.data.user[0].s_email)
              .then(() => {
                this.$router.push("/SignUpVerification");
              });
          } else {
            $(".auth-container .auth-form form #loadingBtn").prop(
              "disabled",
              false
            );
            this.errors.push(response.data.status.message);
          }
        },
        (error) => {
          let err = error.response.data.errors;
          $(".auth-container .auth-form form #loadingBtn").prop(
            "disabled",
            false
          );
          for (const key in err) {
            for (let i = 0; i < err[key].length; i++) {
              this.errors.push(err[key][i]);
            }
          }
          this.$toast.error(error.response.data.message);
        }
      );
    },
    showPassword() {
      const password = document.querySelector(".password-input input");
      const type =
        password.getAttribute("type") === "password" ? "text" : "password";
      password.setAttribute("type", type);
      $(".password-input img.eye-show").toggle();
      $(".password-input img.eye-hide").toggle();
    },
  },
};
</script>
