<template>
  <div>
    <h2>Welcome Back</h2>
    <p class="msg">Login to see the new added media</p>
    <p v-if="errors.length">
    <b style="color: brown">Please correct the following error(s):</b>
    <ul>
      <li v-for="error in errors" :key="error">{{ error }}</li>
    </ul>
  </p>
    <form v-on:submit.prevent="submitLogin" id="gatekeeper-form">
      <div class="form-group choose-login">
        <div class="gatekeeper">
          <label for="gatekeeper"
            ><input
              type="radio"
              :checked="!this.$route.params.type"
              name="choosen_login"
              value="GATEKEEPER"
              id="gatekeeper"
              v-on:click="showGatekeeper('GATEKEEPER')"
            /><span class="checkmark"></span>&emsp; Gatekeeper</label
          >
        </div>
        <div class="contributor">
          <label for="contributor"
            ><input
            :checked="this.$route.params.type == 'CONTRIBUTOR'"
              type="radio"
              name="choosen_login"
              value="CONTRIBUTOR"
              id="contributor"
              v-on:click="showContributor('CONTRIBUTOR')"
            />
            <span class="checkmark"></span>&emsp; Contributor</label
          >
        </div>
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
      <div class="form-group forgot-password-direct">
        <label
          ><input
            type="checkbox"
            name="remember_me"
            value="true"
            v-model="rememberMe"
          /><span class="checkmark"></span>&emsp;&ensp; Remember me</label
        >
        <router-link to="/ResetPassword" tag="a">Forgot Password ?</router-link>
      </div>
      <div class="form-group">
        <button type="submit" id="loadingBtn">Login <img src="../../assets/images/loading.gif" alt="loading" /></button>
      </div>
      <div class="form-group direct">
        <p id="gatekeeperSignUp">
          Don't have an account ?
          <router-link to="/SignUpGatekeeper" tag="a">Sign Up</router-link>
        </p>
        <p id="contributorSignUp">
          Have an invitation link ?
          <router-link to="/SignUpContributor" tag="a">Sign Up</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import $ from "jquery";

export default {
  name: "Login",
  data() {
    return {
      eType:
        this.$route.params.type && this.$route.params.type == "CONTRIBUTOR"
          ? "CONTRIBUTOR"
          : "GATEKEEPER",
      email: "",
      password: "",
      rememberMe: false,
      errors: [],
    };
  },
  methods: {
    showGatekeeper: function (type) {
      this.eType = type;
      document.getElementById("contributorSignUp").style.display = "none";
      document.getElementById("gatekeeperSignUp").style.display = "block";
    },

    showContributor: function (type) {
      this.eType = type;
      document.getElementById("gatekeeperSignUp").style.display = "none";
      document.getElementById("contributorSignUp").style.display = "block";
    },
    showPassword() {
      const password = document.querySelector(".password-input input");
      const type =
        password.getAttribute("type") === "password" ? "text" : "password";
      password.setAttribute("type", type);
      $(".password-input img.eye-show").toggle();
      $(".password-input img.eye-hide").toggle();
    },
    async submitLogin() {
      this.errors = [];

      if (this.email == "") {
        this.errors.push("Email required.");
      }
      if (this.password == "") {
        this.errors.push("Password required.");
      }
      if (this.errors.length <= 0) {
        $(".auth-container .auth-form form #loadingBtn").prop("disabled", true);
        const loginForm = {
          e_type: this.eType,
          s_email: this.email,
          s_password: this.password,
          b_remember: this.rememberMe,
        };
        await axios
          .post("/users/login", loginForm)
          .then((response) => {
            if (response.data.status.success === true) {
              $(".auth-container .auth-form form #loadingBtn").prop(
                "disabled",
                false
              );
              this.$store
                .dispatch("Login", response.data.user[0].s_access_token)
                .then(() => {
                  if (
                    response.data.user[0].is_subscribed ||
                    response.data.user[0].b_trial
                  ) {
                    this.$router.push("/");
                  } else {
                    this.$router.push("/Subscription");
                  }
                });
            } else {
              $(".auth-container .auth-form form #loadingBtn").prop(
                "disabled",
                false
              );
              this.errors.push(response.data.status.message);
            }
          })
          .catch((error) => {
            let err = error.response.data.errors;
            $(".auth-container .auth-form form #loadingBtn").prop(
              "disabled",
              false
            );
            // this.errors.push("Server Error!");
            for (const key in err) {
              for (let i = 0; i < err[key].length; i++) {
                this.errors.push(err[key][i]);
              }
            }
            this.$toast.error(error.response.data.message);
          });
      }
    },
  },
};
</script>
