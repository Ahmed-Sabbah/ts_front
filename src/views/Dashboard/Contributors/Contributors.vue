<template>
  <div class="contributors-gk-view">
    <div class="btn-group">
      <button
        class="btn"
        @click="showAddContributorModel"
        v-if="auth_user.e_type == 'GATEKEEPER'"
      >
        Add Contributor
      </button>
      <button
        class="btn"
        @click="showAddContributorByContributorModel"
        v-if="auth_user.b_invite && auth_user.e_type != 'GATEKEEPER'"
      >
        Add Contributor
      </button>
    </div>
    <div class="tabel">
      <table>
        <thead>
          <tr>
            <th>
              Full name
              <img
                src="../../../assets/images/dashboard/contributors/thead-sort.svg"
                alt="thead-sort"
              />
            </th>
            <th>
              Invited in
              <img
                src="../../../assets/images/dashboard/contributors/thead-sort.svg"
                alt="thead-sort"
              />
            </th>
            <th>
              Accepted in
              <img
                src="../../../assets/images/dashboard/contributors/thead-sort.svg"
                alt="thead-sort"
              />
            </th>
            <th>
              Status
              <img
                src="../../../assets/images/dashboard/contributors/thead-sort.svg"
                alt="thead-sort"
              />
            </th>
            <th>
              Uploads
              <img
                src="../../../assets/images/dashboard/contributors/thead-sort.svg"
                alt="thead-sort"
              />
            </th>
            <th>
              Comments
              <img
                src="../../../assets/images/dashboard/contributors/thead-sort.svg"
                alt="thead-sort"
              />
            </th>
            <th>
              Recent upload
              <img
                src="../../../assets/images/dashboard/contributors/thead-sort.svg"
                alt="thead-sort"
              />
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in contributorsList" :key="item.pk_i_id">
            <td style="width: fit-content">
              <img
                :src="item.s_image"
                alt="contributors-image"
                v-if="item.s_image"
              />
              <img
                src="../../../assets/images/dashboard/contributors/selected-media.png"
                alt="contributors-image"
                v-else
              />
              <router-link
                :to="'/ViewContributor/' + item.i_invitation_id"
                v-if="item.e_status != 'PENDING'"
              >
                {{ item.s_fullname }}
              </router-link>
              <a href="javascript:void(0)" v-else>{{ item.s_fullname }}</a>
            </td>
            <td>{{ timestampToDate(item.dt_invitation_date) }}</td>
            <td>{{ timestampToDate(item.dt_accepted_date) }}</td>
            <td>{{ item.e_status }}</td>
            <td>{{ item.i_uploads_count > 0 ? item.i_uploads_count : "_" }}</td>
            <td>
              {{ item.i_comments_count > 0 ? item.i_comments_count : "_" }}
            </td>
            <td>
              {{
                item.dt_recent_upload_date
                  ? timestampToDate(item.dt_recent_upload_date)
                  : "_"
              }}
            </td>
            <td>
              <a
                href="javascript:void(0)"
                @click="showEditContributorModel(item.i_invitation_id)"
                v-if="item.e_user_type == 'GATEKEEPER'"
                >Edit</a
              >
              <a
                href="javascript:void(0)"
                @click="
                  showDeactivateContributorModel(item.i_invitation_id, false)
                "
                v-if="
                  (item.e_user_type == 'GATEKEEPER' ||
                    (item.b_enabled && item.b_deactivate)) &&
                  item.e_status != 'INACTIVE'
                "
                >Deactivate</a
              >
              <a
                href="javascript:void(0)"
                @click="
                  showDeactivateContributorModel(item.i_invitation_id, true)
                "
                v-else-if="
                  (item.e_user_type == 'GATEKEEPER' ||
                    (!item.b_enabled && item.b_deactivate)) &&
                  item.e_status == 'INACTIVE'
                "
                >Activate</a
              >
              <span v-else>_</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="paginat" v-if="contributorsList.length > 0">
      <p>
        Showing {{ paginationFrom }} to {{ paginationTo }} of
        {{ totalObjects }} contributors
      </p>
      <paginate
        :initialPage="pageInatial"
        :page-count="totalPages"
        :page-range="itemsPerPage"
        :margin-pages="1"
        :click-handler="clickCallback"
        :prev-text="'Prev'"
        :next-text="'Next'"
        :container-class="'pagination'"
        :page-class="'page-item'"
      >
      </paginate>
    </div>

    <div class="model-container" id="addContributorModel">
      <div class="model-box">
        <h3 class="model-title">Add Contributor</h3>
        <div v-if="errors.length">
          <b style="color: brown">Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
        </div>
        <div class="input-group">
          <label>Contributor Full Name</label>
          <input type="text" v-model="s_fullname" />
        </div>
        <div class="input-group">
          <label>Contributor Email address</label>
          <input type="email" name="email" v-model="s_email" />
        </div>
        <div class="input-group">
          <label>Message to the contributor</label>
          <textarea v-model="s_message"></textarea>
        </div>
        <div class="contributor-permissions">
          <p>Permissions</p>
          <div class="select-permissions">
            <label>
              <input
                type="checkbox"
                name="b_invite"
                value="true"
                v-model="b_invite"
              /><span class="checkmark"></span>&emsp;&ensp; Invite others
            </label>
            <label>
              <input
                type="checkbox"
                name="b_deactivate"
                value="true"
                v-model="b_deactivate"
              /><span class="checkmark"></span>&emsp;&ensp; Deactivate others
            </label>
          </div>
        </div>
        <div class="btn-group">
          <button class="btn-sm-light" @click="hideAddContributorModel">
            Cancel
          </button>
          <button class="btn-sm-dark" id="loadingBtn" @click="sendInvitation">
            Send Invitation
            <img src="../../../assets/images/loading.gif" alt="loading" />
          </button>
        </div>
      </div>
    </div>
    <div class="model-container" id="addContributorByContributorModel">
      <div class="model-box">
        <h3 class="model-title">Add Contributor</h3>
        <div v-if="errors.length">
          <b style="color: brown">Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
        </div>
        <div class="input-group">
          <label>Contributor Full Name</label>
          <input type="text" v-model="s_fullname" />
        </div>
        <div class="input-group">
          <label>Contributor Email address</label>
          <input type="email" name="email" v-model="s_email" />
        </div>
        <div class="input-group">
          <label>Message to the contributor</label>
          <textarea v-model="s_message"></textarea>
        </div>
        <div class="btn-group">
          <button
            class="btn-sm-light"
            @click="hideAddContributorByContributorModel"
          >
            Cancel
          </button>
          <button
            class="btn-sm-dark"
            id="loadingBtn1"
            @click="sendInvitationByContributor"
          >
            Send Invitation
            <img src="../../../assets/images/loading.gif" alt="loading" />
          </button>
        </div>
      </div>
    </div>
    <div class="model-container" id="editContributorModel">
      <div class="model-box">
        <h3 class="model-title">Edit Contributor</h3>
        <div v-if="errors.length">
          <b style="color: brown">Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
        </div>
        <div class="contributor-permissions">
          <p>Permissions</p>
          <div class="select-permissions">
            <label>
              <input
                type="checkbox"
                name="b_invite"
                value="true"
                :checked="contributor_permistion_invite == 1"
                v-model="contributor_permistion_invite"
              /><span class="checkmark"></span>&emsp;&ensp; Invite others
            </label>
            <label>
              <input
                type="checkbox"
                name="b_deactivate"
                value="true"
                :checked="contributor_permistion_deactivate == 1"
                v-model="contributor_permistion_deactivate"
              /><span class="checkmark"></span>&emsp;&ensp; Deactivate others
            </label>
          </div>
        </div>
        <div class="btn-group">
          <button class="btn-sm-light" @click="hideEditContributorModel">
            Cancel
          </button>
          <button
            class="btn-sm-dark"
            @click="sendEditContributorRequest(contributorId)"
          >
            Send Changes
          </button>
        </div>
      </div>
    </div>
    <div class="model-container" id="addContributorSuccessModel">
      <div class="model-box">
        <img
          src="../../../assets/images/dashboard/model-box/model-box-success.svg"
          alt="success"
        />
        <h3 class="model-title">Success</h3>
        <p>
          Your invitation has been <br />
          successfully sent to: {{ s_fullname }}
        </p>
        <button class="btn-sm-dark" @click="hideAddContributorSuccessModel">
          Close
        </button>
      </div>
    </div>
    <div class="model-container" id="editContributorSuccessModel">
      <div class="model-box">
        <img
          src="../../../assets/images/dashboard/model-box/model-box-success.svg"
          alt="success"
        />
        <h3 class="model-title">Success</h3>
        <p>Edits are done successfully</p>
        <button class="btn-sm-dark" @click="hideEditContributorSuccessModel">
          Close
        </button>
      </div>
    </div>
    <div class="model-container" id="deactivateContributorModel">
      <div class="model-box">
        <h3 class="model-title">{{ contributorStatus }} Contributor</h3>
        <div v-if="errors.length">
          <b style="color: brown">Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
        </div>
        <p>
          Are you sure you want to deactivate this <br />
          contributor ?
        </p>
        <div class="btn-group">
          <button class="btn-sm-light" @click="cancelDeactivateContributor">
            Cancel
          </button>
          <button
            class="btn-sm-dark"
            @click="confirmDeactivateContributor(deactivateId)"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
    <div class="model-container" id="noMoreContributor">
      <div class="model-box">
        <h3 class="model-title">Error</h3>
        <p>You have reached the maximum number of invited contributors</p>
        <button class="btn-sm-dark" @click="hideNoMoreContributorModel">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import axios from "axios";
import Paginate from "vuejs-paginate-next";

export default {
  name: "GKView",
  components: {
    paginate: Paginate,
  },
  data() {
    return {
      pageInatial: 1,
      totalObjects: "",
      itemsOnPage: "",
      itemsPerPage: "",
      totalPages: "",
      currentPage: "",
      paginationFrom: "",
      paginationTo: "",
      auth_user: [],
      contributorsList: [],
      contributorId: "",
      deactivateId: "",
      s_fullname: "",
      s_email: "",
      s_message: "",
      b_deactivate: false,
      b_invite: false,
      b_active: "",
      contributorStatus: "",
      contributor_permistion_invite: "",
      contributor_permistion_deactivate: "",
      errors: [],
    };
  },
  methods: {
    timestampToDate(val) {
      if (val == "" || !val) {
        return "--";
      } else {
        var date = new Date(val.replace(/-/g, "/"));
        return (
          date.toLocaleString("default", { month: "short" }) +
          " " +
          date.getDate() +
          "," +
          " " +
          date.getFullYear()
        );
      }
    },
    async clickCallback(pageNum) {
      await axios.get("/contributors?i_page_number=" + pageNum).then((res) => {
        if (res.data.status.success) {
          this.contributorsList = res.data.contributors;
          this.totalObjects = res.data.pagination.i_total_objects;
          this.itemsOnPage = res.data.pagination.i_items_on_page;
          this.itemsPerPage = res.data.pagination.i_per_pages;
          this.currentPage = res.data.pagination.i_current_page;
          this.totalPages = res.data.pagination.i_total_pages;
          this.paginationFrom = res.data.pagination.from;
          this.paginationTo = res.data.pagination.to;
        }
      });
    },
    // Add Contributor
    showAddContributorModel() {
      this.s_fullname = "";
      this.s_email = "";
      this.s_message = "";
      this.b_deactivate = false;
      this.b_invite = false;
      this.errors = [];
      $(".contributors-gk-view .model-container#addContributorModel").css(
        "display",
        "flex"
      );
    },
    hideAddContributorModel() {
      // this.s_fullname = "";
      this.s_email = "";
      this.s_message = "";
      this.b_deactivate = false;
      this.b_invite = false;
      this.errors = [];
      $(".contributors-gk-view .model-container#addContributorModel").hide();
    },
    showAddContributorByContributorModel() {
      this.s_fullname = "";
      this.s_email = "";
      this.s_message = "";
      this.b_deactivate = false;
      this.b_invite = false;
      this.errors = [];
      $(
        ".contributors-gk-view .model-container#addContributorByContributorModel"
      ).css("display", "flex");
    },
    hideAddContributorByContributorModel() {
      // this.s_fullname = "";
      this.s_email = "";
      this.s_message = "";
      this.b_deactivate = false;
      this.b_invite = false;
      this.errors = [];
      $(
        ".contributors-gk-view .model-container#addContributorByContributorModel"
      ).hide();
    },
    // Edit Contributor
    async showEditContributorModel(contributorID) {
      this.errors = [];
      this.contributorId = contributorID;
      await axios.get("/contributors?id=" + contributorID).then((res) => {
        if (res.data.status.success) {
          this.contributor_permistion_invite =
            res.data.contributors[0].b_invite;
          this.contributor_permistion_deactivate =
            res.data.contributors[0].b_deactivate;
        } else {
          this.$toast.error(res.data.status.message);
        }
      });
      $(".contributors-gk-view .model-container#editContributorModel").css(
        "display",
        "flex"
      );
    },
    hideEditContributorModel() {
      $(".contributors-gk-view .model-container#editContributorModel").hide();
    },
    async sendEditContributorRequest(contributorID) {
      const editData = {
        b_deactivate: this.contributor_permistion_deactivate,
        b_invite: this.contributor_permistion_invite,
        fk_i_contributor_id: contributorID,
      };
      await axios
        .post("/contributors/edit", editData)
        .then((response) => {
          if (response.data.status.success) {
            this.hideEditContributorModel();
            this.showEditContributorSuccessModel();
          } else {
            this.errors.push(response.data.status.message);
          }
        })
        .catch((error) => {
          if (error) {
            this.errors.push("Server Error!");
          }
        });
    },
    // Deactive Contributor
    showDeactivateContributorModel(contributorID, status) {
      this.errors = [];
      this.deactivateId = contributorID;
      this.b_active = status;
      if (status) {
        this.contributorStatus = "Activate";
      } else {
        this.contributorStatus = "Deactivate";
      }
      $(
        ".contributors-gk-view .model-container#deactivateContributorModel"
      ).css("display", "flex");
    },
    cancelDeactivateContributor() {
      this.errors = [];
      this.deactivateId = "";
      this.b_active = "";
      $(
        ".contributors-gk-view .model-container#deactivateContributorModel"
      ).hide();
    },
    confirmDeactivateContributor(contributorID) {
      this.errors = [];

      axios
        .post("/contributors/edit", {
          fk_i_contributor_id: contributorID,
          b_active: this.b_active,
        })
        .then((res) => {
          if (res.data.status.success) {
            this.cancelDeactivateContributor();
            axios
              .get("/contributors?i_page_number=" + this.pageInatial)
              .then((response) => {
                if (response.data.status.success) {
                  this.contributorsList = res.data.contributors;
                  this.totalObjects = res.data.pagination.i_total_objects;
                  this.itemsOnPage = res.data.pagination.i_items_on_page;
                  this.itemsPerPage = res.data.pagination.i_per_pages;
                  this.currentPage = res.data.pagination.i_current_page;
                  this.totalPages = res.data.pagination.i_total_pages;
                  this.paginationFrom = res.data.pagination.from;
                  this.paginationTo = res.data.pagination.to;
                } else {
                  this.$toast.error(response.data.status.message);
                }
              });
          } else {
            this.errors.push(res.data.status.message);
          }
        });
    },
    // Send Invitation
    async sendInvitation() {
      this.errors = [];

      if (this.s_fullname == "") {
        this.errors.push("Full name required.");
      } else if (this.s_email == "") {
        this.errors.push("Email required.");
      } else {
        const invitation = {
          s_fullname: this.s_fullname,
          s_email: this.s_email,
          s_message: this.s_message,
          b_deactivate: this.b_deactivate,
          b_invite: this.b_invite,
        };
        $(
          ".contributors-gk-view .model-container#addContributorModel #loadingBtn"
        ).prop("disabled", true);
        await axios
          .post("/contributors/add", invitation)
          .then((response) => {
            if (response.data.status.success) {
              axios
                .get("/contributors?i_page_number=" + this.pageInatial)
                .then((res) => {
                  if (res.data.status.success) {
                    this.contributorsList = res.data.contributors;
                    this.totalObjects = res.data.pagination.i_total_objects;
                    this.itemsOnPage = res.data.pagination.i_items_on_page;
                    this.itemsPerPage = res.data.pagination.i_per_pages;
                    this.currentPage = res.data.pagination.i_current_page;
                    this.totalPages = res.data.pagination.i_total_pages;
                    this.paginationFrom = res.data.pagination.from;
                    this.paginationTo = res.data.pagination.to;
                  }
                });
              $(
                ".contributors-gk-view .model-container#addContributorModel #loadingBtn"
              ).prop("disabled", false);
              this.hideAddContributorModel();
              this.showAddContributorSuccessModel();
            } else {
              $(
                ".contributors-gk-view .model-container#addContributorModel #loadingBtn"
              ).prop("disabled", false);
              if (response.data.status.message == "no_more") {
                $(
                  ".contributors-gk-view .model-container#noMoreContributor"
                ).css("display", "felx");
              } else {
                this.errors.push(response.data.status.message);
              }
            }
          })
          .catch((error) => {
            if (error) {
              $(
                ".contributors-gk-view .model-container#addContributorModel #loadingBtn"
              ).prop("disabled", false);
              this.errors.push("Server Error!");
            }
          });
      }
    },
    async sendInvitationByContributor() {
      this.errors = [];

      if (this.s_fullname == "") {
        this.errors.push("Full name required.");
      } else if (this.s_email == "") {
        this.errors.push("Email required.");
      } else {
        const invitation = {
          s_fullname: this.s_fullname,
          s_email: this.s_email,
          s_message: this.s_message,
        };

        $(
          ".contributors-gk-view .model-container#addContributorByContributorModel #loadingBtn1"
        ).prop("disabled", true);

        await axios
          .post("/contributors/add", invitation)
          .then((response) => {
            if (response.data.status.success) {
              axios
                .get("/contributors?i_page_number=" + this.pageInatial)
                .then((res) => {
                  if (res.data.status.success) {
                    this.contributorsList = res.data.contributors;
                    this.totalObjects = res.data.pagination.i_total_objects;
                    this.itemsOnPage = res.data.pagination.i_items_on_page;
                    this.itemsPerPage = res.data.pagination.i_per_pages;
                    this.currentPage = res.data.pagination.i_current_page;
                    this.totalPages = res.data.pagination.i_total_pages;
                    this.paginationFrom = res.data.pagination.from;
                    this.paginationTo = res.data.pagination.to;
                  }
                });
              $(
                ".contributors-gk-view .model-container#addContributorByContributorModel #loadingBtn1"
              ).prop("disabled", false);
              this.hideAddContributorByContributorModel();
              this.showAddContributorSuccessModel();
            } else {
              $(
                ".contributors-gk-view .model-container#addContributorByContributorModel #loadingBtn1"
              ).prop("disabled", false);
              if (response.data.status.message == "no_more") {
                $(
                  ".contributors-gk-view .model-container#noMoreContributor"
                ).css("display", "felx");
              } else {
                this.errors.push(response.data.status.message);
              }
            }
          })
          .catch((error) => {
            if (error) {
              $(
                ".contributors-gk-view .model-container#addContributorByContributorModel #loadingBtn1"
              ).prop("disabled", false);
              this.errors.push("Server Error!");
            }
          });
      }
    },
    showAddContributorSuccessModel() {
      $(
        ".contributors-gk-view .model-container#addContributorSuccessModel"
      ).css("display", "flex");
    },
    hideAddContributorSuccessModel() {
      this.s_fullname = "";
      $(
        ".contributors-gk-view .model-container#addContributorSuccessModel"
      ).hide();
    },
    hideNoMoreContributorModel() {
      $(".contributors-gk-view .model-container#noMoreContributor").hide();
    },
    showEditContributorSuccessModel() {
      $(
        ".contributors-gk-view .model-container#editContributorSuccessModel"
      ).css("display", "flex");
    },
    hideEditContributorSuccessModel() {
      $(
        ".contributors-gk-view .model-container#editContributorSuccessModel"
      ).css("display", "none");
    },
  },
  async mounted() {
    $("body").css("background-image", "none");
    $(".dashboard-container .content").css("padding", "32px 25px 0 25px");

    await axios.get("/contributors").then((res) => {
      if (res.data.status.success) {
        this.contributorsList = res.data.contributors;
        this.totalObjects = res.data.pagination.i_total_objects;
        this.itemsOnPage = res.data.pagination.i_items_on_page;
        this.itemsPerPage = res.data.pagination.i_per_pages;
        this.currentPage = res.data.pagination.i_current_page;
        this.totalPages = res.data.pagination.i_total_pages;
        this.paginationFrom = res.data.pagination.from;
        this.paginationTo = res.data.pagination.to;
      }
    });

    await axios.get("/auth_user").then((res) => {
      if (res.data.status.success) {
        // this.e_type = res.data.users[0].e_type;
        this.auth_user = res.data.users[0];
      } else {
        this.$router.push("/Login");
      }
    });
  },
};
</script>

<style scoped>
@import url("../../../assets/css/contributor.css");
</style>
