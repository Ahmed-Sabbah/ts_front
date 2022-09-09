<template>
  <div class="reset-new-password-successful">
    <h2>Congrats, You can login with <br />your new password</h2>
    <button>
      <router-link to="/Login">Log In</router-link>
    </button>
  </div>
</template>

<script>
export default {
  name: "ResetNewPasswordSuccessful",
};
</script>