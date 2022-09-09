<template>
  <div class="dashboard-container">
    <AsideMenu :auth_user_type="auth_user.e_type"></AsideMenu>

    <Header :title="title" :image="auth_user.s_image"></Header>

    <div class="content">
      <router-view :authUser="auth_user" @update_user="updateUser" />
    </div>
    <div class="accounts-container">
      <div class="manage-accounts-menu">
        <div class="close-btn">
          <img
            src="../../assets/images/dashboard/home-icons/close.svg"
            alt="close"
            @click="closeAccoontsMenu"
          />
        </div>
        <div class="user-info">
          <div class="user-img">
            <router-link
              to="/GatekeeperProfile"
              tag="a"
              @click="hideSidebar"
              v-if="auth_user.e_type == 'GATEKEEPER'"
            >
              <img
                :src="auth_user.s_image"
                alt="user-img"
                v-if="auth_user.s_image"
              />
            </router-link>
            <router-link
              to="/ContributorProfile"
              tag="a"
              @click="hideSidebar"
              v-else
            >
              <img
                :src="auth_user.s_image"
                alt="user-img"
                v-if="auth_user.s_image"
              />
            </router-link>
          </div>
          <router-link
            to="/GatekeeperProfile"
            tag="a"
            @click="hideSidebar"
            v-if="auth_user.e_type == 'GATEKEEPER'"
            >{{ auth_user.s_fullname }}</router-link
          >
          <router-link
            to="/ContributorProfile"
            @click="hideSidebar"
            tag="a"
            v-else
            >{{ auth_user.s_fullname }}</router-link
          >
          <p>{{ auth_user.e_type }}</p>
          <!-- <p v-if="auth_user.e_type == 'GATEKEEPER'">Gatekeeper</p>
          <p v-else>Contributor</p> -->
        </div>
        <div class="user-acounts" v-if="accountsList.length > 0">
          <p class="title">Switch to:</p>
        </div>
        <div class="accounts">
          <div class="item" v-for="item in accountsList" :key="item.pk_i_id">
            <div class="user">
              <img
                :src="auth_user.s_image"
                alt="accounts"
                v-if="auth_user.s_image"
              />
              <img
                src="../../assets/images/dashboard/side-menu-icons/accounts.svg"
                alt="accounts"
                @click="toggleDropdown"
                v-else
              />
              <div class="name-title">
                <h5 @click="switchAccount(item.pk_i_id)">
                  {{ auth_user.s_fullname }}
                </h5>
                <span>{{ item.e_type }}</span>
              </div>
            </div>
            <div class="family">
              <p v-if="item.s_family_name">{{ item.s_family_name }}</p>
              <p v-else>--</p>
            </div>
          </div>
        </div>
        <div
          class="contributor"
          v-if="
            auth_user.e_type == 'CONTRIBUTOR' && !auth_user.b_gatekeeper_request
          "
        >
          <button
            class="become-gatekeeper"
            id="loadingBtn"
            @click="becomeGatekeeper"
          >
            Become a Gatekeeper
            <img src="../../assets/images/loading.gif" alt="loading" />
          </button>
          <p>14 days free trial</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AsideMenu from "../../components/Dashboard/AsideMenu.vue";
import Header from "../../components/Dashboard/Header.vue";
import $ from "jquery";
import axios from "axios";
import Pusher from "pusher-js";

export default {
  name: "Dashboard",
  data() {
    return {
      title: this.$route.meta.title,
      auth_user: "",
      accountsList: [],
    };
  },
  components: { AsideMenu, Header },
  methods: {
    showToast(data) {
      this.$toast.success(data, {
        type: "info",
        queue: true,
      });
    },
    closeAccoontsMenu() {
      $(".dashboard-container .accounts-container").animate({
        left: "100vw",
      });
      $(".dashboard-container .accounts-container")
        .delay()
        .queue(function (next) {
          $(this).css("display", "none");
          next();
        });
    },
    hideSidebar() {
      $(".dashboard-container .accounts-container").animate({
        left: "100vw",
      });
      $(".dashboard-container .accounts-container")
        .delay()
        .queue(function (next) {
          $(this).css("display", "none");
          next();
        });
    },
    updateUser(val) {
      this.auth_user = val;
    },
    async switchAccount(familyID) {
      await axios
        .post("/users/switch_account", { i_family_id: familyID })
        .then((res) => {
          if (res.data.status.success) {
            // this.closeAccoontsMenu();
            this.updateUser(res.data.users[0]);
            this.$router.push("/");
            location.reload();
            this.$toast.success(res.data.status.message);
          }
        });
    },
    async becomeGatekeeper() {
      $(
        ".dashboard-container .accounts-container .manage-accounts-menu #loadingBtn"
      ).prop("disabled", true);
      await axios.get("/users/be_gatekeeper").then(
        (res) => {
          if (res.data.status.success) {
            this.closeAccoontsMenu();
            this.updateUser(res.data.users[0]);
            axios.get("/users/families_list").then((result) => {
              if (result.data.status.success) {
                this.accountsList = result.data.families;
                this.$router.push("/GatekeeperProfile");
              }
            });
            this.$toast.success(res.data.status.message);
            $(
              ".dashboard-container .accounts-container .manage-accounts-menu #loadingBtn"
            ).prop("disabled", false);
          } else {
            $(
              ".dashboard-container .accounts-container .manage-accounts-menu #loadingBtn"
            ).prop("disabled", false);
          }
        },
        (error) => {
          if (error) {
            $(
              ".dashboard-container .accounts-container .manage-accounts-menu #loadingBtn"
            ).prop("disabled", false);
          }
        }
      );
    },
  },
  async mounted() {
    $("body").css("background-image", "none");

    await axios.get("/auth_user").then(
      (res) => {
        if (res.data.status.success) {
          this.auth_user = res.data.users[0];
          if (!res.data.users[0].is_subscribed) {
            this.$router.push("/Subscription");
          }

          axios.get("/users/families_list").then((result) => {
            if (result.data.status.success) {
              this.accountsList = result.data.families;
            }
          });
        } else {
          localStorage.removeItem("auth_user_token");
          this.$toast.error("Something went wrong, please try again.");
          this.$router.push("/login");
        }
      },
      (error) => {
        if (error) {
          localStorage.removeItem("auth_user_token");
          this.$toast.error("Something went wrong, please try again.");
          this.$router.push("/login");
        }
      }
    );
    setInterval(() => {
      this.title = this.$route.meta.title;
    }, 1000);

    // Pusher.logToConsole = true;
    // var pusher = new Pusher("f5b51b68580fdbbeab27", {
    //   cluster: "ap2",
    // });
    // endpoint: "https://tsback.smartpace.co.uk, http://127.0.0.1:8000",
    var pusher = new Pusher("f5b51b68580fdbbeab27", {
      cluster: "ap2",
      channelAuthorization: {
        endpoint: "http://127.0.0.1:8000/broadcasting/auth",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("auth_user_token"),
        },
      },
    });
    var channel = pusher.subscribe(
      "private-App.Models.TUser." + this.auth_user.pk_i_id
    );
    channel.bind(
      "Illuminate\\Notifications\\Events\\BroadcastNotificationCreated",
      (data) => {
        this.showToast(JSON.stringify(data.details));
      }
    );
  },
};
</script>

<style scoped>
@import "../../assets/css/aside-menu.css";
</style>
