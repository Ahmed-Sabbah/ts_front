<template>
  <div class="media-info">
    <a
      id="back-link"
      href="javascript:void(0);"
      onclick="javascript:history.go(-1);"
    >
      <img
        src="../../../assets/images/dashboard/memorial/left-arrow.svg"
        alt="back"
      />
    </a>
    <Carousel
      :settings="settings"
      :items-to-show="1.5"
      :currentSlide="currentSlide"
      @update:modelValue="updateSlidesData"
    >
      <Slide v-for="item in mediaList" :key="item.pk_i_id">
        <img
          :src="item.s_file"
          alt="file"
          class="image"
          v-if="item.e_type == 'PHOTO'"
        />
        <video controls v-else-if="item.e_type == 'VIDEO'">
          <source
            :src="item.s_file + '#' + 't=1'"
            :type="'video/' + item.s_extension"
          />
          Your browser does not support the video tag.
        </video>
        <audio controls v-else-if="item.e_type == 'AUDIO'">
          <source
            :src="item.s_file + '#' + 't=1'"
            :type="'audio/' + item.s_extension"
          />
          Your browser does not support the audio tag.
        </audio>
        <iframe
          :src="
            'https://docs.google.com/gview?url=' +
            item.s_file +
            '&embedded=true'
          "
          width="100%"
          height="100%"
          frameborder="0"
          v-else-if="item.e_type == 'DOCUMENT'"
        ></iframe>
      </Slide>
      <template #addons>
        <Pagination />
      </template>
    </Carousel>
    <div class="media-information">
      <div class="information">
        <p class="head-title">Information</p>
        <p class="storage-space">
          {{ mediaList[currentSlide].s_extension }}
          {{ mediaList[currentSlide].e_type }} -
          {{ mediaList[currentSlide].d_size }}
        </p>
        <div class="data">
          <div>
            <span>Media Type</span>
            <p>{{ mediaList[currentSlide].e_type }}</p>
          </div>
          <div>
            <span>Uploaded by</span>
            <p>{{ mediaList[currentSlide].s_user_name }}</p>
          </div>
          <div>
            <span>Uploaded at</span>
            <p>{{ mediaList[currentSlide].dt_created_date }}</p>
          </div>
          <div class="location">
            <span>Location</span>
            <a
              href="javascript:void(0)"
              @click="
                toggleLocationPreview(
                  mediaList[currentSlide].d_longitude,
                  mediaList[currentSlide].d_latitude
                )
              "
            >
              {{ mediaList[currentSlide].s_street }}</a
            >
          </div>
          <div class="tags">
            <span>Tags</span>
            <p>
              <span>{{
                mediaList[currentSlide].tags?.map((x) => x.s_name).join(", ")
              }}</span>
            </p>
          </div>
          <div class="comments-items">
            <div class="head">
              <span
                >Comments ({{ mediaList[currentSlide].comments?.length }})</span
              >
              <a href="javascript:void(0)" @click="showAllComments">View all</a>
            </div>
            <div
              class="comment"
              v-for="item in mediaList[currentSlide].comments?.slice(0, 2)"
              :key="item.pk_i_id"
            >
              <p>
                {{ item.s_comment }}
              </p>
              <p class="created">
                By {{ item.s_user_name }} on
                {{ timestampToDate(item.dt_created_date) }}
              </p>
            </div>
          </div>
          <div>
            <span>Views ({{ mediaList[currentSlide].views?.length }})</span>
            <a href="javascript:void(0)" @click="toggleViewsPreview"
              >View all</a
            >
            <div class="users">
              <div
                class="member-image"
                v-for="item in mediaList[currentSlide].views?.slice(0, 4)"
                :key="item.pk_i_id"
              >
                <img :src="item.s_image" alt="member" v-if="item.s_image" />
                <img
                  src="../../../assets/images/dashboard/side-menu-icons/accounts.svg"
                  alt="accounts"
                  @click="toggleDropdown"
                  v-else
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="location-preview">
        <span class="back-link" @click="toggleLocationPreview">
          <img
            src="../../../assets/images/dashboard/contributors/back.svg"
            alt="back"
          />
          Back
        </span>
        <p class="title">Location</p>
        <a href="#" target="_blank" class="location">{{
          mediaList[currentSlide].s_street
        }}</a>
        <div class="map" id="map"></div>
      </div>
      <div class="all-comments">
        <span class="back-link" @click="closeAllComments">
          <img
            src="../../../assets/images/dashboard/contributors/back.svg"
            alt="back"
          />
          Back
        </span>
        <p class="title">Comments</p>
        <div
          class="comment"
          v-for="item in mediaList[currentSlide].comments"
          :key="item.pk_i_id"
        >
          <p>
            {{ item.s_comment }}
          </p>
          <p class="created">
            By {{ item.s_user_name }} on
            {{ timestampToDate(item.dt_created_date) }}
          </p>
        </div>
      </div>
      <div class="views-preview">
        <span class="back-link" @click="toggleViewsPreview">
          <img
            src="../../../assets/images/dashboard/contributors/back.svg"
            alt="back"
          />
          Back
        </span>
        <p class="title">Views</p>
        <div class="members-views">
          <div
            class="view"
            v-for="item in mediaList[currentSlide].views"
            :key="item.pk_i_id"
          >
            <div class="member-image">
              <img :src="item.s_image" alt="member" v-if="item.s_image" />
              <img
                src="../../../assets/images/dashboard/side-menu-icons/accounts.svg"
                alt="accounts"
                @click="toggleDropdown"
                v-else
              />
            </div>
            <div class="view-info">
              <h4>{{ item.s_user_name }}</h4>
              <p>{{ timestampToDate(item.dt_created_date) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination } from "vue3-carousel";

export default {
  name: "MediaPreviewSmall",
  props: ["mediaList", "mediaLength", "shareId", "salt"],
  components: {
    Carousel,
    Slide,
    Pagination,
  },
  data() {
    return {
      tObject: "",
      mComments: this.mediaComments,
      currentSlide: 0,
      settings: {
        itemsToShow: 1,
        snapAlign: "center",
        dir: "ltr",
      },
      //   modelValue: Carousel,
    };
  },
  methods: {
    updateSlidesData(val) {
      this.currentSlide = val;
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
    toggleViewsPreview() {
      $(".small-screen .media-info .media-information .views-preview").toggle();
      $(".small-screen .media-info .media-information .information").toggle();
    },
    toggleLocationPreview(long, lat) {
      $(".media-info .media-information .location-preview").toggle();
      $(".media-info .media-information .information").toggle();
      this.showLocationOnMap(long, lat);
    },
    showLocationOnMap(lat, lng) {
      const google = window.google;
      var mapProp = {
        zoom: 10,
        center: new google.maps.LatLng(lng, lat),
      };
      let map = new google.maps.Map(document.getElementById("map"), mapProp);

      new google.maps.Marker({
        position: new google.maps.LatLng(lng, lat),
        map: map,
      });
    },
    showAllComments() {
      $(".media-info .information").css("display", "none");
      $(".media-info .all-comments").css("display", "block");
    },
    closeAllComments() {
      $(".media-info .all-comments").css("display", "none");
      $(".media-info .information").css("display", "block");
    },
    setObject(val) {
      this.tObject = val;
    },
  },
};
</script>