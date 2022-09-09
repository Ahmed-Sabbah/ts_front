<template>
  <div class="log-visit-success">
    <h2>Bless You !</h2>
    <img
      src="../../../assets/images/dashboard/memorial/success.svg"
      alt="success"
    />
    <div class="back-to-main-btn">
      <button @click="backToMain">Back to Main</button>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "LogVisitSuccess",
  methods: {
    backToMain() {
      $(".log-visit-success").css("display", "none");
      $(".home").css("display", "block");
    }
  },

};
</script>