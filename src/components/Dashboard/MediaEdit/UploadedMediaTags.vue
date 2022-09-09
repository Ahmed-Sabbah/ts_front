<template>
  <div class="step-box next-step" id="mediaTag">
    <div class="box-1">
      <h3 class="box-1-title">Tags</h3>
      <p class="box-1-description">Description paragraph</p>

      <div class="tags">
        <div class="input-group" v-for="tag in tagsList" :key="tag.pk_i_id">
          <label
            ><input
              type="checkbox"
              :value="tag.pk_i_id"
              :checked="Object.values(selectedTags).includes(tag.pk_i_id)"
              @change="selectedTagsFilter($event)"
            /><span class="checkmark"></span>
            <p>{{ tag.s_name }}</p></label
          >
        </div>
        <div class="new-tag" @click="showAddTagForm">
          <span>+ Add tag</span>
        </div>
        <div class="new-tag-form">
          <input type="text" id="newTagName" />
          <div class="btn-group">
            <button class="danger" @click="discardAddTag">Discard</button>
            <button class="default" id="addNewTag" @click="newTagSubmit">
              Save
            </button>
          </div>
        </div>
      </div>
      <div class="scroll-btn-broup">
        <button @click="scrollLeft" :disabled="prevLink === null">
          <img
            src="../../../assets/images/dashboard/media/Left.svg"
            alt="Left"
          />
        </button>
        <button @click="scrollRight" :disabled="nextLink === null">
          <img
            src="../../../assets/images/dashboard/media/Right.svg"
            alt="Right"
          />
        </button>
      </div>
    </div>
    <div class="box-2">
      <div class="image">
        <!-- {{ showImage }} -->
      </div>
      <div class="uploaded-media-info">
        <div>
          <span>Media Type</span>
          <p v-text="props_e_type"></p>
        </div>
        <div>
          <span>Media Format</span>
          <p v-text="props_s_extension"></p>
        </div>
        <div>
          <span>Media Size</span>
          <p v-text="props_d_size"></p>
        </div>
        <div>
          <span>Uploaded by</span>
          <p v-text="props_dt_uploaded_by"></p>
        </div>
        <div>
          <span>Uploaded at</span>
          <p v-text="props_dt_uploaded_at"></p>
        </div>
      </div>
      <div class="btn-group">
        <button class="back-btn" @click="showMediaUploadStep">Back</button>
        <button class="next-btn" disabled @click="showFamityAndFriendsStep">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import axios from "axios";

export default {
  name: "UploadedMediaTags",
  props: [
    "props_e_type",
    "props_s_extension",
    "props_d_size",
    "props_dt_uploaded_by",
    "props_dt_uploaded_at",
    "props_s_tags_ids",
  ],
  data() {
    return {
      eType: this.props_e_type,
      sExtension: this.props_s_extension,
      selectedTags: this.props_s_tags_ids,
      tagsList: [],
      prevLink: "",
      nextLink: "",
    };
  },
  methods: {
    showMediaUploadStep() {
      $("#emptyStatus").css("display", "flex");
      $("#mediaTag").css("display", "none");
      $("#showTag").removeClass("active");
    },
    showFamityAndFriendsStep() {
      $("#familyAndFriends").css("display", "flex");
      $("#mediaTag").css("display", "none");
      $("#showTag").addClass("done");
      $("#showFriends").addClass("active");
    },
    showAddTagForm() {
      $("#mediaTag .box-1 .tags .new-tag").css("display", "none");
      $("#mediaTag .box-1 .tags .new-tag-form").css("display", "flex");
    },
    discardAddTag() {
      $("#mediaTag .box-1 .tags .new-tag-form").css("display", "none");
      $("#mediaTag .box-1 .tags .new-tag").css("display", "inline-block");
    },
    newTagSubmit() {
      const newTag = $(".new-tag-form #newTagName").val();
      if (newTag != "") {
        axios
          .post("/tags_members/add", { s_name: newTag, e_type: "TAG" })
          .then((res) => {
            if (res.data.status.success) {
              axios.get("/tags").then((result) => {
                if (result.data.status.success) {
                  this.tagsList = result.data.tags;
                  this.prevLink = result.data.pagination.previous;
                  this.nextLink = result.data.pagination.next;
                }
              });
              // this.tagsList.unshift(res.data.tags[0]);
              $(".new-tag-form #newTagName").val("");
              this.discardAddTag();
            } else {
              this.$toast.error(res.data.status.message);
            }
          });
      }
    },
    selectedTagsFilter(event) {
      if (event.target.checked) {
        const tag_id = event.target.value;
        this.selectedTags.push(tag_id);
        this.$emit("update-s-tags-ids", this.selectedTags);
        $(".upload-media #mediaTag .box-2 .btn-group .next-btn").prop(
          "disabled",
          false
        );
      } else {
        const tag_id = event.target.value;
        let tagIndex = this.selectedTags.indexOf(tag_id);
        this.selectedTags.splice(tagIndex, 1);
        this.$emit("update-s-tags-ids", this.selectedTags);
        if (this.selectedTags.length == 0) {
          $(".upload-media #mediaTag .box-2 .btn-group .next-btn").prop(
            "disabled",
            true
          );
        }
      }
    },
    async scrollLeft() {
      await axios.get("/tags" + this.prevLink).then((res) => {
        if (res.data.status.success) {
          this.tagsList = res.data.tags;
          this.prevLink = res.data.pagination.previous;
          this.nextLink = res.data.pagination.next;
        }
      });
      // document.querySelector(
      //   ".upload-media #mediaTag .box-1 .tags"
      // ).scrollLeft += -100;
    },
    async scrollRight() {
      await axios.get("/tags" + this.nextLink).then((res) => {
        if (res.data.status.success) {
          this.tagsList = res.data.tags;
          this.prevLink = res.data.pagination.previous;
          this.nextLink = res.data.pagination.next;
        }
      });
      // document.querySelector(
      //   ".upload-media #mediaTag .box-1 .tags"
      // ).scrollLeft += 100;
    },
  },
  async mounted() {
    await axios.get("/tags").then((res) => {
      if (res.data.status.success) {
        this.tagsList = res.data.tags;
        this.prevLink = res.data.pagination.previous;
        this.nextLink = res.data.pagination.next;
      }
    });

    $("#mediaTag .box-2 .btn-group .next-btn").prop("disabled", false);
  },
};
</script>