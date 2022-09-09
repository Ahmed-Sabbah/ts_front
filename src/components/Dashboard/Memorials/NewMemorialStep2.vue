<template>
  <div class="container" id="step2">
    <router-link to="/Dashboard/Memorials" class="back-link">
      <img
        src="../../../assets/images/dashboard/contributors/back.svg"
        alt="back"
      />
      Cancel the memorial
    </router-link>
    <div class="create-memorial-steps">
      <p>Step 2 of 3: <span>Info</span></p>
      <div class="range">
        <span style="width: 33.333%"></span>
      </div>
    </div>

    <div class="memorial-form">
      <form>
        <div class="col-4">
          <div class="input-group">
            <label>Name</label>
            <input type="text" v-model="collageName" />
          </div>
          <div class="input-group" style="position: relative">
            <label>Live From</label>
            <Datepicker
              v-model="liveFromDate"
              autoApply
              :enableTimePicker="false"
              :startDate="new Date(1800, 0, 1)"
              :yearRange="[1800, new Date().getFullYear()]"
              :minDate="new Date(1800, 0, 1)"
              :maxDate="new Date()"
            ></Datepicker>
          </div>
          <div class="input-group">
            <label>Live To</label>
            <Datepicker
              v-model="liveToDate"
              autoApply
              :enableTimePicker="false"
              :startDate="new Date(1800, 0, 1)"
              :yearRange="[1800, new Date().getFullYear()]"
              :minDate="new Date(1800, 0, 1)"
              :maxDate="new Date()"
            ></Datepicker>
          </div>
          <div class="input-group">
            <label>Age in years</label>
            <input class="age" disabled type="text" v-model="ageInYears" />
          </div>
        </div>
        <div class="about">
          <div class="input-group">
            <label>About</label>
            <textarea v-model="about"></textarea>
          </div>
        </div>
        <div class="groove-location">
          <div class="input-group">
            <label>Groove Location</label>
            <input
              type="text"
              id="autocomplete"
              v-model="street"
              placeholder="Street Address (auto complete)"
            />
            <input type="text" v-model="suite" placeholder="suite #" />
            <input
              type="text"
              v-model="city"
              placeholder="City (auto filled)"
            />
            <input
              type="text"
              v-model="state"
              placeholder="State (auto filled)"
            />
            <input type="text" v-model="postalCode" placeholder="Postal code" />
          </div>
        </div>
      </form>
    </div>
  </div>
  <div class="preview-memorial step2">
    <div class="selected-memorial-cover">
      <img :src="coverObj.s_file" alt="memorial-cover" />
      <div
        class="memorial-info"
        v-if="collageName != '' && liveFromDate != '' && liveToDate != ''"
      >
        <h2>{{ collageName }}</h2>
        <p>
          {{ timestampToDate(liveFromDate) }} -
          {{ timestampToDate(liveToDate) }}
        </p>
      </div>
    </div>
    <div class="btn-group">
      <button class="back-btn" @click="showStep1">Back</button>
      <button
        class="next-btn"
        :disabled="
          collageName == '' ||
          liveFromDate == '' ||
          liveToDate == '' ||
          about == ''
        "
        @click="showStep3"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

export default {
  name: "NewMemorialStep2",
  components: {
    Datepicker,
  },
  props: [
    "coverObj",
    "s_cover",
    "s_name",
    "dt_live_from",
    "dt_live_to",
    "i_age",
    "s_about",
    "props_d_longitude",
    "props_d_latitude",
    "props_s_street",
    "props_s_suite",
    "props_s_city",
    "props_s_state",
    "props_s_postal_code",
  ],
  data() {
    return {
      collageName: this.s_name,
      liveFromDate: this.dt_live_from,
      liveToDate: this.dt_live_to,
      yearFrom: "",
      yearTo: "",
      ageInYears: this.i_age,
      about: this.s_about,
      autocomplete: "",
      longitude: this.props_d_longitude,
      latitude: this.props_d_latitude,
      street: this.props_s_street,
      suite: this.props_s_suite,
      city: this.props_s_city,
      state: this.props_s_state,
      postalCode: this.props_s_postal_code,
    };
  },
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
    getLiveYear(val) {
      var date = new Date(val);
      return date.getFullYear();
    },
    showStep1() {
      $(".create-memorial .container#step2").css("display", "none");
      $(".create-memorial .preview-memorial.step2").css("display", "none");
      $(".create-memorial .container#step3").css("display", "none");
      $(".create-memorial .preview-memorial.step3").css("display", "none");
      $(".create-memorial .container#step1").css("display", "block");
      $(".create-memorial .preview-memorial.step1").css("display", "block");
    },
    showStep3() {
      $(".create-memorial .container#step1").css("display", "none");
      $(".create-memorial .preview-memorial.step1").css("display", "none");
      $(".create-memorial .container#step2").css("display", "none");
      $(".create-memorial .preview-memorial.step2").css("display", "none");
      $(".create-memorial .container#step3").css("display", "block");
      $(".create-memorial .preview-memorial.step3").css("display", "block");
    },
    onPlaceChanged() {
      const place = this.autocomplete.getPlace();

      if (!place.geometry) {
        document.getElementById("autocomplete").placeholder =
          "Street Address (auto complete)";
      } else {
        this.longitude = place.geometry.location.lng();
        this.$emit("update_d_longitude", this.longitude);
        this.latitude = place.geometry.location.lat();
        this.$emit("update_d_latitude", this.latitude);
        // this.street = place.name;
        for (const component of place.address_components) {
          const componentType = component.types[0];

          switch (componentType) {
            case "street_number":
              this.street = component.long_name;
              this.$emit("update_s_street", this.street);
              break;
            case "route":
              this.street = component.short_name;
              this.$emit("update_s_street", this.street);
              break;
            case "locality":
              this.city = component.long_name;
              this.$emit("update_s_city", this.city);
              break;
            case "administrative_area_level_1": {
              this.state = component.long_name;
              this.$emit("update_s_state", this.state);
              break;
            }
            case "country":
              this.city = component.long_name;
              this.$emit("update_s_city", this.city);
              break;
          }
        }
        if (this.street == "" || this.city == "" || this.state == "") {
          $(".upload-media #mediaLocation .box-2 .btn-group .next-btn").prop(
            "disabled",
            true
          );
        } else {
          $(".upload-media #mediaLocation .box-2 .btn-group .next-btn").prop(
            "disabled",
            false
          );
        }
      }
    },
  },
  watch: {
    collageName: function (val) {
      this.collageName = val;
      this.$emit("updateSName", this.collageName);
    },
    liveFromDate: function (val) {
      this.liveFromDate = val;
      this.$emit("updateDtLiveFrom", this.liveFromDate);
      this.yearFrom = this.getLiveYear(val);
    },
    liveToDate: function (val) {
      this.liveToDate = val;
      this.$emit("updateDtLiveTo", this.liveToDate);
      this.yearTo = this.getLiveYear(val);
      this.ageInYears = this.yearTo - this.yearFrom;
    },
    ageInYears: function (val) {
      this.ageInYears = val;
      this.$emit("updateIAge", this.ageInYears);
    },
    about: function (val) {
      this.about = val;
      this.$emit("updateSAbout", this.about);
    },
    street: function (val) {
      this.street == val;
      this.$emit("update_s_street", this.street);
      if (this.street == "" || this.city == "" || this.state == "") {
        $(".upload-media #mediaLocation .box-2 .btn-group .next-btn").prop(
          "disabled",
          true
        );
      } else {
        $(".upload-media #mediaLocation .box-2 .btn-group .next-btn").prop(
          "disabled",
          false
        );
      }
    },
    city: function (val) {
      this.city == val;
      this.$emit("update_s_city", this.city);
      if (this.street == "" || this.city == "" || this.state == "") {
        $(".upload-media #mediaLocation .box-2 .btn-group .next-btn").prop(
          "disabled",
          true
        );
      } else {
        $(".upload-media #mediaLocation .box-2 .btn-group .next-btn").prop(
          "disabled",
          false
        );
      }
    },
    state: function (val) {
      this.state == val;
      this.$emit("update_s_state", this.state);
      if (this.street == "" || this.city == "" || this.state == "") {
        $(".upload-media #mediaLocation .box-2 .btn-group .next-btn").prop(
          "disabled",
          true
        );
      } else {
        $(".upload-media #mediaLocation .box-2 .btn-group .next-btn").prop(
          "disabled",
          false
        );
      }
    },
    suite: function (val) {
      this.suite == val;
      this.$emit("update_s_suite", this.suite);
    },
    postalCode: function (val) {
      this.postalCode == val;
      this.$emit("update_s_postal_code", this.postalCode);
    },
  },
  mounted() {
    $("body").css("background-image", "none");
    $(".dashboard-container .content").css("padding", "0");
    $(".dashboard-container .content .create-memorial .container").css(
      "padding",
      "32px 25px 40px 25px"
    );

    const google = window.google;

    this.autocomplete = () => {
      return (this.autocomplete = google.maps.places.Autocomplete);
    };
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      {
        types: ["address"],
        // componentRestrictions: {'country': ['AU']},
        fields: ["address_components", "geometry", "name"],
      }
    );
    this.autocomplete.setComponentRestrictions({
      country: ["us", "pr", "vi", "gu", "mp", "eg", "ps"],
    });
    this.autocomplete.addListener("place_changed", this.onPlaceChanged);
  },
};
</script>

