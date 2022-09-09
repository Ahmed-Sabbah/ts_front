<template>
  <div class="about-pop-up">
    <div class="pop-up-model">
      <h4>About</h4>
      <div class="description">
        <p>{{ s_about }}</p>
      </div>
      <div class="close-btn">
        <button @click="closeAbout">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  name: "About",
  props: ["s_about"],
  methods: {
    closeAbout() {
      //   $(".about-pop-up").css("display", "none");
      $(".about-pop-up").animate({
        top: "100vh",
      });

      $(".about-pop-up")
        .delay()
        .queue(function (next) {
          $(this).css("display", "none");
          next();
        });
    },
  },
};
</script>