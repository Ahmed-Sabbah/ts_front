<template>
  <div class="auth-container">
    <section class="auth-form">
      <img
        class="logo"
        src="../../assets/images/auth/logo.svg"
        alt="theirStory"
      />
      <router-view />
    </section>
    <AuthGallery></AuthGallery>
  </div>
</template>

<script>
import AuthGallery from "../../components/Auth/AuthGallery.vue";
export default {
  name: "Auth",
  components: {
    AuthGallery,
  },
};
</script>

<style scoped>
@import "../../assets/css/auth.css";
</style>