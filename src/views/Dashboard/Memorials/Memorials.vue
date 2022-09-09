<template>
  <div class="memorials">
    <h2 class="title">The Family Memorials</h2>
    <div class="memorials-status">
      <span class="active" @click="showPublishedMemorials($event)"
        >Published</span
      >
      <span @click="showArchivedMemorials($event)">Archived</span>
    </div>
    <div class="items">
      <div class="item" v-for="item in memorialsList" :key="item.pk_i_id">
        <img
          class="header-image"
          :src="item.s_cover"
          alt="memorials"
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
                src="../../../assets/images/dashboard/home-icons/overflow-menu-vertical.svg"
                alt="menu-vertical"
                @click="toggleDropdown(item.pk_i_id)"
              />
            </div>
            <div class="dropdown" :id="'dropdown' + item.pk_i_id">
              <button @click="editMemorial(item.pk_i_id)" v-if="item.b_owner">
                <img
                  src="../../../assets/images/dashboard/media/edit.svg"
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
                  src="../../../assets/images/dashboard/media/external-link.svg"
                  alt="share"
                />
                Share
              </button>
              <button
                @click="showArchiveMemorialModel(item.pk_i_id)"
                v-if="item.e_status == 'PUBLISHED' && item.b_owner"
              >
                <img
                  src="../../../assets/images/dashboard/media/archive.svg"
                  alt="archive"
                />
                Archive
              </button>
              <button
                @click="unarchiveMemorial(item.pk_i_id)"
                v-if="item.e_status != 'PUBLISHED' && item.b_owner"
              >
                <img
                  src="../../../assets/images/dashboard/media/archive.svg"
                  alt="archive"
                />
                Unarchive
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        class="unlock-memorial"
        v-if="!hasMemorials && auth_user_e_type == 'GATEKEEPER'"
      >
        <img
          src="../../../assets/images/dashboard/memorial/unlock.svg"
          alt="unlock"
        />
        <h3>To unlock a new memorial</h3>
        <div class="price">
          <p>1 memorial</p>
          <span>$9.95</span>
        </div>
        <button @click="showBuyMemorial">Buy Now</button>
      </div>
      <div
        class="unlocked-memorial"
        v-if="hasMemorials && auth_user_e_type == 'GATEKEEPER'"
        @click="addNewMemorial"
      >
        <img
          src="../../../assets/images/dashboard/home-icons/add-payment.svg"
          alt="add"
        />
      </div>
    </div>
    <div class="model-container" id="sendToPrinter">
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
    </div>
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
    <div class="model-container" id="buyMemorial">
      <div class="model-box">
        <h3 class="model-title">Buy Memorial</h3>
        <p>You will have 30% discount when buying 5 memorials</p>
        <div v-if="errors.length">
          <b style="color: brown">Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
        </div>
        <div class="input-group">
          <label>The number of memorials to buy ($9.95/each)</label>
          <input type="number" min="1" v-model="memorialNumber" />
        </div>
        <div class="total">
          <span>Total</span>
          <h3>${{ totalCount.toFixed(2) }}</h3>
        </div>
        <div class="btn-group">
          <button class="btn-sm-light" @click="cancelBuyMemorial">
            Cancel
          </button>
          <button class="btn-sm-dark" @click="confirmBuyMemorial">
            Confirm
          </button>
        </div>
      </div>
    </div>
    <div class="model-container" id="addPaymentInfo">
      <div class="model-box">
        <h3 class="model-title">Payment Info</h3>
        <div v-if="errors.length">
          <b style="color: brown">Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
        </div>
        <div class="input-group">
          <label>Credit Card Number</label>
          <div class="test-input">
            <div ref="cardNumber"></div>
          </div>
        </div>
        <div class="input-group">
          <label>Credit Card Name holder</label>
          <input type="text" v-model="s_card_holder" id="holderName" />
        </div>
        <div class="input-group col-6">
          <div class="expiry-date">
            <label>Expiry Date</label>
            <div class="test-input">
              <div ref="cardExpiry"></div>
            </div>
          </div>
          <div class="cvv">
            <label>CVV</label>
            <div class="test-input">
              <div ref="cardCvc"></div>
            </div>
          </div>
        </div>
        <div class="btn-group">
          <button class="btn-sm-light" @click="cancelAddPayment">Cancel</button>
          <button class="btn-sm-dark" @click="purchase" id="loadingBtn">
            Confirm
            <img src="../../../assets/images/loading.gif" alt="loading" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import $ from "jquery";

export default {
  name: "Memorials",
  props: ["authUser"],
  data() {
    return {
      userObj: this.authUser,
      memorialsList: [],
      memorialNumber: 1,
      totalCount: 9.95,
      shareID: "",
      s_email: "",
      s_message: "",
      archivedMemorialID: "",
      errors: [],
      hasMemorials: "",
      auth_user_e_type: "",
      s_card_holder: "",
      stripe: "",
      elements: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
      clientSecret: "",
    };
  },
  watch: {
    memorialNumber: function (val) {
      this.memorialNumber = val;
      if (val < 5) {
        this.totalCount = val * 9.95;
      } else if (val >= 5) {
        let total = val * 9.95;
        let discount = total * 0.3;
        this.totalCount = total - discount;
      }
    },
    totalCount: function (val) {
      this.totalCount = val;
    },
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
    toggleDropdown(memorialID) {
      $(".memorials .items .item .tools #dropdown" + memorialID).toggle();
    },
    showBuyMemorial() {
      $(".memorials .model-container#buyMemorial").css("display", "flex");
    },
    cancelBuyMemorial() {
      this.errors = [];
      this.memorialNumber = 1;
      $(".memorials .model-container#buyMemorial").css("display", "none");
    },
    async confirmBuyMemorial() {
      await axios
        .post("/buy_memorial", { i_number: this.memorialNumber })
        .then((res) => {
          if (res.data.status.success) {
            this.cancelBuyMemorial();
            axios.get("/auth_user").then((response) => {
              this.$store.dispatch("GetUser", response.data.users[0]);
              this.userObj = response.data.users[0];
              this.$emit("update_user", this.userObj);
              this.hasMemorials = response.data.users[0].has_memorial;
              this.auth_user_e_type = response.data.users[0].e_type;
              axios.get("/memorials?e_status=PUBLISHED").then((result) => {
                if (result.data.status.success) {
                  this.memorialsList = result.data.memorials;
                }
              });
            });
          } else {
            this.errors.push(res.data.status.message);
            if (res.data.status.message == "No cards added for this user") {
              this.cancelBuyMemorial();
              this.showAddPayment();
            }
          }
        });
    },
    addNewMemorial() {
      this.$router.push({ name: "NewMemorial" });
    },
    editMemorial(memorialID) {
      this.$router.push({ name: "EditMemorial", params: { id: memorialID } });
    },
    goTo(url) {
      this.$router.push(url);
    },
    showArchiveMemorialModel(memorialID) {
      this.errors = [];
      this.archivedMemorialID = memorialID;
      $(".memorials .model-container#archiveMediaConfirm").css(
        "display",
        "flex"
      );
    },
    cancelArchiveMemorial() {
      this.errors = [];
      $(".memorials .model-container#archiveMediaConfirm").css(
        "display",
        "none"
      );
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
    unarchiveMemorial(memorialID) {
      axios
        .post("/memorials/archive", { i_memorial_id: memorialID })
        .then((res) => {
          if (res.data.status.success) {
            axios.get("/memorials?e_status=ARCHIVED").then((res) => {
              if (res.data.status.success) {
                this.memorialsList = res.data.memorials;
              }
            });
          }
        });
    },
    showPublishedMemorials(e) {
      $(".memorials .memorials-status span").removeClass("active");
      $(e.target).addClass("active");
      axios.get("/memorials?e_status=PUBLISHED").then((res) => {
        if (res.data.status.success) {
          this.memorialsList = res.data.memorials;
          $(".unlock-memorial").css("display", "flex");
          $(".unlocked-memorial").css("display", "flex");
        }
      });
    },
    showArchivedMemorials(e) {
      $(".memorials .memorials-status span").removeClass("active");
      $(e.target).addClass("active");
      axios.get("/memorials?e_status=ARCHIVED").then((res) => {
        if (res.data.status.success) {
          this.memorialsList = res.data.memorials;
          $(".unlock-memorial").css("display", "none");
          $(".unlocked-memorial").css("display", "none");
        }
      });
    },
    viewMemorial(memorialID) {
      this.$router.push("/Dashboard/ViewMemorial/" + memorialID);
    },
    async showAddPayment() {
      await axios.get("/payments/setup-intent").then(
        (response) => {
          this.clientSecret = response.data.client_secret;
          $(".memorials #addPaymentInfo").css("display", "flex");
        },
        (error) => {
          if (error) {
            this.$toast.error(
              "We are facing some issues proceeding with your request, please try again later"
            );
          }
        }
      );
    },
    cancelAddPayment() {
      this.errors = [];
      document.getElementById("holderName").value = "";
      this.s_card_holder = "";
      this.cardNumber.clear();
      this.cardExpiry.clear();
      this.cardCvc.clear();
      $(".memorials #addPaymentInfo").css("display", "none");
    },
    async purchase() {
      this.errors = [];
      if (this.s_card_holder == "") {
        this.errors.push("Name holder is required");
      } else {
        $(".memorials #addPaymentInfo .model-box #loadingBtn").prop(
          "disabled",
          true
        );
        await this.stripe
          .confirmCardSetup(this.clientSecret, {
            payment_method: {
              card: this.cardNumber,
              billing_details: {
                name: this.s_card_holder,
              },
            },
          })
          .then(
            (result) => {
              if (result.setupIntent) {
                if (result.setupIntent.payment_method_types[0] == "card") {
                  const form = new FormData();
                  form.set("s_card_holder", this.s_card_holder);
                  form.set("s_payment_id", result.paymentMethod.id); //'pm_card_visa'
                  // form.set("b_save", 1);
                  axios.post("/cards/add_edit", form).then(
                    (res) => {
                      if (res.data.status.success) {
                        $(
                          ".memorials #addPaymentInfo .model-box #loadingBtn"
                        ).prop("disabled", false);
                        this.cancelAddPayment();
                        this.confirmBuyMemorial();
                      } else {
                        $(
                          ".memorials #addPaymentInfo .model-box #loadingBtn"
                        ).prop("disabled", false);
                        this.errors.push(res.data.status.message);
                      }
                    },
                    (error) => {
                      if (error) {
                        $(
                          ".memorials #addPaymentInfo .model-box #loadingBtn"
                        ).prop("disabled", false);
                        this.errors.push("Server Error!");
                      }
                    }
                  );
                } else {
                  $(".memorials #addPaymentInfo .model-box #loadingBtn").prop(
                    "disabled",
                    false
                  );
                  this.errors.push("Not Accepted This Type Of Card");
                }
              } else if (
                result.error &&
                result.error.type == "validation_error"
              ) {
                $(".memorials #addPaymentInfo .model-box #loadingBtn").prop(
                  "disabled",
                  false
                );
                this.errors.push(result.error.message);
              } else {
                $(".memorials #addPaymentInfo .model-box #loadingBtn").prop(
                  "disabled",
                  false
                );
                this.errors.push(
                  "We are facing some issues proceeding with your request, please try again later."
                );
              }
            },
            (error) => {
              this.$toast.error(error.message);
              $(".memorials #addPaymentInfo .model-box #loadingBtn").prop(
                "disabled",
                false
              );
            }
          );
      }
    },
  },
  async mounted() {
    $("body").css("background-image", "none");
    $(".dashboard-container .content").css("padding", "32px 25px 0 25px");

    this.hasMemorials = this.userObj.has_memorial;
    this.auth_user_e_type = this.userObj.e_type;

    await axios.get("/memorials?e_status=PUBLISHED").then((res) => {
      if (res.data.status.success) {
        this.memorialsList = res.data.memorials;
      }
    });

    this.stripe = window.Stripe(
      "pk_test_51JYnSXFb6MYHvly5a9zs4VGhOrPL4A6q0ncvg8w7zejnJi9ueAbq5GBeIJ1IirA0lTJAh5bAWdeddMPSx7SpqUHl003WPVQ4wf"
    );

    //pk_live_51L4h4sJ6DAMW7ivEIXhtwzT2i7kMRxrqxTJrs0vfZHtFu4Z8n4WxrQlb1TRS41sewisPvWiO03sEllhS8RDCmbrA00XheMgS8b

    this.elements = this.stripe.elements({ locale: "en" });
    const style = {
      base: {
        width: "100%",
        color: "black",
        backgroundColor: "#FFFFFF",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "14px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
      complete: {
        //
      },
      empty: {
        //
      },
    };
    this.cardNumber = this.elements.create("cardNumber", { style });
    this.cardNumber.mount(this.$refs.cardNumber);
    this.cardExpiry = this.elements.create("cardExpiry", { style });
    this.cardExpiry.mount(this.$refs.cardExpiry);
    this.cardCvc = this.elements.create("cardCvc", { style });
    this.cardCvc.mount(this.$refs.cardCvc);
  },
};
</script>

<style scoped>
@import url("../../../assets/css/memorials.css");
</style>
