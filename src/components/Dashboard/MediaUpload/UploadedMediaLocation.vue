<template>
  <div class="step-box next-step" id="mediaLocation">
    <div class="box-1">
      <h3 class="box-1-title">Location</h3>
      <p class="box-1-description">Description paragraph</p>

      <div class="location-form">
        <form>
          <input
            type="text"
            id="autocomplete"
            v-model="street"
            placeholder="Street Address (auto complete)"
          />
          <input type="text" v-model="suite" placeholder="suite #" />
          <input type="text" v-model="city" placeholder="City (auto filled)" />
          <input
            type="text"
            v-model="state"
            placeholder="State (auto filled)"
          />
          <input type="text" v-model="postalCode" placeholder="Postal code" />
        </form>
      </div>
    </div>
    <div class="box-2">
      <div class="image">
        <!-- {{ showImage }} -->
      </div>
      <div class="uploaded-media-info">
        <div>
          <span>Media Type</span>
          <p v-text="props_e_type"></p>
        </div>
        <div>
          <span>Media Format</span>
          <p v-text="props_s_extension"></p>
        </div>
        <div>
          <span>Media Size</span>
          <p v-text="props_d_size"></p>
        </div>
        <div>
          <span>Uploaded by</span>
          <p v-text="props_dt_uploaded_by"></p>
        </div>
        <div>
          <span>Uploaded at</span>
          <p v-text="props_dt_uploaded_at"></p>
        </div>
      </div>
      <div class="btn-group">
        <button class="back-btn" @click="showTimeStep">Back</button>
        <button class="next-btn" disabled @click="showMediaMemoryStep">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  name: "UploadedMediaLocation",
  props: [
    "props_e_type",
    "props_s_extension",
    "props_d_size",
    "props_dt_uploaded_by",
    "props_dt_uploaded_at",
    "uploaded_file",
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
    showTimeStep() {
      $("#mediaLocation").css("display", "none");
      $("#mediaTime").css("display", "flex");
      $("#showLocation").removeClass("active");
      $("#showTime").removeClass("done");
    },
    showMediaMemoryStep() {
      $("#mediaLocation").css("display", "none");
      $("#mediaMemory").css("display", "flex");
      $("#showLocation").addClass("done");
      $("#showMemory").addClass("active");
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
    const google = window.google;

    this.autocomplete = google.maps.places.Autocomplete;
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      {
        types: ["address"],
        // componentRestrictions: {'country': ['AU']},
        fields: ["address_components", "geometry", "name"],
      }
    );
    this.autocomplete.addListener("place_changed", this.onPlaceChanged);
  },
};
</script>
