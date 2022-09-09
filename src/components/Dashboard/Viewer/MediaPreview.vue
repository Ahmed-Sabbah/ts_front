<template>
  <div class="preview-media">
    <div class="selected-media">
      <div
        class="main-media"
        v-if="previewState"
        @click="show(previewMedia.e_type, $event)"
      >
        <img
          :src="previewMedia.s_file"
          alt="file"
          class="image"
          v-if="previewMedia.e_type == 'PHOTO'"
        />
        <video controls v-else-if="previewMedia.e_type == 'VIDEO'">
          <source
            :src="previewMedia.s_file + '#' + 't=1'"
            :type="'video/' + previewMedia.s_extension"
          />
          Your browser does not support the video tag.
        </video>
        <audio controls v-else-if="previewMedia.e_type == 'AUDIO'">
          <source
            :src="previewMedia.s_file + '#' + 't=1'"
            :type="'audio/' + previewMedia.s_extension"
          />
          Your browser does not support the audio tag.
        </audio>
        <iframe
          :src="
            'https://docs.google.com/gview?url=' +
            previewMedia.s_file +
            '&embedded=true'
          "
          width="100%"
          height="100%"
          frameborder="0"
          v-else-if="previewMedia.e_type == 'DOCUMENT'"
        ></iframe>
      </div>
      <div class="main-media empty" v-else></div>

      <div class="media-information">
        <div class="information" v-if="previewState">
          <div class="tools">
            <div class="head">
              <p>Information</p>
            </div>
          </div>
          <p class="storage-space">
            {{ previewMedia.s_extension }} {{ previewMedia.e_type }} -
            {{ previewMedia.d_size }}
          </p>
          <div class="data" style="padding-bottom: 70px">
            <div>
              <span>Media Type</span>
              <p>{{ previewMedia.e_type }}</p>
            </div>
            <div>
              <span>Uploaded by</span>
              <p>{{ previewMedia.s_user_name }}</p>
            </div>
            <div>
              <span>Uploaded at</span>
              <p>{{ previewMedia.dt_created_date }}</p>
            </div>
            <div class="location">
              <span>Location</span>
              <a
                href="javascript:void(0)"
                @click="
                  toggleLocationPreview(
                    previewMedia.d_longitude,
                    previewMedia.d_latitude
                  )
                "
              >
                {{ previewMedia.s_street }}</a
              >
            </div>
            <div class="tags">
              <span>Tags</span>
              <p>
                <span>
                  {{ previewMedia.tags?.map((x) => x.s_name).join(", ") }}</span
                >
              </p>
            </div>
            <div>
              <span>Comments ({{ previewMedia.comments?.length }})</span>
              <a href="javascript:void(0)" @click="toggleCommentsPreview"
                >View all</a
              >
              <div
                class="comment"
                v-for="item in previewMedia.comments?.slice(0, 2)"
                :key="item.pk_i_id"
              >
                <p>
                  {{ item.s_comment }}
                </p>
                <div class="created">
                  <div class="head">
                    <p>
                      By {{ item.s_user_name }} on
                      {{ timestampToDate(item.dt_created_date) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="previewMedia.views.length > 0">
              <span>Views ({{ previewMedia.views?.length }})</span>
              <a href="javascript:void(0)" @click="toggleViewsPreview"
                >View all</a
              >
              <div class="users">
                <div
                  class="member-image"
                  v-for="item in previewMedia.views?.slice(0, 4)"
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
        <div class="location-preview" v-if="previewState">
          <span class="back-link" @click="toggleLocationPreview">
            <img
              src="../../../assets/images/dashboard/contributors/back.svg"
              alt="back"
            />
            Back
          </span>
          <p class="title">Location</p>
          <a href="#" target="_blank" class="location">{{
            previewMedia.s_street
          }}</a>
          <div class="map" id="map"></div>
        </div>
        <div class="comments-preview" v-if="previewState">
          <span class="back-link" @click="toggleCommentsPreview">
            <img
              src="../../../assets/images/dashboard/contributors/back.svg"
              alt="back"
            />
            Back
          </span>
          <p class="title">Comments</p>
          <div class="comments">
            <div
              class="comment"
              v-for="item in previewMedia.comments"
              :key="item.pk_i_id"
            >
              <p>
                {{ item.s_comment }}
              </p>
              <div class="created">
                <div class="head">
                  <p>
                    By {{ item.s_user_name }} on
                    {{ timestampToDate(item.dt_created_date) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="views-preview" v-if="previewState">
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
              v-for="item in previewMedia.views"
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
        <p class="select-msg" v-else>
          Select a media <br />
          to preview
        </p>
      </div>
    </div>
    <div class="images" v-viewer="{ movable: false }">
      <img v-for="src in images" :src="src" :key="src" />
    </div>
  </div>
</template>

<script>
import $ from "jquery";
// import axios from "axios";
import "viewerjs/dist/viewer.css";
import { directive as viewer } from "v-viewer";

export default {
  name: "MediaPreview",
  props: [
    "previewState",
    "previewMedia",
    "mediaList",
    "emptyState",
    "mediaComments",
    "photos",
  ],
  directives: {
    viewer: viewer({
      debug: true,
    }),
  },
  data() {
    return {
      previewStatus: this.previewState,
      media: this.mediaList,
      emptyStatus: this.emptyState,
      selectedComment: "",
      updatedCommantID: "",
      updatedCommantMediaID: "",
      archivedMediaID: "",
      comments: this.mediaComments,
      src: "",
      images: [],
    };
  },
  methods: {
    timestampToDate(val) {
      var date = new Date(val);
      return (
        date.toLocaleString("default", { month: "short" }) +
        " " +
        date.getDay() +
        1 +
        "," +
        " " +
        date.getFullYear()
      );
    },
    toggleLocationPreview(long, lat) {
      $(".preview-media .media-information .location-preview").toggle();
      $(".preview-media .media-information .information").toggle();
      this.showLocationOnMap(long, lat);
    },
    toggleCommentsPreview() {
      $(".preview-media .media-information .comments-preview").toggle();
      $(".preview-media .media-information .information").toggle();
    },
    toggleViewsPreview() {
      $(".preview-media .media-information .views-preview").toggle();
      $(".preview-media .media-information .information").toggle();
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
    inited(viewer) {
      this.$viewer = viewer;
    },
    show(type, ev) {
      this.src = "";
      this.images = [];
      if (type == "PHOTO") {
        this.src = ev.target.src;
        let test = this.mediaList
          .filter((type) => type.e_type == "PHOTO")
          .map((key) => key.s_file);
        for (let index = 0; index < test.length; index++) {
          this.images.push(test[index]);
        }
        let index = this.images.indexOf(this.src);
        Array.prototype.move = function (from, to) {
          this.splice(to, 0, this.splice(from, 1)[0]);
        };
        this.images.move(index, 0);
        const viewer = this.$el.querySelector(".images").$viewer;
        viewer.show();
      }
    },
  },
};
</script>

<style scoped>
@import url("../../../assets/css/media-preview.css");
</style>
