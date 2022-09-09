<template>
  <div class="home">
    <div class="family">
      <div class="family-media">
        <div class="welcome">
          <p>Welcome To the<br />story of</p>
          <h1 v-if="authUser.s_family_name != 'null'">
            {{ authUser.s_family_name }}
          </h1>
          <h1 v-else>--</h1>
        </div>
        <img
          src="../../assets/images/loading.gif"
          alt="loading"
          style="width: 50px; height: 50px"
          v-if="statisticsLoading === true"
        />
        <div class="media-items" v-else>
          <div @click="goTo('/Dashboard/Media')">
            <div class="title">
              <h3>
                <router-link to="/Dashboard/Media" tag="a">Media</router-link>
              </h3>
              <span>{{ mediaCount }}</span>
            </div>
            <div class="img">
              <img
                src="../../assets/images/dashboard/home-icons/film.svg"
                alt="film"
              />
            </div>
          </div>
          <div @click="goTo('/Dashboard/Albums')">
            <div class="title">
              <h3>
                <router-link to="/Dashboard/Albums" tag="a">Albums</router-link>
              </h3>
              <span>{{ albumsCount }}</span>
            </div>
            <div class="img">
              <img
                src="../../assets/images/dashboard/home-icons/image-gallery.svg"
                alt="gallery"
              />
            </div>
          </div>
          <div @click="goTo('/Dashboard/Collages')">
            <div class="title">
              <h3>
                <router-link to="/Dashboard/Collages" tag="a"
                  >Collages</router-link
                >
              </h3>
              <span>{{ collagesCount }}</span>
            </div>
            <div class="img">
              <img
                src="../../assets/images/dashboard/home-icons/collage.svg"
                alt="collage"
              />
            </div>
          </div>
          <div @click="goTo('/Dashboard/Journeys')">
            <div class="title">
              <h3>
                <router-link to="/Dashboard/Journeys" tag="a"
                  >Journeys</router-link
                >
              </h3>
              <span>{{ journysCount }}</span>
            </div>
            <div class="img">
              <img
                src="../../assets/images/dashboard/home-icons/compass-3.svg"
                alt="compass"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="family-image">
        <img
          v-if="authUser.s_family_image"
          :src="authUser.s_family_image"
          alt="family"
        />
        <img
          src="../../assets/images/dashboard/side-menu-icons/accounts.svg"
          alt="accounts"
          v-else
        />
      </div>
    </div>
    <img
      src="../../assets/images/loading.gif"
      alt="loading"
      style="width: 50px; height: 50px"
      v-if="memorialLoading"
    />
    <div
      class="recent-memorials"
      v-else-if="!memorialLoading && memorialsList.length > 0"
    >
      <div class="flex-row">
        <h3>Recent Memorials</h3>
        <router-link to="/Dashboard/Memorials" tag="a" class="view-all-link"
          >View all</router-link
        >
      </div>
      <div
        class="item"
        v-for="item in memorialsList?.slice(0, 2)"
        :key="item.pk_i_id"
      >
        <img
          class="header-image"
          :src="item.s_cover"
          alt="recent-memorials"
          @click="viewMemorial(item.pk_i_id)"
        />
        <div class="info">
          <h4>{{ item.s_name }}</h4>
          <div class="tools">
            <div class="head">
              <span
                >{{ timestampToDate(item.dt_live_from) }} -
                {{ timestampToDate(item.dt_live_to) }}</span
              >
              <img
                src="../../assets/images/dashboard/home-icons/overflow-menu-vertical.svg"
                alt="menu-vertical"
                @click="toggleDropdown(item.pk_i_id)"
              />
            </div>
            <div class="dropdown" :id="'dropdown' + item.pk_i_id">
              <button @click="editMemorial(item.pk_i_id)">
                <img
                  src="../../assets/images/dashboard/media/edit.svg"
                  alt="edit"
                />
                Edit
              </button>
              <button
                @click="
                  goTo('/Dashboard/ViewMemorial/' + item.pk_i_id + '/share')
                "
              >
                <img
                  src="../../assets/images/dashboard/media/external-link.svg"
                  alt="share"
                />
                Share
              </button>
              <button @click="showArchiveMemorialModel(item.pk_i_id)">
                <img
                  src="../../assets/images/dashboard/media/archive.svg"
                  alt="archive"
                />
                Archive
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="model-container" id="sendToPrinter">
      <div class="model-box">
        <h3 class="model-title">Share Memorial</h3>
        <div v-if="errors.length">
          <b style="color: brown">Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
        </div>
        <div class="input-group">
          <label>Email Address</label>
          <input type="email" name="email" v-model="s_email" />
        </div>
        <div class="input-group">
          <label>Your Message</label>
          <textarea v-model="s_message"></textarea>
        </div>
        <div class="btn-group">
          <button class="btn-sm-light" @click="hideSendToPrinterModel">
            Cancel
          </button>
          <button class="btn-sm-dark" @click="sendToPrinter">Send</button>
        </div>
      </div>
    </div> -->
    <div class="model-container" id="archiveMediaConfirm">
      <div class="model-box">
        <h3 class="model-title">Archive Memorial</h3>
        <div v-if="errors.length">
          <b style="color: brown">Error(s):</b>
          <ul>
            <li v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
        </div>
        <p>Are you sure you want to archive this memorial ?</p>
        <div class="btn-group">
          <button class="btn-sm-light" @click="cancelArchiveMemorial">
            Cancel
          </button>
          <button
            class="btn-sm-dark"
            @click="archiveMemorial(archivedMemorialID)"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import axios from "axios";
export default {
  name: "Home",
  props: ["authUser"],
  data() {
    return {
      mediaCount: "",
      albumsCount: "",
      journysCount: "",
      collagesCount: "",
      memorialsList: [],
      shareID: "",
      s_email: "",
      s_message: "",
      archivedMemorialID: "",
      errors: [],
      memorialLoading: false,
      statisticsLoading: false,
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
    goTo(url) {
      this.$router.push(url);
    },
    toggleDropdown(memorialID) {
      $(".home .recent-memorials .item .tools #dropdown" + memorialID).toggle();
    },
    editMemorial(memorialID) {
      this.$router.push({ name: "EditMemorial", params: { id: memorialID } });
    },
    showArchiveMemorialModel(memorialID) {
      this.errors = [];
      this.archivedMemorialID = memorialID;
      $(".home .model-container#archiveMediaConfirm").css("display", "flex");
    },
    cancelArchiveMemorial() {
      this.errors = [];
      $(".home .model-container#archiveMediaConfirm").css("display", "none");
    },
    async archiveMemorial(memorialID) {
      await axios
        .post("/memorials/archive", { i_memorial_id: memorialID })
        .then((res) => {
          if (res.data.status.success) {
            this.cancelArchiveMemorial();
            axios.get("/memorials?e_status=PUBLISHED").then((res) => {
              if (res.data.status.success) {
                this.memorialsList = res.data.memorials;
              }
            });
          } else {
            this.errors.push(res.data.status.message);
          }
        });
    },
    viewMemorial(memorialID) {
      this.$router.push("/Dashboard/ViewMemorial/" + memorialID);
    },
    // showShareInfoModel(memorialID) {
    //   this.shareID = memorialID;
    //   $(".home .model-container#sendToPrinter").css("display", "flex");
    //   $(".home .recent-memorials .item .tools #dropdown" + memorialID).toggle();
    // },
    // hideSendToPrinterModel() {
    //   $(".home .model-container#sendToPrinter").css("display", "none");
    // },
    // sendToPrinter() {
    //   if (this.s_email == "") {
    //     this.errors.push("Email Required");
    //   } else if (this.s_message == "") {
    //     this.errors.push("Message Required");
    //   } else {
    //     let memorial = new FormData();
    //     memorial.append("fk_i_memorial_id", this.shareID);
    //     memorial.append("s_email", this.s_email);
    //     memorial.append("s_message", this.s_message);
    //     axios.post("/memorials/memorial_action", memorial).then((res) => {
    //       if (res.data.status.success) {
    //         //show success model
    //         this.hideSendToPrinterModel();
    //       } else {
    //         this.errors.push("Server Error!");
    //       }
    //     });
    //   }
    // },
  },
  async mounted() {
    $("body").css("background-image", "none");
    $(".dashboard-container .content").css("padding", "32px 25px 0 25px");

    this.statisticsLoading = true;
    await axios.get("/home").then((res) => {
      if (res.data.status.success) {
        this.statisticsLoading = false;
        this.mediaCount = res.data.media_count;
        this.albumsCount = res.data.albums_count;
        this.journysCount = res.data.journeys_count;
        this.collagesCount = res.data.collages_count;
      }
    });

    await axios.get("/memorials?e_status=PUBLISHED").then((res) => {
      this.memorialLoading = true;
      if (res.data.status.success) {
        this.memorialLoading = false;
        this.memorialsList = res.data.memorials;
      }
    });
  },
};
</script>

<style scoped>
@import "../../assets/css/home.css";
</style>
