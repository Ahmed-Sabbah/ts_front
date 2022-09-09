<template>
  <div class="get-started">
    <div class="memorial-cover">
      <img :src="s_cover" alt="memorial-cover" />
      <div class="memorial-info">
        <h1>{{ s_name }}</h1>
        <p>
          {{ timestampToDate(dt_live_from) }} -
          {{ timestampToDate(dt_live_to) }}
        </p>
        <button class="get-start-btn" @click="getStarted">Get Started</button>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "GetStarted",
  props: ["s_name", "s_cover", "dt_live_from", "dt_live_to"],
  methods: {
    timestampToDate(val) {
      var date = new Date(val.replace(/-/g, "/"));
      return (
        date.toLocaleString("default", { month: "short" }) +
        " " +
        date.getDate() +
        "," +
        " " +
        date.getFullYear()
      );
    },
    getStarted() {
      $(".get-started").css("display", "none");
      $(".home").css("display", "block");
    },
  },
};
</script>