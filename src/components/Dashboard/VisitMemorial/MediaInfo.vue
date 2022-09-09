<template>
  <div class="media-info">
    <div class="memorial-cover">
      <div class="main-media" v-if="tObject.length > 0">
        <img
          :src="tObject[0].s_file"
          alt="file"
          class="image"
          v-if="tObject[0].e_type == 'PHOTO'"
        />
        <video controls v-else-if="tObject[0].e_type == 'VIDEO'">
          <source
            :src="tObject[0].s_file + '#' + 't=1'"
            :type="'video/' + tObject[0].s_extension"
          />
          Your browser does not support the video tag.
        </video>
        <audio controls v-else-if="tObject[0].e_type == 'AUDIO'">
          <source
            :src="tObject[0].s_file + '#' + 't=1'"
            :type="'audio/' + tObject[0].s_extension"
          />
          Your browser does not support the audio tag.
        </audio>
        <iframe
          :src="
            'https://docs.google.com/gview?url=' +
            tObject[0].s_file +
            '&embedded=true'
          "
          width="100%"
          height="100%"
          frameborder="0"
          v-else-if="tObject[0].e_type == 'DOCUMENT'"
        ></iframe>
      </div>
      <div class="back-link" @click="backToMain">
        <img
          src="../../../assets/images/dashboard/memorial/left-arrow.svg"
          alt="back"
        />
      </div>
    </div>
    <div class="media-information" v-if="tObject.length > 0">
      <div class="information">
        <p class="head-title">Information</p>
        <p class="storage-space">
          {{ tObject[0].s_extension }} {{ tObject[0].e_type }} -
          {{ tObject[0].d_size }}
        </p>
        <div class="data">
          <div>
            <span>Media Type</span>
            <p>{{ tObject[0].e_type }}</p>
          </div>
          <div>
            <span>Uploaded by</span>
            <p>{{ tObject[0].s_user_name }}</p>
          </div>
          <div>
            <span>Uploaded at</span>
            <p>{{ tObject[0].dt_created_date }}</p>
          </div>
          <div class="location">
            <span>Location</span>
            <a href="javascript:void(0)"> {{ tObject[0].s_street }}</a>
          </div>
          <div class="tags">
            <span>Tags</span>
            <p>
              <span>{{
                tObject[0].tags?.map((x) => x.s_name).join(", ")
              }}</span>
            </p>
          </div>
          <div class="comments-items">
            <div class="head">
              <span>Comments ({{ mComments?.length }})</span>
              <a href="javascript:void(0)" @click="showAllComments">View all</a>
            </div>
            <div
              class="comment"
              v-for="item in mComments?.slice(0, 2)"
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
        </div>
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
        <div class="comment" v-for="item in mComments" :key="item.pk_i_id">
          <p>
            {{ item.s_comment }}
          </p>
          <p class="created">
            By {{ item.s_user_name }} on
            {{ timestampToDate(item.dt_created_date) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "MediaInfo",
  props: ["mediaObject", "mediaComments"],
  data() {
    return {
      tObject: this.mediaObject,
      mComments: this.mediaComments,
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
    backToMain() {
      $(".media-info").css("display", "none");
      $(".home").css("display", "block");
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
      this.$emit("updateMediaObject", this.tObject);
    },
    setComments(val) {
      this.mComments = val;
      this.$emit("updateMediaComments", this.mComments);
    },
  },
};
</script>