<template>
  <div class="sign-up-verification-successful">
    <h2>Congrats, Your Account is now verified</h2>
    <p>You can login now</p>
    <button>
      <router-link to="/Login">Log In</router-link>
    </button>
  </div>
</template>

<script>
export default {
  name: "SignUpVerificationSuccessful",
};
</script>
