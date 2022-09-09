<template>
  <div class="create-memorial">
    <NewMemorialStep1
      :coverObj="coverObj"
      @updateCoverObj="updateCoverObj"
      :s_cover="s_cover"
      @updateSCover="updateSCover"
    ></NewMemorialStep1>
    <NewMemorialStep2
      :coverObj="coverObj"
      :s_cover="s_cover"
      :s_name="s_name"
      @updateSName="updateSName"
      :dt_live_from="dt_live_from"
      @updateDtLiveFrom="updateDtLiveFrom"
      :dt_live_to="dt_live_to"
      @updateDtLiveTo="updateDtLiveTo"
      :i_age="i_age"
      @updateIAge="updateIAge"
      :s_about="s_about"
      @updateSAbout="updateSAbout"
      :props_d_longitude="d_longitude"
      @update_d_longitude="onUpdateDLongitude"
      :props_d_latitude="d_latitude"
      @update_d_latitude="onUpdateDLatitude"
      :props_s_street="s_street"
      @update_s_street="onUpdateSStreet"
      :props_s_suite="s_suite"
      @update_s_suite="onUpdateSSuite"
      :props_s_city="s_city"
      @update_s_city="onUpdateSCity"
      :props_s_state="s_state"
      @update_s_state="onUpdateSState"
      :props_s_postal_code="s_postal_code"
      @update_s_postal_code="onUpdateSPostalCode"
    ></NewMemorialStep2>
    <NewMemorialStep3
      :coverObj="coverObj"
      :s_cover="s_cover"
      :s_name="s_name"
      :dt_live_from="dt_live_from"
      :dt_live_to="dt_live_to"
      :i_age="i_age"
      :s_about="s_about"
      :props_d_longitude="d_longitude"
      :props_d_latitude="d_latitude"
      :props_s_street="s_street"
      :props_s_suite="s_suite"
      :props_s_city="s_city"
      :props_s_state="s_state"
      :props_s_postal_code="s_postal_code"
      :s_media_ids="s_media_ids"
      @updateSMediaIds="updateSMediaIds"
    ></NewMemorialStep3>
  </div>
</template>


<script>
import axios from "axios";
import NewMemorialStep1 from "../../../components/Dashboard/Memorials/NewMemorialStep1.vue";
import NewMemorialStep2 from "../../../components/Dashboard/Memorials/NewMemorialStep2.vue";
import NewMemorialStep3 from "../../../components/Dashboard/Memorials/NewMemorialStep3.vue";
export default {
  name: "NewMemorial",
  components: { NewMemorialStep1, NewMemorialStep2, NewMemorialStep3 },
  data() {
    return {
      coverObj: "",
      s_cover: "",
      s_name: "",
      dt_live_from: "",
      dt_live_to: "",
      i_age: "",
      s_about: "",
      d_longitude: "",
      d_latitude: "",
      s_street: "",
      s_suite: "",
      s_city: "",
      s_state: "",
      s_postal_code: "",
      s_media_ids: [],
    };
  },
  methods: {
    updateCoverObj(val) {
      this.coverObj = val;
    },
    updateSCover(val) {
      this.s_cover = val;
    },
    updateSName(val) {
      this.s_name = val;
    },
    updateDtLiveFrom(val) {
      this.dt_live_from = val;
    },
    updateDtLiveTo(val) {
      this.dt_live_to = val;
    },
    updateIAge(val) {
      this.i_age = val;
    },
    updateSAbout(val) {
      this.s_about = val;
    },
    onUpdateDLongitude(newValue) {
      this.d_longitude = newValue;
    },
    onUpdateDLatitude(newValue) {
      this.d_latitude = newValue;
    },
    onUpdateSStreet(newValue) {
      this.s_street = newValue;
    },
    onUpdateSSuite(newValue) {
      this.s_suite = newValue;
    },
    onUpdateSCity(newValue) {
      this.s_city = newValue;
    },
    onUpdateSState(newValue) {
      this.s_state = newValue;
    },
    onUpdateSPostalCode(newValue) {
      this.s_postal_code = newValue;
    },
    updateSMediaIds(val) {
      this.s_media_ids = val;
    },
  },
  async mounted() {
    await axios.get("/auth_user").then((res) => {
      if (res.data.status.success) {
        if (!res.data.users[0].has_memorial || res.data.users[0].e_type != 'GATEKEEPER') {
          this.$router.push("/Dashboard/Memorials");
        }
      }
    });
  },
};
</script>

<style scoped>
@import url("../../../assets/css/memorials.css");
</style>