<template>
  <header>
    <h2>{{ title }}</h2>
    <div class="top-right-nav">
      <ul>
        <li class="external-link">
          <router-link to="/Dashboard/Share" tag="a">
            <img
              src="../../assets/images/dashboard/side-menu-icons/external-link.svg"
              alt="external-link"
            />
          </router-link>
        </li>
        <li class="bell">
          <img
            src="../../assets/images/dashboard/side-menu-icons/bell.svg"
            alt="bell"
            @click="showNotificationList"
          />
        </li>
        <li class="account">
          <img
            :src="image"
            alt="accounts"
            @click="toggleDropdown"
            v-if="image"
          />
          <img
            src="../../assets/images/dashboard/side-menu-icons/accounts.svg"
            alt="accounts"
            @click="toggleDropdown"
            v-else
          />
        </li>
      </ul>
    </div>
    <div class="notifications-container" id="notificationsList">
      <div class="notifications">
        <div class="header">
          <h2>Notification</h2>
          <button id="closeNotification">
            <img
              src="../../assets/images/dashboard/home-icons/close.svg"
              alt="close"
              @click="hideNotificationList"
            />
          </button>
        </div>
        <div class="list">
          <div v-for="(item, key) in notificationList" :key="key">
            <p class="date">
              {{ checkDay(key) }}
            </p>
            <div v-for="(notification, index) in item" :key="index">
              <div
                :class="
                  notification.read_at == null ? 'notify unread' : 'notify'
                "
              >
                <p
                  class="pointer"
                  @click="
                    showItem(
                      notification.data['clickable'],
                      notification.data['type'],
                      notification.data['media_id']
                    )
                  "
                  v-if="
                    notification.data['clickable'] &&
                    notification.data['type'] == 'media'
                  "
                >
                  {{ notification.data["details"] }}
                  <q v-if="notification.data['reason']">{{
                    notification.data["reason"]
                  }}</q>
                </p>
                <p
                  class="pointer"
                  @click="
                    showItem(
                      notification.data['clickable'],
                      notification.data['type'],
                      notification.data['media_id'],
                      notification.data['comment_id']
                    )
                  "
                  v-else-if="
                    notification.data['clickable'] &&
                    notification.data['type'] == 'comment'
                  "
                >
                  {{ notification.data["details"] }}
                  <q v-if="notification.data['reason']">{{
                    notification.data["reason"]
                  }}</q>
                </p>
                <p v-else>
                  {{ notification.data["details"] }}
                  <q v-if="notification.data['reason']">{{
                    notification.data["reason"]
                  }}</q>
                </p>
                <span>{{ getHour(notification.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import axios from "axios";
import $ from "jquery";

export default {
  name: "Header",
  props: ["title", "image"],
  data() {
    return {
      notificationList: [],
    };
  },
  methods: {
    getHour(date) {
      var time = new Date(date);
      return time.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    },
    checkDay(day) {
      let today = new Date();
      let check = new Date(day);
      if (
        check.getFullYear() == today.getFullYear() &&
        check.getMonth() == today.getMonth() &&
        check.getDate() == today.getDate()
      ) {
        return "Today";
      } else {
        return this.timestampToDate(day);
      }
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
    async showNotificationList() {
      $("#notificationsList").css("display", "block").animate({
        left: "0",
      });
      await axios.get("/notifications").then((res) => {
        if (res.data.status.success) {
          this.notificationList = res.data.notifications;
        }
      });
    },
    readNotification(e) {
      $(e.target).removeClass("unread");
    },
    hideNotificationList() {
      $("#notificationsList").animate({
        left: "100vw",
      });
      $("#notificationsList")
        .delay()
        .queue(function (next) {
          $(this).css("display", "none");
          next();
        });

      $("#notificationsList .notifications").animate({
        scrollTop: 0,
      });
    },
    toggleDropdown() {
      $(".dashboard-container .accounts-container")
        .css("display", "block")
        .animate({
          left: "0",
        });
    },
    showItem(isClickable, itemType, itemID, commentId = "") {
      this.hideNotificationList();
      if (isClickable) {
        if (itemType == "media") {
          // this.$router.push("/Dashboard/Media/" + itemType + "/" + itemID);
          this.$router.push({
            name: "Media",
            params: { type: itemType, id: itemID },
          });
        } else if (itemType == "comment") {
          this.$router.push({
            name: "Media",
            params: { type: itemType, id: itemID, commentID: commentId },
          });
        }
      }
    },
  },
};
</script>
