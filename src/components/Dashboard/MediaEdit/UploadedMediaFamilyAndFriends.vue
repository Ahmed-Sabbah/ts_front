<template>
  <div class="step-box next-step" id="familyAndFriends">
    <div class="box-1">
      <h3 class="box-1-title">Family & Friends</h3>
      <p class="box-1-description">Description paragraph</p>

      <div class="tags">
        <div
          class="input-group"
          v-for="member in membersList"
          :key="member.pk_i_id"
        >
          <label
            ><input
              type="checkbox"
              :value="member.pk_i_id"
              :checked="Object.values(selectedMembers).includes(member.pk_i_id)"
              @change="selectedMembersFilter($event)"
            /><span class="checkmark"></span>
            <p>{{ member.s_name }}</p></label
          >
        </div>
        <div class="new-tag" @click="showAddTagForm">
          <span>+ Add Member</span>
        </div>
        <div class="new-member-form">
          <input type="text" id="newMemberName" />
          <div class="btn-group">
            <button class="danger" @click="discardAddMember">Discard</button>
            <button class="default" id="addNewMember" @click="newMemberSubmit">
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
        <button class="back-btn" @click="showTagStep">Back</button>
        <button class="next-btn" disabled @click="showTimeStep">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import axios from "axios";

export default {
  name: "UploadedMediaFamilyAndFriends",
  props: [
    "props_e_type",
    "props_s_extension",
    "props_d_size",
    "props_dt_uploaded_by",
    "props_dt_uploaded_at",
    "props_s_friends_ids",
  ],
  data() {
    return {
      selectedMembers: this.props_s_friends_ids,
      membersList: [],
      prevLink: "",
      nextLink: "",
    };
  },
  methods: {
    showTagStep() {
      $("#familyAndFriends").css("display", "none");
      $("#mediaTag").css("display", "flex");
      $("#showTag").removeClass("done");
      $("#showFriends").removeClass("active");
    },
    showTimeStep() {
      $("#familyAndFriends").css("display", "none");
      $("#mediaTime").css("display", "flex");
      $("#showFriends").addClass("done");
      $("#showTime").addClass("active");
    },
    showAddTagForm() {
      $("#familyAndFriends .box-1 .tags .new-tag").css("display", "none");
      $("#familyAndFriends .box-1 .tags .new-member-form").css(
        "display",
        "flex"
      );
    },
    discardAddMember() {
      $("#familyAndFriends .box-1 .tags .new-member-form").css(
        "display",
        "none"
      );
      $("#familyAndFriends .box-1 .tags .new-tag").css(
        "display",
        "inline-block"
      );
    },
    newMemberSubmit() {
      const newMember = $(".new-member-form #newMemberName").val();
      if (newMember != "") {
        axios
          .post("/tags_members/add", { s_name: newMember, e_type: "MEMBER" })
          .then((res) => {
            if (res.data.status.success) {
              axios.get("/members").then((result) => {
                if (result.data.status.success) {
                  this.membersList = result.data.members;
                  this.prevLink = result.data.pagination.previous;
                  this.nextLink = result.data.pagination.next;
                }
              });
              // this.membersList.unshift(res.data.tags[0]);
              $(".new-member-form #newMemberName").val("");
              this.discardAddMember();
            } else {
              this.$toast.error(res.data.status.message);
            }
          });
      }
    },
    selectedMembersFilter(event) {
      if (event.target.checked) {
        const member_id = event.target.value;
        this.selectedMembers.push(member_id);
        this.$emit("update-s-friends-ids", this.selectedMembers);
        $(".upload-media #familyAndFriends .box-2 .btn-group .next-btn").prop(
          "disabled",
          false
        );
      } else {
        const member_id = event.target.value;
        let memberIndex = this.selectedMembers.indexOf(member_id);
        this.selectedMembers.splice(memberIndex, 1);
        this.$emit("update-s-friends-ids", this.selectedMembers);
        if (this.selectedMembers.length == 0) {
          $(".upload-media #familyAndFriends .box-2 .btn-group .next-btn").prop(
            "disabled",
            true
          );
        }
      }
    },
    async scrollLeft() {
      await axios.get("/members" + this.prevLink).then((res) => {
        if (res.data.status.success) {
          this.membersList = res.data.members;
          this.prevLink = res.data.pagination.previous;
          this.nextLink = res.data.pagination.next;
        }
      });
    },
    async scrollRight() {
      await axios.get("/members" + this.nextLink).then((res) => {
        if (res.data.status.success) {
          this.membersList = res.data.members;
          this.prevLink = res.data.pagination.previous;
          this.nextLink = res.data.pagination.next;
        }
      });
    },
  },
  async mounted() {
    await axios.get("/members").then((res) => {
      if (res.data.status.success) {
        this.membersList = res.data.members;
        this.prevLink = res.data.pagination.previous;
        this.nextLink = res.data.pagination.next;
      }
    });

    $("#familyAndFriends .box-2 .btn-group .next-btn").prop("disabled", false);
  },
};
</script>
