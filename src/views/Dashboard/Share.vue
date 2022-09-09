<template>
  <div class="share-media">
    <h3 class="title" v-if="albumsList.length > 0">Choose albums to share</h3>
    <div class="albums">
      <div
        class="item"
        v-for="item in albumsList"
        :key="item.pk_i_id"
        :id="'album' + item.pk_i_id"
        @click="addToAlbums(item.pk_i_id)"
      >
        <img :src="item.s_cover.s_file" alt="media" />
        <div class="data">
          <h4>{{ item.s_name }}</h4>
          <span>By: {{ item.s_creator_name }}</span>
        </div>
      </div>
    </div>
    <h3 class="title" v-if="journeysList.length > 0">
      Choose journeys to share
    </h3>
    <div class="journeys">
      <div
        class="item"
        v-for="item in journeysList"
        :key="item.pk_i_id"
        :id="'journey' + item.pk_i_id"
        @click="addToJourneys(item.pk_i_id)"
      >
        <img :src="item.s_cover.s_file" alt="media" />
        <div class="data">
          <h4>{{ item.s_name }}</h4>
          <span>By: {{ item.s_creator_name }}</span>
        </div>
      </div>
    </div>
    <div class="btn-group">
      <button class="share-all-btn" @click="showAllLinksModel">
        All shared links
      </button>
      <button
        class="share-btn"
        @click="showShareInfoModel"
        :disabled="shareAlbumsList.length == 0 && shareJourneysList.length == 0"
      >
        Share
      </button>
    </div>
    <div class="model-container" id="shareInfoModel">
      <div class="model-box">
        <h3 class="model-title">Share</h3>
        <div v-if="errors.length">
          <b style="color: brown">Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
        </div>
        <div class="input-group">
          <label>Viewer Full Name</label>
          <input type="text" name="fullName" v-model="s_fullname" />
        </div>
        <div class="input-group">
          <label>Viewer Email address</label>
          <input type="email" name="email" v-model="s_email" />
        </div>
        <div class="input-group">
          <label>Message to the Viewer</label>
          <textarea v-model="s_message"></textarea>
        </div>
        <div class="contributor-permissions">
          <div class="select-permissions">
            <div class="flex-row">
              <p class="title">Expiry Date</p>
              <label class="switch">
                <input
                  type="checkbox"
                  value="true"
                  checked
                  v-model="expiryDate"
                />
                <span class="slider round"></span>
              </label>
            </div>
            <!-- new Date().toISOString().split('T')[0] -->
            <input
              type="date"
              :disabled="!expiryDate"
              placeholder="mm/dd/yy"
              :min="
                new Date(new Date().setDate(new Date().getDate() + 1))
                  .toISOString()
                  .split('T')[0]
              "
              v-model="s_date"
              id="dateInput"
            />
          </div>
        </div>
        <div class="btn-group">
          <button class="btn-sm-light" @click="hideShareInfoModel">
            Cancel
          </button>
          <button class="btn-sm-dark" id="loadingBtn" @click="sendShareInfo">
            Send share link
            <img src="../../assets/images/loading.gif" alt="loading" />
          </button>
        </div>
      </div>
    </div>
    <div class="model-container" id="allLinksModel">
      <div class="model-box">
        <h3 class="model-title">Shared Links</h3>
        <table>
          <thead>
            <tr>
              <th>Viewer Name</th>
              <th>Link</th>
              <th>Expiry Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in sharedLinks" :key="item.pk_i_id">
              <td class="viewer-name">
                {{ item.s_fullname.substring(0, 12) }}
              </td>
              <td class="link">
                <a :href="item.s_link" target="_blank">{{ item.s_link.substring(0, 25) }}</a>
              </td>
              <td class="expire-date">
                {{
                  item.dt_expiry_date != ""
                    ? timestampToDate(item.dt_expiry_date)
                    : "-"
                }}
              </td>
              <td class="action" @click="changeStatus(item.pk_i_id)">
                <a href="javascript:void(0)">Disable</a>
              </td>
            </tr>
          </tbody>
        </table>
        <paginate
          :initialPage="pageInatial"
          :page-count="sharedLinksPages"
          :page-range="4"
          :margin-pages="1"
          :click-handler="clickCallback"
          :prev-text="'Prev'"
          :next-text="'Next'"
          :container-class="'pagination'"
          :page-class="'page-item'"
        >
        </paginate>
        <div class="btn-group">
          <button class="btn-sm-dark" @click="hideAllLinksModel">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import axios from "axios";
import Paginate from "vuejs-paginate-next";

export default {
  name: "Share",
  components: {
    paginate: Paginate,
  },
  data() {
    return {
      pageInatial: 1,
      albumsList: [],
      journeysList: [],
      shareAlbumsList: [],
      shareJourneysList: [],
      sharedLinks: [],
      sharedLinksPages: "",
      s_fullname: "",
      s_email: "",
      s_message: "",
      expiryDate: true,
      s_date: "",
      errors: [],
    };
  },
  watch: {
    expiryDate: function (val) {
      this.expiryDate = val;
    },
    shareAlbumsList: function (val) {
      this.shareAlbumsList = val;
      if (this.shareAlbumsList.length > 0) {
        $(".share-media .share-btn").prop("disabled", false);
      } else {
        $(".share-media .share-btn").prop("disabled", true);
      }
    },
    shareJourneysList: function (val) {
      this.shareJourneysList = val;
      if (this.shareJourneysList.length > 0) {
        $(".share-media .share-btn").prop("disabled", false);
      } else {
        $(".share-media .share-btn").prop("disabled", true);
      }
    },
  },
  methods: {
    async clickCallback(pageNum) {
      await axios.get("/share?i_page_number=" + pageNum).then((res) => {
        if (res.data.status.success) {
          this.sharedLinks = res.data.shares;
          this.pageInatial = res.data.pagination.i_current_page;
          this.sharedLinksPages = res.data.pagination.i_total_pages;
        }
      });
    },
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
    async changeStatus(linkID) {
      await axios
        .post("/share/change_status", { i_share_id: linkID })
        .then((res) => {
          if (res.data.status.success) {
            axios.get("/share").then((res) => {
              if (res.data.status.success) {
                this.sharedLinks = res.data.shares
                  .filter((val) => val.b_enabled == true)
                  .slice(0, 4);
              }
            });
          }
        });
    },
    addToAlbums(albumID) {
      const index = this.shareAlbumsList.indexOf(albumID);
      if (index > -1) {
        this.shareAlbumsList.splice(index, 1);
        $("#album" + albumID).removeClass("selected");
      } else {
        $("#album" + albumID).addClass("selected");

        this.shareAlbumsList.push(albumID);
      }
    },
    addToJourneys(journeyID) {
      const index = this.shareJourneysList.indexOf(journeyID);
      if (index > -1) {
        this.shareJourneysList.splice(index, 1);
        $("#journey" + journeyID).removeClass("selected");
      } else {
        $("#journey" + journeyID).addClass("selected");
        this.shareJourneysList.push(journeyID);
      }
    },
    async showAllLinksModel() {
      await axios
        .get("/share?i_page_number=" + this.pageInatial)
        .then((res) => {
          if (res.data.status.success) {
            this.sharedLinks = res.data.shares;
            this.sharedLinksPages = res.data.pagination.i_total_pages;
          }
        });
      $(".share-media #allLinksModel").css("display", "flex");
    },
    hideAllLinksModel() {
      $(".share-media #allLinksModel").css("display", "none");
    },
    showShareInfoModel() {
      $(".share-media #shareInfoModel").css("display", "flex");
    },
    hideShareInfoModel() {
      $(".share-media #shareInfoModel").css("display", "none");
      this.s_fullname = "";
      this.s_email = "";
      this.s_message = "";
      this.expiryDate = true;
      this.s_date = "";
      this.errors = [];
    },
    async sendShareInfo() {
      this.errors = [];

      if (this.s_fullname == "") {
        this.errors.push("Full Name filed is required");
      } else if (this.s_email == "") {
        this.errors.push("Email filed is required");
      } else if (this.expiryDate && this.s_date == "") {
        this.errors.push("Date filed is required");
      } else {
        $(
          ".share-media .model-container#shareInfoModel .model-box #loadingBtn"
        ).prop("disabled", true);
        const shareInfo = new FormData();
        shareInfo.set("s_albums_ids", this.shareAlbumsList);
        shareInfo.set("s_journeys_ids", this.shareJourneysList);
        shareInfo.set("s_fullname", this.s_fullname);
        shareInfo.set("s_email", this.s_email);
        shareInfo.set("s_message", this.s_message);
        shareInfo.set("dt_expiry_date", this.s_date);
        await axios.post("/share/add_edit", shareInfo).then((res) => {
          this.errors = [];
          if (res.data.status.success) {
            $(
              ".share-media .model-container#shareInfoModel .model-box #loadingBtn"
            ).prop("disabled", false);
            $(".item").removeClass("selected");
            this.hideShareInfoModel();
            this.$toast.success(res.data.status.message);
            this.shareAlbumsList = [];
            this.shareJourneysList = [];
            this.s_fullname = "";
            this.s_email = "";
            this.s_message = "";
            this.expiryDate = true;
            this.s_date = "";
            this.errors = [];
          } else {
            $(
              ".share-media .model-container#shareInfoModel .model-box #loadingBtn"
            ).prop("disabled", false);
            this.errors.push(res.data.status.message);
          }
        });
      }
    },
  },
  mounted() {
    $("body").css("background-image", "none");
    $(".dashboard-container .content").css("padding", "32px 25px 0 25px");
    axios.get("/albums").then((res) => {
      if (res.data.status.success) {
        this.albumsList = res.data.media;
      }
    });

    axios.get("/journeys").then((res) => {
      if (res.data.status.success) {
        this.journeysList = res.data.media;
      }
    });
  },
};
</script>

<style scoped>
@import url("../../assets/css/share-media.css");
/* Write your own CSS for pagination */
/* .pagination {

} */
</style>
