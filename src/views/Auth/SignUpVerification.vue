<template>
  <div class="sign-up-verification">
    <h2>Last step, Verify your account</h2>
    <p>
      Thank you for registration. You will receive an email soon to verify your
      account
    </p>
    <p class="not-receive">Didn’t receive an email ?</p>
    <button @click="resendVerifyEmail()" id="loadingBtn">Resend Email <img src="../../assets/images/loading.gif" alt="loading" /></button>
  </div>
</template>

<script>
import $ from "jquery";
import axios from "axios";
export default {
  name: "SignUpVerification",
  data() {
    return {
      user: localStorage.getItem("signup_user_email"),
    };
  },
  methods: {
    resendVerifyEmail() {
      $(".auth-container .sign-up-verification #loadingBtn").prop("disabled", true);
      axios
        .post("/users/resend_email", { s_email: this.user })
        .then((response) => {
          if (response.data.status.success) {
            $(".auth-container .sign-up-verification #loadingBtn").prop("disabled", false);
            this.$toast.success("Send Email Successfully.");
            localStorage.removeItem("signup_user_email");
          } else {
            $(".auth-container .sign-up-verification #loadingBtn").prop("disabled", false);
            this.$toast.error("Send Email Failed.");
          }
        });
    },
  },
  beforeMount() {
    const email = localStorage.getItem("signup_user_email");
    if (!email || email == null || email == "") {
      this.$router.push("/Login");
    }
  },
};
</script>
