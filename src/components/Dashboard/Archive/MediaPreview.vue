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
              <img
                src="../../../assets/images/dashboard/home-icons/overflow-menu-vertical.svg"
                alt="menu-vertical"
                @click="toggleDropdown"
                v-if="
                  previewMedia.b_owner ||
                  previewMedia.e_user_type == 'GATEKEEPER'
                "
              />
            </div>
            <div
              class="dropdown"
              v-if="
                previewMedia.b_owner || previewMedia.e_user_type == 'GATEKEEPER'
              "
            >
              <button
                @click="editMedia(previewMedia.pk_i_id)"
                v-if="previewMedia.b_owner"
              >
                <img
                  src="../../../assets/images/dashboard/media/edit.svg"
                  alt="edit"
                />
                Edit
              </button>
              <!-- <button @click="unArchiveMedia(previewMedia.pk_i_id)" v-if="previewMedia.b_archived"></button> -->
              <button
                @click="archiveMedia(previewMedia.pk_i_id)"
                v-if="previewMedia.b_owner"
              >
                <img
                  src="../../../assets/images/dashboard/media/archive.svg"
                  alt="archive"
                />
                Unarchive
              </button>
              <button
                class="btn-danger"
                @click="revmoveMedia(previewMedia.pk_i_id)"
                v-if="previewMedia.b_owner"
              >
                <img
                  src="../../../assets/images/dashboard/media/trash.svg"
                  alt="trash"
                />
                Remove
              </button>
              <button
                class="btn-danger"
                @click="unpublishMedia(previewMedia.pk_i_id)"
                v-if="
                  !previewMedia.b_owner &&
                  previewMedia.e_user_type == 'GATEKEEPER'
                "
              >
                <img
                  src="../../../assets/images/dashboard/media/plus-circle.svg"
                  alt="trash"
                />
                Unpublish
              </button>
            </div>
          </div>
          <p class="storage-space">
            {{ previewMedia.s_extension }} {{ previewMedia.e_type }} -
            {{ previewMedia.d_size }}
          </p>
          <div class="data">
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
                >{{ previewMedia.s_street }}</a
              >
            </div>
            <div class="tags">
              <span>Tags</span>
              <p>
                <span>{{
                  previewMedia.tags?.map((x) => x.s_name).join(", ")
                }}</span>
              </p>
            </div>
            <div>
              <span>Comments ({{ mediaComments?.length }})</span>
              <a href="javascript:void(0)" @click="toggleCommentsPreview"
                >View all</a
              >
              <div
                :class="
                  item.selected && item.selected == true
                    ? 'comment selected'
                    : 'comment'
                "
                v-for="item in mediaComments?.slice(0, 2)"
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
                    <img
                      src="../../../assets/images/dashboard/home-icons/overflow-menu-vertical.svg"
                      alt="menu-vertical"
                      @click="toggleCommentMenu(item.pk_i_id)"
                      v-if="
                        item.b_owner || (previewMedia.e_user_type == 'GATEKEEPER' && item.b_unpublished == false && !item.b_owner)
                      "
                    />
                  </div>
                  <div
                    class="dropdown"
                    :id="'dropdown' + item.pk_i_id"
                    v-if="
                      item.b_owner || (previewMedia.e_user_type == 'GATEKEEPER' && item.b_unpublished == false && !item.b_owner)
                    "
                  >
                    <button
                      @click="
                        showEditCommentModel(item.pk_i_id, previewMedia.pk_i_id)
                      "
                      v-if="item.b_owner"
                    >
                      <img
                        src="../../../assets/images/dashboard/media/edit.svg"
                        alt="edit"
                      />
                      Edit
                    </button>
                    <button
                      class="btn-danger"
                      @click="revmoveComment(item.pk_i_id)"
                      v-if="item.b_owner"
                    >
                      <img
                        src="../../../assets/images/dashboard/media/trash.svg"
                        alt="trash"
                      />
                      Remove
                    </button>
                    <button
                      class="btn-danger"
                      @click="unpublishComment(item.pk_i_id)"
                      v-if="
                        !item.b_owner &&
                        item.e_user_type == 'GATEKEEPER' &&
                        item.b_unpublished == false
                      "
                    >
                      <img
                        src="../../../assets/images/dashboard/media/plus-circle.svg"
                        alt="trash"
                      />
                      Unpublish
                    </button>
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
          <a href="#" target="_blank" class="location"
            >2909 Baxter Rd Ann Arbor, MI 48109</a
          >
          <div class="map" id="map">
            <!-- <img
              src="../../../assets/images/dashboard/media/map.png"
              alt="map"
            /> -->
          </div>
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
              v-for="item in mediaComments"
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
                  <img
                    src="../../../assets/images/dashboard/home-icons/overflow-menu-vertical.svg"
                    alt="menu-vertical"
                    @click="togglePreviweCommentMenu(item.pk_i_id)"
                    v-if="
                      item.b_owner || previewMedia.e_user_type == 'GATEKEEPER'
                    "
                  />
                </div>
                <div
                  class="dropdown"
                  :id="'dropdown' + item.pk_i_id"
                  v-if="
                    item.b_owner || previewMedia.e_user_type == 'GATEKEEPER'
                  "
                >
                  <button
                    @click="
                      showEditCommentModel(item.pk_i_id, previewMedia.pk_i_id)
                    "
                    v-if="item.b_owner"
                  >
                    <img
                      src="../../../assets/images/dashboard/media/edit.svg"
                      alt="edit"
                    />
                    Edit
                  </button>
                  <button
                    class="btn-danger"
                    @click="revmoveComment(item.pk_i_id)"
                    v-if="item.b_owner"
                  >
                    <img
                      src="../../../assets/images/dashboard/media/trash.svg"
                      alt="trash"
                    />
                    Remove
                  </button>
                  <button
                    class="btn-danger"
                    @click="unpublishComment(item.pk_i_id)"
                    v-if="!item.b_owner && item.e_user_type == 'GATEKEEPER'"
                  >
                    <img
                      src="../../../assets/images/dashboard/media/plus-circle.svg"
                      alt="trash"
                    />
                    Unpublish
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="new-comment">
            <input
              type="text"
              id="newCommentValue"
              placeholder="Add your comment"
            />
            <button @click="addComment(previewMedia.pk_i_id)">
              <img
                src="../../../assets/images/dashboard/media/send-2.svg"
                alt="send-2"
              />
            </button>
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
                <img :src="item.s_image" alt="member" />
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
    <div class="model-container" id="editCommentModel">
      <div class="model-box">
        <h3 class="model-title">Edit Comment</h3>
        <textarea id="editComment" v-model="selectedComment"></textarea>
        <div class="btn-group">
          <button class="btn-sm-light" @click="hideModel">Cancel</button>
          <button
            class="btn-sm-dark"
            @click="
              updateCommentAction(updatedCommantID, updatedCommantMediaID)
            "
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
    <div class="model-container" id="archiveMediaConfirm">
      <div class="model-box">
        <h3 class="model-title">Unarchive Media</h3>
        <p>Are you sure you want to unarchive this media ?</p>
        <div class="btn-group">
          <button class="btn-sm-light" @click="cancelArchiveMedia">
            Cancel
          </button>
          <button
            class="btn-sm-dark"
            @click="confirmArchiveMedia(archivedMediaID)"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
    <div class="model-container" id="removeMediaConfirm">
      <div class="model-box">
        <h3 class="model-title">Remove Media</h3>
        <p>Are you sure you want to remove this media ?</p>
        <div class="btn-group">
          <button class="btn-sm-light" @click="cancelMediaRemove">
            Cancel
          </button>
          <button class="btn-sm-dark" @click="confirmMediaRemove(mediaId)">
            Confirm
          </button>
        </div>
      </div>
    </div>
    <div class="model-container" id="unpublishMediaConfirm">
      <div class="model-box">
        <h3 class="model-title">Unpublish Media</h3>
        <p>Are you sure you want to unpublish this media ?</p>
        <div class="btn-group">
          <button class="btn-sm-light" @click="cancelUnpublishMedia">
            Cancel
          </button>
          <button class="btn-sm-dark" @click="confirmUnpublishMedia">
            Confirm
          </button>
        </div>
      </div>
    </div>
    <div class="model-container" id="unpublishCommentConfirm">
      <div class="model-box">
        <h3 class="model-title">Unpublish Comment</h3>
        <p>Are you sure you want to unpublish this comment ?</p>
        <div class="btn-group">
          <button class="btn-sm-light" @click="cancelUnpublishComment">
            Cancel
          </button>
          <button class="btn-sm-dark" @click="confirmUnpublishComment">
            Confirm
          </button>
        </div>
      </div>
    </div>
    <div class="model-container" id="unpublishReasonModel">
      <div class="model-box">
        <h3 class="model-title">Reason of unpublishing</h3>
        <div style="margin: 10px 0" v-if="errors.length">
          <b style="color: brown">Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
        </div>
        <textarea
          id="unpuplishReason"
          v-model="unpublishedReason"
          placeholder="Mention your reason here"
        ></textarea>
        <div class="btn-group">
          <button class="btn-sm-light" @click="cancelUnpublished">
            Cancel
          </button>
          <button
            class="btn-sm-dark"
            @click="unpublishedMediaSubmit(unpublishedID, unpublishedReason)"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
    <div class="model-container" id="removeCommentConfirm">
      <div class="model-box">
        <h3 class="model-title">Remove Comment</h3>
        <p>Are you sure you want to remove this comment ?</p>
        <div class="btn-group">
          <button class="btn-sm-light" @click="cancelCommentRemove">
            Cancel
          </button>
          <button
            class="btn-sm-dark"
            @click="confirmCommentRemove(removedComment)"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
    <div class="model-container" id="unpublishCommentReasonModel">
      <div class="model-box">
        <h3 class="model-title">Reason of unpublishing</h3>
        <div style="margin: 10px 0" v-if="errors.length">
          <b style="color: brown">Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
        </div>
        <textarea
          id="unpuplishReason"
          v-model="unpublishedCommentReason"
          placeholder="Mention your reason here"
        ></textarea>
        <div class="btn-group">
          <button class="btn-sm-light" @click="cancelUnpublished">
            Cancel
          </button>
          <button
            class="btn-sm-dark"
            @click="
              unpublishedCommentSubmit(unpublishedID, unpublishedCommentReason)
            "
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
    <div class="images" v-viewer="{ movable: false }">
      <img v-for="src in images" :src="src" :key="src" />
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import axios from "axios";
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
  ],
  data() {
    return {
      mediaId: "",
      previewStatus: this.previewState,
      media: this.mediaList,
      emptyStatus: this.emptyState,
      selectedComment: "",
      updatedCommantID: "",
      updatedCommantMediaID: "",
      archivedMediaID: "",
      unpublishedID: "",
      unpublishedReason: "",
      unpublishedCommentReason: "",
      comments: this.mediaComments,
      removedComment: "",
      images: [],
      errors: [],
      src: "",
    };
  },
  directives: {
    viewer: viewer({
      debug: true,
    }),
  },
  methods: {
    timestampToDate(val) {
      var date = new Date(val.replace(/-/g, "/"));
      return (
        date.toLocaleString("default", { month: "short" }) +
        " " +
        date.getDay() +
        "," +
        " " +
        date.getFullYear()
      );
    },
    toggleDropdown() {
      $(
        ".preview-media .media-information .information .tools .dropdown"
      ).toggle();
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
    toggleCommentMenu(val) {
      $(
        ".preview-media .media-information .information .data .comment #dropdown" +
          val
      ).toggle();
    },
    togglePreviweCommentMenu(val) {
      $(
        ".preview-media .media-information .comments-preview .comments .comment #dropdown" +
          val
      ).toggle();
    },
    addComment(mediaID) {
      const comment = $(
        ".preview-media .comments-preview .new-comment #newCommentValue"
      ).val();
      if (comment == "") {
        this.$toast.error("Comment Required!");
      } else {
        axios
          .post("/media/action", {
            fk_i_media_id: mediaID,
            e_action_type: "COMMENT",
            s_comment: comment,
          })
          .then((res) => {
            $(
              ".preview-media .comments-preview .new-comment #newCommentValue"
            ).val("");
            if (res.data.status.success) {
              axios
                .get("/media/comments?i_media_id=" + mediaID)
                .then((response) => {
                  if (response.data.status.success) {
                    this.comments = response.data.comments;
                    this.$emit("updateMediaComments", this.comments);
                  }
                });
            }
          });
      }
    },
    toggleViewsPreview() {
      $(".preview-media .media-information .views-preview").toggle();
      $(".preview-media .media-information .information").toggle();
    },
    revmoveMedia(mediaID) {
      this.mediaId = mediaID;
      $(".preview-media .model-container#removeMediaConfirm").css(
        "display",
        "flex"
      );
      this.toggleDropdown(mediaID);
    },
    cancelMediaRemove() {
      this.mediaId = "";
      $(".preview-media .model-container#removeMediaConfirm").hide();
    },
    async confirmMediaRemove(mediaID) {
      await axios.post("/media/delete", { media_id: mediaID }).then((res) => {
        if (res.data.status.success) {
          axios
            .get("/media/comments?i_media_id=" + mediaID)
            .then((response) => {
              if (response.data.status.success) {
                this.comments = response.data.comments;
                this.$emit("updateMediaComments", this.comments);
              }
            });
          this.cancelMediaRemove();
          this.previewStatus = false;
          this.$emit("updatePreviewState", this.previewStatus);
          axios.get("/archive").then((res) => {
            if (res.data.status.success) {
              this.media = res.data.media.filter(
                (key) => key.b_archived == false
              );
              this.$emit("updateMediaList", this.media);
              if (this.media.length > 0) {
                this.emptyStatus = true;
                this.$emit("updateEmptyState", this.emptyStatus);
              }
            }
          });
        }
      });
    },
    editMedia(mediaID) {
      this.$router.push({ name: "EditMedia", params: { id: mediaID } });
    },
    async showEditCommentModel(commentID, mediaID) {
      //, mediaId
      await axios.get("/media/comments?id=" + commentID).then((res) => {
        if (res.data.status.success) {
          this.selectedComment = res.data.comments[0].s_comment;
          this.updatedCommantID = commentID;
          this.updatedCommantMediaID = mediaID;
        }
      });
      $(
        ".preview-media .media-information .comments-preview .comments .comment #dropdown" +
          commentID
      ).toggle();
      $(
        ".preview-media .media-information .data .comment #dropdown" + commentID
      ).toggle();
      $("#editCommentModel").css("display", "flex");
    },
    updateCommentAction(commentID, mediaID) {
      axios
        .post("/media/action", {
          pk_i_id: commentID,
          fk_i_media_id: mediaID,
          e_action_type: "COMMENT",
          s_comment: this.selectedComment,
        })
        .then((res) => {
          if (res.data.status.success) {
            $("#editCommentModel").css("display", "none");
            $(
              ".preview-media .media-information .comments-preview .comments .comment #dropdown" +
                commentID
            ).hide();
            axios
              .get("/media/comments?i_media_id=" + mediaID)
              .then((response) => {
                if (response.data.status.success) {
                  this.comments = response.data.comments;
                  this.$emit("updateMediaComments", this.comments);
                }
              });
          }
        });
    },
    hideModel() {
      $("#editCommentModel").hide();
    },
    showLocationOnMap(lat, lng) {
      const google = window.google;
      var mapProp = {
        zoom: 15,
        center: new google.maps.LatLng(lng, lat),
        // mapTypeId: google.maps.MapTypeId.ROADMAP,
      };
      let map = new google.maps.Map(document.getElementById("map"), mapProp);

      new google.maps.Marker({
        position: new google.maps.LatLng(lng, lat),
        map: map,
      });
    },
    archiveMedia(mediaID) {
      this.archivedMediaID = mediaID;
      this.toggleDropdown();
      $(".preview-media #archiveMediaConfirm").css("display", "flex");
    },
    cancelArchiveMedia() {
      this.archivedMediaID = "";
      $(".preview-media #archiveMediaConfirm").css("display", "none");
    },
    async confirmArchiveMedia(mediaID) {
      await axios
        .post("/media/archive", { i_media_id: mediaID })
        .then((res) => {
          if (res.data.status.success) {
            $(".preview-media #archiveMediaConfirm").css("display", "none");
            axios.get("/archive").then((res) => {
              if (res.data.status.success) {
                this.media = res.data.media;
                this.$emit("updateMediaList", this.media);
                this.previewStatus = false;
                this.$emit("updatePreviewState", this.previewStatus);
                if (this.media.length > 0) {
                  this.emptyStatus = true;
                  this.$emit("updateEmptyState", this.emptyStatus);
                }
              }
            });
          }
        });
    },
    inited(viewer) {
      this.$viewer = viewer;
    },
    show(type, ev) {
      this.src = "";
      if (type == "PHOTO") {
        this.src = ev.target.src;
        let index = this.images.indexOf(this.src);
        Array.prototype.move = function (from, to) {
          this.splice(to, 0, this.splice(from, 1)[0]);
        };
        this.images.move(index, 0);
        // this.images.sort((a) => a == this.src);
        // this.images.unshift(this.src);
        const viewer = this.$el.querySelector(".images").$viewer;
        viewer.show();
        // this.images.shift(this.src);
        //   // window.open(file);
        // const elem = ev.target;
        //   if (elem.requestFullscreen) {
        //     elem.requestFullscreen();
        //   } else if (elem.webkitRequestFullscreen) {
        //     /* Safari */
        //     elem.webkitRequestFullscreen();
        //   } else if (elem.msRequestFullscreen) {
        //     /* IE11 */
        //     elem.msRequestFullscreen();
        //   }
      }
    },
    unpublishMedia(mediaID) {
      this.unpublishedID = mediaID;
      $(".preview-media #unpublishMediaConfirm").css("display", "flex");
      this.toggleDropdown();
    },
    cancelUnpublishMedia() {
      this.unpublishedID = "";
      $(".preview-media #unpublishMediaConfirm").hide();
    },
    confirmUnpublishMedia() {
      $(".preview-media #unpublishMediaConfirm").hide();
      $(".preview-media #unpublishReasonModel").css("display", "flex");
    },
    async unpublishedMediaSubmit(mediaID, reason) {
      this.errors = [];
      await axios
        .post("/media/unpublish", { i_media_id: mediaID, s_reason: reason })
        .then((res) => {
          if (res.data.status.success) {
            this.cancelUnpublished();
            axios.get("/archive").then((response) => {
              if (response.data.status.success) {
                // this.media = res.data.media.filter(
                //   (key) => key.b_archived == false
                // );
                this.media = response.data.media;
                this.$emit("updateMediaList", this.media);
                if (this.media.length > 0) {
                  this.emptyStatus = false;
                  this.$emit("updateEmptyState", this.emptyStatus);
                  this.previewStatus = false;
                  this.$emit("updatePreviewState", this.previewStatus);
                }
              }
            });
          } else {
            this.errors.push(res.data.status.message);
          }
        });
    },
    cancelUnpublished() {
      this.errors = [];
      this.unpublishedID = "";
      this.unpublishedReason = "";
      this.unpublishedCommentReason = "";
      $(".preview-media #unpublishReasonModel").hide();
      $(".preview-media #unpublishCommentReasonModel").hide();
    },
    unpublishComment(commentID) {
      this.unpublishedID = commentID;
      $(".preview-media #unpublishCommentConfirm").css("display", "flex");
      this.toggleCommentMenu(commentID);
    },
    cancelUnpublishComment() {
      this.unpublishedID = "";
      $(".preview-media #unpublishCommentConfirm").hide();
    },
    confirmUnpublishComment() {
      $(".preview-media #unpublishCommentConfirm").hide();
      $(".preview-media #unpublishCommentReasonModel").css("display", "flex");
    },
    async unpublishedCommentSubmit(commentID, reason) {
      this.errors = [];
      await axios
        .post("/comments/unpublish", {
          i_comment_id: commentID,
          s_reason: reason,
        })
        .then((res) => {
          if (res.data.status.success) {
            this.cancelUnpublished();
            axios
              .get("/media/comments?i_media_id=" + this.previewMedia.pk_i_id)
              .then((response) => {
                if (response.data.status.success) {
                  this.comments = response.data.comments;
                  this.$emit("updateMediaComments", this.comments);
                }
              });
          } else {
            this.errors.push(res.data.status.message);
          }
        });
    },
    revmoveComment(commentID) {
      this.removedComment = commentID;
      $(".preview-media #removeCommentConfirm").css("display", "flex");
      $(
        ".preview-media .media-information .information .data .comment #dropdown" +
          commentID
      ).hide();
      $(
        ".preview-media .comments-preview .comments .comment #dropdown" +
          commentID
      ).hide();
    },
    cancelCommentRemove() {
      this.removedComment = "";
      $(".preview-media #removeCommentConfirm").hide();
    },
    async confirmCommentRemove(commentID) {
      await axios
        .post("/comments/delete", { comment_id: commentID })
        .then((res) => {
          if (res.data.status.success) {
            this.cancelCommentRemove();
            axios
              .get("/media/comments?i_media_id=" + this.previewMedia.pk_i_id)
              .then((response) => {
                if (response.data.status.success) {
                  this.comments = response.data.comments;
                  this.$emit("updateMediaComments", this.comments);
                }
              });
          } else {
            this.$toast.error(res.data.status.message);
          }
        });
    },
  },
  async mounted() {
    await axios.get("/archive?e_type=PHOTO").then((res) => {
      if (res.data.status.success) {
        const files = res.data.media.map((key) => key.s_file);
        for (let index = 0; index < files.length; index++) {
          this.images.push(files[index]);
        }
      }
    });
  },
};
</script>

<style scoped>
@import url("../../../assets/css/media-preview.css");
</style>
