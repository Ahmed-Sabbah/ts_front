<template>
  <div style="height: 100%">
    <NewCollageStep1
      :s_name="s_name"
      @update_s_name="onUpdateSName"
      :e_type="e_type"
      @update_e_type="onUpdateEType"
    ></NewCollageStep1>
    <NewCollageStep2
      :e_type="e_type"
      :i_num_photo="i_num_photo"
      @update_i_num_photo="onUpdateINumPhoto"
      :e_orientation="e_orientation"
      @update_e_orientation="onUpdateEOrientation"
      :s_size="s_size"
      @update_s_size="onUpdateSSize"
    ></NewCollageStep2>
    <NewCollageStep3
      :s_name="s_name"
      :e_type="e_type"
      :s_cover="s_cover"
      @update_s_cover="onUpdateSCover"
      :i_num_photo="i_num_photo"
      :e_orientation="e_orientation"
      :s_size="s_size"
      :s_media_ids="s_media_ids"
      @update_s_media_ids="onUpdateSMediaIds"
    ></NewCollageStep3>
  </div>
</template>

<script>
import $ from "jquery";
import NewCollageStep1 from "../../../components/Dashboard/Collages/NewCollageStep1.vue";
import NewCollageStep2 from "../../../components/Dashboard/Collages/NewCollageStep2.vue";
import NewCollageStep3 from "../../../components/Dashboard/Collages/NewCollageStep3.vue";

export default {
  name: "NewCollage",
  data() {
    return {
      s_name: "",
      e_type: "",
      s_cover: "",
      i_num_photo: "",
      e_orientation: "",
      s_size: "",
      s_media_ids: [],
    };
  },
  methods: {
    onUpdateSName(val) {
      this.s_name = val;
    },
    onUpdateEType(val) {
      this.e_type = val;
    },
    onUpdateSCover(val) {
      this.s_cover = val;
    },
    onUpdateINumPhoto(val) {
      this.i_num_photo = val;
    },
    onUpdateEOrientation(val) {
      this.e_orientation = val;
    },
    onUpdateSSize(val) {
      this.s_size = val;
    },
    onUpdateSMediaIds(val) {
      this.s_media_ids = val;
    },
  },
  mounted() {
    $(".dashboard-container .content").css("padding", "32px 25px 0 25px");
  },
  components: { NewCollageStep1, NewCollageStep2, NewCollageStep3 },
};
</script>

<style scoped>
@import url("../../../assets/css/collages.css");
</style>
