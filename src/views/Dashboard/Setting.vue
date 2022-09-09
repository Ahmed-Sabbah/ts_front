<template>
  <div class="settings">
    <div class="plan">
      <p class="title">Plan</p>
      <div class="flex-row">
        <div class="subscription">
          <div class="price">
            <h3>Subscription</h3>
            <p v-if="authUser.b_trial">Free Trial</p>
            <p v-else>${{ totalPrice }}/<span>year</span></p>
            <!-- $39.95 -->
          </div>
          <div class="total">
            <div>
              <p>
                {{ settings.i_used_contributors }} of
                {{ settings.i_available_contributors }} contributors
              </p>
              <div class="range">
                <span :style="{ width: width1 + '%' }"></span>
              </div>
            </div>
            <div>
              <p>
                {{ settings.i_used_space }} of {{ settings.i_total_space }}GB
                storage
              </p>
              <div class="range">
                <span :style="{ width: width2 + '%' }"></span>
              </div>
            </div>
          </div>
          <p
            class="next-invoice-date"
            v-if="settings.dt_next_invoice_date != null"
          >
            Next Invoice on
            <span>{{
              authUser.b_trial
                ? timestampToDate(authUser.trial_ends_at)
                : timestampToDate(settings.dt_next_invoice_date)
            }}</span>
          </p>
        </div>
        <div class="upgrade">
          <h3>Upgrade</h3>
          <p>
            Upgrade for additional storage<br />
            and more contributors
          </p>
          <button @click="showUpgradePlanModel">Upgrade</button>
        </div>
      </div>
    </div>

    <div class="auto-renew">
      <div class="flex-row">
        <p class="title">Enable auto renew</p>
        <label class="switch">
          <input
            type="checkbox"
            v-model="autoRenew"
            :checked="autoRenew"
            @change="updateAutoRenew"
          />
          <span class="slider round"></span>
        </label>
      </div>
      <p class="auto-renew-msg">
        This option; if checked will renew your subscription if the current plan
        expires
      </p>
    </div>

    <div class="payment-method">
      <p class="title">Payment Method</p>
      <div
        :class="item.is_default ? 'card selected' : 'card'"
        v-for="item in cardsList"
        :key="item.pk_i_id"
      >
        <div class="card-name">
          <p>{{ item.s_card_holder }}</p>
          <span>{{ item.s_expire_date }}</span>
        </div>
        <div class="card-number">
          <div class="tools">
            <div class="head">
              <div class="img">
                <img
                  src="../../assets/images/dashboard/home-icons/visa.svg"
                  alt="master-card"
                  v-if="item.s_card_type != 'Visa'"
                />
                <img
                  src="../../assets/images/dashboard/home-icons/visa.svg"
                  alt="master-card"
                  v-else
                />
                <p><span>**** **** ****</span> {{ item.s_card_number }}</p>
              </div>
              <img
                src="../../assets/images/dashboard/home-icons/overflow-menu-vertical.svg"
                alt="menu-vertical"
                @click="toggleDropdown(item.pk_i_id)"
              />
            </div>
            <div class="dropdown" :id="'dropdown' + item.pk_i_id">
              <button @click="selectCard(item.pk_i_id)" v-if="!item.is_default">
                Select as default
              </button>
              <button @click="editCard(item.pk_i_id)">Edit</button>
              <button @click="removeCard(item.pk_i_id)" v-if="!item.is_default">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="add-card" @click="showAddPayment">
        <img
          src="../../assets/images/dashboard/home-icons/add-payment.svg"
          alt="add"
        />
      </div>
    </div>

    <div class="payment-history">
      <p class="title">Payment History</p>
      <table>
        <thead>
          <tr>
            <th>
              Date
              <img
                src="../../assets/images/dashboard/contributors/thead-sort.svg"
                alt="thead-sort"
              />
            </th>
            <th>Details</th>
            <th>
              Amount
              <img
                src="../../assets/images/dashboard/contributors/thead-sort.svg"
                alt="thead-sort"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paymentHistory" :key="item.pk_i_id">
            <td>{{ timestampToDate(item.dt_created_date) }}</td>
            <td>{{ item.s_details }}</td>
            <td>{{ item.d_amount }}$</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="model-container" id="upgradPlanModel">
      <div class="model-box">
        <h3 class="model-title">Upgrade Subscription</h3>
        <p class="model-description">
          Extra fees will be added on the subscription
        </p>
        <div v-if="errors.length">
          <b style="color: brown">Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
        </div>
        <div class="extra-plan-fees">
          <div class="select-fees">
            <label>
              <input
                type="checkbox"
                value="CONTRIBUTORS"
                v-model="upgradeContributors"
              /><span class="checkmark"></span>&emsp;&ensp; Additional
              Contributors
            </label>
            <p>Block of 25 contributors</p>
            <h4>$9.95/year</h4>
          </div>
          <div class="select-fees">
            <label>
              <input
                type="checkbox"
                value="STORAGE"
                v-model="upgradeStorage"
              /><span class="checkmark"></span>&emsp;&ensp; Additional Storage
            </label>
            <p>100 GB</p>
            <h4>$4.95/year</h4>
          </div>
        </div>
        <div class="btn-group">
          <button class="btn-sm-light" @click="cancelUpgradePlanModel">
            Cancel
          </button>
          <button class="btn-sm-dark" @click="upgrade" id="loadingBtn">
            Confirm <img src="../../assets/images/loading.gif" alt="loading" />
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
            Confirm <img src="../../assets/images/loading.gif" alt="loading" />
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
  name: "Setting",
  props: ["authUser"],
  data() {
    return {
      width1: "",
      width2: "",
      visa: true,
      settings: "",
      autoRenew: false,
      cardsList: [],
      paymentHistory: [],
      totalPrice: "",
      upgradeContributors: "",
      upgradeStorage: "",
      e_type: "",
      upgradeStatus: false,
      s_card_holder: "",
      errors: [],
      stripe: "",
      elements: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
      clientSecret: "",
    };
  },
  methods: {
    timestampToDate(val) {
      let userAgent = navigator.userAgent;
      let date = "";
      if (userAgent.match("safari")) {
        date = new Date(val.replace(/-/g, "/"));
      } else {
        date = new Date(val);
      }
      return (
        date.toLocaleString("default", { month: "short" }) +
        " " +
        date.getDate() +
        "," +
        " " +
        date.getFullYear()
      );
    },
    freeTrial(startDate) {
      let start = new Date(startDate.replace(/-/g, "/"));
      let expiryDate = new Date(start.setDate(start.getDate() + 10));
      // const diffTime = Math.abs(today - trialDate);
      // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      // const counter = 10 - parseInt(diffDays);

      // return `${counter} days`;
      return (
        expiryDate.toLocaleString("default", { month: "short" }) +
        " " +
        expiryDate.getDate() +
        "," +
        " " +
        expiryDate.getFullYear()
      );
    },
    showUpgradePlanModel() {
      this.errors = [];
      $(".settings #upgradPlanModel").css("display", "flex");
    },
    cancelUpgradePlanModel() {
      this.errors = [];
      this.upgradeStatus = false;
      this.upgradeContributors = "";
      this.upgradeStorage = "";
      $(".settings #upgradPlanModel").css("display", "none");
    },
    async upgrade() {
      let Contributors = this.upgradeContributors;
      let Storage = this.upgradeStorage;
      if (Contributors != "" && Storage != "") {
        this.e_type = "BOTH";
        this.upgradeStatus = true;
      } else if (Contributors != "" && Storage == "") {
        this.e_type = "CONTRIBUTORS";
        this.upgradeStatus = true;
      } else if (Contributors == "" && Storage != "") {
        this.e_type = "STORAGE";
        this.upgradeStatus = true;
      } else {
        this.upgradeStatus = false;
        this.errors.push("Please select one choice at least.");
      }
      if (this.upgradeStatus) {
        $(".settings #upgradPlanModel .model-box #loadingBtn").prop(
          "disabled",
          true
        );
        const upgradeData = new FormData();
        upgradeData.set("e_type", this.e_type);
        await axios.post("/upgrade", upgradeData).then(
          (res) => {
            if (res.data.status.success) {
              $(".settings #upgradPlanModel .model-box #loadingBtn").prop(
                "disabled",
                false
              );
              this.cancelUpgradePlanModel();
              this.$toast.success(res.data.status.message);
              axios.get("/payments").then((res) => {
                if (res.data.status.success) {
                  this.paymentHistory = res.data.payments;
                  let price = res.data.payments;
                  let sum = 0;
                  for (let i = 0; i < price.length; i++) {
                    const item = price[i];
                    if (item.s_details == "Yearly Subscription") {
                      sum = sum + item.d_amount;
                    }
                  }
                  this.totalPrice = sum;
                  // this.totalPrice = price.reduce(function (sum, current) {
                  //   return sum + current.d_amount;
                  // }, 0);
                }
              });
              axios.get("/settings").then((res) => {
                if (res.data.status.success) {
                  $(".settings #upgradPlanModel .model-box #loadingBtn").prop(
                    "disabled",
                    false
                  );
                  this.settings = res.data.settings[0];
                  this.autoRenew = res.data.settings[0].b_auto_renew;
                  this.width1 =
                    (res.data.settings[0].i_available_contributors /
                      res.data.settings[0].i_used_contributors) *
                    10;
                  this.width2 =
                    (res.data.settings[0].i_total_space /
                      res.data.settings[0].i_used_space) *
                    10;
                }
              });
            } else {
              $(".settings #upgradPlanModel .model-box #loadingBtn").prop(
                "disabled",
                false
              );
              this.errors.push(res.data.status.message);
            }
          },
          (error) => {
            this.$toast.error(error.response.data.message);
          }
        );
      }
    },
    async showAddPayment() {
      await axios.get("/payments/setup-intent").then(
        (response) => {
          this.clientSecret = response.data.client_secret;
          $(".settings #addPaymentInfo").css("display", "flex");
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
      $(".settings #addPaymentInfo").css("display", "none");
    },
    async updateAutoRenew() {
      let status = this.autoRenew;
      await axios.post("/settings/update", { b_auto_renew: status }).then(
        (res) => {
          if (res.data.status.success) {
            this.$toast.success(res.data.status.message);
            axios.get("/settings").then((res) => {
              if (res.data.status.success) {
                this.settings = res.data.settings[0];
                this.autoRenew = res.data.settings[0].b_auto_renew;
                this.width1 =
                  (res.data.settings[0].i_available_contributors /
                    res.data.settings[0].i_used_contributors) *
                  10;
                this.width2 =
                  (res.data.settings[0].i_total_space /
                    res.data.settings[0].i_used_space) *
                  10;
              }
            });
          } else {
            this.$toast.error(res.data.status.message);
          }
        },
        (error) => {
          this.$toast.error(error.response.data.message);
        }
      );
    },
    toggleDropdown(cardID) {
      $(".settings .payment-method .card-number #dropdown" + cardID).toggle();
    },
    async selectCard(cardID) {
      await axios.post("/settings/update", { i_default_card: cardID }).then(
        (res) => {
          if (res.data.status.success) {
            this.$toast.success(res.data.status.message);
            this.toggleDropdown(cardID);
            axios.get("/cards").then((res) => {
              if (res.data.status.success) {
                this.cardsList = res.data.cards;
              }
            });
            axios.get("/settings").then((res) => {
              if (res.data.status.success) {
                this.settings = res.data.settings[0];
                this.autoRenew = res.data.settings[0].b_auto_renew;
                this.width1 =
                  (res.data.settings[0].i_available_contributors /
                    res.data.settings[0].i_used_contributors) *
                  10;
                this.width2 =
                  (res.data.settings[0].i_total_space /
                    res.data.settings[0].i_used_space) *
                  10;
              }
            });
          } else {
            this.$toast.error(res.data.status.message);
          }
        },
        (error) => {
          this.$toast.error(error.response.data.message);
        }
      );
    },
    async removeCard(cardID) {
      await axios.post("/cards/delete", { card_id: cardID }).then(
        (res) => {
          if (res.data.status.success) {
            this.$toast.success(res.data.status.message);
            this.toggleDropdown(cardID);
            axios.get("/cards").then((res) => {
              if (res.data.status.success) {
                this.cardsList = res.data.cards;
              }
            });
          } else {
            this.$toast.error(res.data.status.message);
          }
        },
        (error) => {
          this.$toast.error(error.response.data.message);
        }
      );
    },
    async purchase() {
      this.errors = [];
      if (this.s_card_holder == "") {
        this.errors.push("Name holder is required");
      } else {
        $(".settings #addPaymentInfo .model-box #loadingBtn").prop(
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
                  const formData = new FormData();
                  formData.set("s_card_holder", this.s_card_holder);
                  formData.set(
                    "s_payment_id",
                    result.setupIntent.payment_method
                  ); //'pm_card_visa'
                  // formData.set("is_default", Number(!this.user.payment_methods.length));
                  axios.post("/cards/add_edit", formData).then(
                    (res) => {
                      if (res.data.status.success) {
                        $(
                          ".settings #addPaymentInfo .model-box #loadingBtn"
                        ).prop("disabled", false);
                        this.cancelAddPayment();
                        this.$toast.success(res.data.status.message);

                        axios.get("/cards").then((response) => {
                          if (response.data.status.success) {
                            this.cardsList = response.data.cards;
                          }
                        });

                        axios.get("/settings").then((res) => {
                          if (res.data.status.success) {
                            this.settings = res.data.settings[0];
                            this.autoRenew = res.data.settings[0].b_auto_renew;
                            this.width1 =
                              (res.data.settings[0].i_available_contributors /
                                res.data.settings[0].i_used_contributors) *
                              10;
                            this.width2 =
                              (res.data.settings[0].i_total_space /
                                res.data.settings[0].i_used_space) *
                              10;
                          }
                        });
                      } else {
                        $(
                          ".settings #addPaymentInfo .model-box #loadingBtn"
                        ).prop("disabled", false);
                        this.errors.push(res.data.status.message);
                      }
                    },
                    (error) => {
                      if (error) {
                        $(
                          ".settings #addPaymentInfo .model-box #loadingBtn"
                        ).prop("disabled", false);
                        this.errors.push(error.response.data.message);
                      }
                    }
                  );
                } else {
                  $(".settings #addPaymentInfo .model-box #loadingBtn").prop(
                    "disabled",
                    false
                  );
                  this.errors.push("Not Accepted This Type Of Card");
                }
              } else if (
                result.error &&
                result.error.type == "validation_error"
              ) {
                $(".settings #addPaymentInfo .model-box #loadingBtn").prop(
                  "disabled",
                  false
                );
                this.errors.push(result.error.message);
              } else {
                $(".settings #addPaymentInfo .model-box #loadingBtn").prop(
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
              $(".settings #addPaymentInfo .model-box #loadingBtn").prop(
                "disabled",
                false
              );
            }
          );
      }
    },
  },
  async mounted() {
    await axios.get("/auth_user").then((res) => {
      if (res.data.status.success) {
        if (res.data.users[0].e_type != "GATEKEEPER") {
          this.$router.push("/");
        }
      }
    });

    $("body").css("background-image", "none");
    $(".dashboard-container .content").css("padding", "32px 25px 0 25px");
    $(".dashboard-container .content .setting").css("padding-bottom", "80px");

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

    await axios.get("/payments").then((res) => {
      if (res.data.status.success) {
        this.paymentHistory = res.data.payments;
        let price = res.data.payments;
        let sum = 0;
        for (let i = 0; i < price.length; i++) {
          const item = price[i];
          if (item.s_details == "Yearly Subscription") {
            sum = sum + item.d_amount;
          }
        }
        this.totalPrice = sum;
        // this.totalPrice = price.reduce(function (sum, current) {
        //   return sum + current.d_amount;
        // }, 0);
      }
    });

    await axios.get("/cards").then((res) => {
      if (res.data.status.success) {
        this.cardsList = res.data.cards;
      }
    });

    await axios.get("/settings").then((res) => {
      if (res.data.status.success) {
        this.settings = res.data.settings[0];
        this.autoRenew = res.data.settings[0].b_auto_renew;
        this.width1 =
          (res.data.settings[0].i_used_contributors /
            res.data.settings[0].i_available_contributors) *
          100;
        this.width2 =
          (res.data.settings[0].i_used_space /
            res.data.settings[0].i_total_space) *
          100;
      }
    });
  },
};
</script>

<style scoped>
@import "../../assets/css/settings.css";
</style>
