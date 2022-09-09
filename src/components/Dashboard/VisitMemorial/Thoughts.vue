<template>
  <div class="all-thoughts">
    <div class="head">
      <div class="title">
        <div class="back-link" @click="backToMain">
          <img
            src="../../../assets/images/dashboard/memorial/left-arrow.svg"
            alt="back"
          />
        </div>
        <h3>Thoughts</h3>
      </div>
      <a href="javascript:void(0)" @click="showLogVisit">Add new</a>
    </div>
    <p class="discription-paragraph">Description paragraph</p>
    <div class="thoughts-items">
      <div class="item" v-for="item in thoughtsList" :key="item.pk_i_id">
        <h5>{{ item.s_name }}</h5>
        <span>{{ timestampToDate(item.dt_created_date) }}</span>
        <p>
          {{ item.s_thoughts }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "Thoughts",
  props: ["thoughtsList"],
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
    showLogVisit() {
      $(".all-thoughts").css("display", "none");
      $(".log-visit").css("display", "block");
    },
    backToMain() {
      $(".all-thoughts").css("display", "none");
      $(".home").css("display", "block");
    },
  },
};
</script>