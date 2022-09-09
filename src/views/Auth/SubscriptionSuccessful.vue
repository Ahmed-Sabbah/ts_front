<template>
  <div class="subscription-successful">
    <h2>
      Congrats, You have<br />
      successfully subscribed
    </h2>
    <p>
      Invoice will be sent shortly to your email<br />
      address
    </p>
    <router-link to="/" class="btn" tag="a">Go to app</router-link>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "SubscriptionSuccessful",
  async mounted() {
    await axios.get("/auth_user").then(
      (res) => {
        if (res.data.status.success) {
          if (res.data.users[0].e_type != "GATEKEEPER") {
            this.$router.push("/");
          }
        } else {
          localStorage.removeItem("auth_user_token");
          this.$toast.error("Something went wrong, please try again.");
          this.$router.push("/login");
        }
      },
      (error) => {
        // if (error.response.status == 401) {
        //   this.$router.push("/Login");
        // } else {
        this.$toast.error(error.response.data.message);
        // }
      }
    );
  },
};
</script>

<style scoped>
@import url("../../assets/css/subscription.css");
</style>

