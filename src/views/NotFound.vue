<template>
  <div class="not-found">
    <img src="../assets/images/404-Error.svg" alt="404" />
    <h1>Oops!</h1>
    <p>Sorry, the page you are looking for doesn’t exist</p>
  </div>
</template>

<script>
export default {
  name: "NotFound",
};
</script>

<style scoped>
.not-found {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url("../assets/images/auth/auth-form.svg");
  background-repeat: no-repeat;
  background-position: -100px 115%;
}
.not-found img {
  margin-bottom: 44px;
}
.not-found h1 {
  font-size: 40px;
  font-weight: bold;
  color: #978dad;
  margin-bottom: 24px;
}
.not-found p {
  font-size: 18px;
  font-weight: 600;
  color: #0b0d0f;
}

@media screen and (max-width: 720px) {

  body {
    background-image: none !important;
    background-position: top -103px right -170px !important;
  }
  .not-found {
    background-image: none;
  }
  .not-found img {
    max-width: 100%;
  }
  .not-found p {
    word-break: keep-all;
    text-align: center;
  }
}
</style>