<template>
  <div style="height: 100%">
    <NewCollageStep1
      v-if="uploadComponentState"
      :s_name="s_name"
      @update_s_name="onUpdateSName"
      :e_type="e_type"
    ></NewCollageStep1>
    <NewCollageStep2
      v-if="uploadComponentState"
      :e_type="e_type"
      :i_num_photo="i_num_photo"
      :e_orientation="e_orientation"
      :s_size="s_size"
    ></NewCollageStep2>
    <NewCollageStep3
      v-if="uploadComponentState"
      :collageID="collageID"
      :s_name="s_name"
      :e_type="e_type"
      :s_cover="s_cover"
      @update_s_cover="onUpdateSCover"
      :i_num_photo="i_num_photo"
      :e_orientation="e_orientation"
      :s_size="s_size"
      :s_media_ids="s_media_ids"
      @update_s_media_ids="onUpdateSMediaIds"
      :s_order="s_order"
      @onUpdateSOrder="onUpdateSOrder"
    ></NewCollageStep3>
  </div>
</template>

<script>
import $ from "jquery";
import NewCollageStep1 from "../../../components/Dashboard/EditCollages/NewCollageStep1.vue";
import NewCollageStep2 from "../../../components/Dashboard/EditCollages/NewCollageStep2.vue";
import NewCollageStep3 from "../../../components/Dashboard/EditCollages/NewCollageStep3.vue";
import axios from "axios";

export default {
  name: "NewCollage",
  data() {
    return {
      collageID: this.$route.params.id,
      s_name: "",
      e_type: "",
      s_cover: "",
      i_num_photo: "",
      e_orientation: "",
      s_size: "",
      s_media_ids: [],
      s_order: {},
      uploadComponentState: false,
    };
  },
  components: { NewCollageStep1, NewCollageStep2, NewCollageStep3 },
  methods: {
    onUpdateSName(val) {
      this.s_name = val;
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
    onUpdateSOrder(val) {
      this.s_order = val;
    },
  },
  async mounted() {
    $(".dashboard-container .content").css("padding", "32px 25px 0 25px");

    await axios.get("/auth_user").then((res) => {
      if (res.data.status.success) {
        if (res.data.users[0].e_type != "GATEKEEPER") {
          this.$router.push("/Dashboard/Collages");
        }
      }
    });

    await axios.get("/collages?id=" + this.collageID).then((res) => {
      if (res.data.status.success) {
        const collage = res.data.collages[0];
        this.s_name = collage.s_name;
        this.e_type = collage.e_type;
        this.i_num_photo = collage.i_num_photo;
        this.e_orientation = collage.e_orientation;
        this.s_media_ids = collage.s_media_ids
          ? collage.s_media_ids.split(",")
          : "";
        this.s_size = collage.s_size;
        this.s_order = JSON.parse(collage.s_order);
        this.uploadComponentState = true;
        this.$route.meta.title = res.data.collages[0].s_name;
      } else {
        this.$router.push("/Dashboard/Collages");
      }
    });
  },
};
</script>

<style scoped>
@import url("../../../assets/css/collages.css");
</style>
