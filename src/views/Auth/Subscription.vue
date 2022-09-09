<template>
  <div>
    <h2>Subscribe Now</h2>
    <p class="msg">Subscribe to enjoy all the features of TheirStory</p>
    <div class="subscription">
      <p class="price"><b>$39.95/year ,</b>will grant you:</p>

      <ul class="specifications">
        <li>Up to 25 Contributors</li>
        <li>750GB of Storage</li>
        <li>Albums & Journeys</li>
        <li>Screen & Printable Collages</li>
      </ul>

      <button @click="showAddPayment">Subscribe Now</button>

      <p class="upgrade">
        * With extra fees added to the yearly subscription, you can upgrade to
        extra contributors and storage
      </p>
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
          <input type="text" id="holderName" v-model="s_card_holder" />
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
        <div class="agree-save-payment-info">
          <label>
            <input type="checkbox" value="1" v-model="b_save" /><span
              class="checkmark"
            ></span
            >&emsp;&ensp; Save Credit Card
          </label>
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
import $ from "jquery";
import axios from "axios";

export default {
  name: "Subscription",
  data() {
    return {
      s_card_holder: "",
      b_save: false,
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
    async showAddPayment() {
      await axios.get("/payments/setup-intent").then(
        (response) => {
          this.clientSecret = response.data.client_secret;
          $(".auth-container #addPaymentInfo").css("display", "flex");
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
      $(".auth-container #addPaymentInfo").css("display", "none");
    },
    async purchase() {
      this.errors = [];
      if (this.s_card_holder == "") {
        this.errors.push("Name holder is required");
      } else {
        $(".auth-container #addPaymentInfo .model-box #loadingBtn").prop(
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
                  );
                  formData.set("b_save", this.b_save);
                  axios.post("/subscribe", formData).then(
                    (res) => {
                      if (res.data.status.success) {
                        $(
                          ".auth-container #addPaymentInfo .model-box #loadingBtn"
                        ).prop("disabled", false);
                        this.$router.push("/SubscriptionSuccessful");
                        this.cancelAddPayment();
                      } else {
                        $(
                          ".auth-container #addPaymentInfo .model-box #loadingBtn"
                        ).prop("disabled", false);
                        this.errors.push(res.data.status.message);
                      }
                    },
                    (error) => {
                      $(
                        ".auth-container #addPaymentInfo .model-box #loadingBtn"
                      ).prop("disabled", false);
                      this.$toast.error(error.response.data.message);
                    }
                  );
                } else {
                  $(
                    ".auth-container #addPaymentInfo .model-box #loadingBtn"
                  ).prop("disabled", false);
                  this.errors.push("Not Accepted This Type Of Card");
                }
              } else if (
                result.error &&
                result.error.type == "validation_error"
              ) {
                $(
                  ".auth-container #addPaymentInfo .model-box #loadingBtn"
                ).prop("disabled", false);
                this.errors.push(result.error.message);
              } else {
                $(
                  ".auth-container #addPaymentInfo .model-box #loadingBtn"
                ).prop("disabled", false);
                this.errors.push(
                  "We are facing some issues proceeding with your request, please try again later."
                );
              }
            },
            (error) => {
              $(".settings #addPaymentInfo .model-box #loadingBtn").prop(
                "disabled",
                false
              );

              this.$toast.error(error.response.data.message);
            }
          );
      }
    },
  },
  async mounted() {
    document.querySelector(".auth-container .auth-form").style.backgroundImage =
      "url('../../assets/images/auth/auth-form.svg')";
    document.querySelector(
      ".auth-container .auth-form"
    ).style.backgroundRepeat = "no-repeat";
    document.querySelector(".auth-container .auth-form").style.backgroundSize =
      "unset";
    document.querySelector(
      ".auth-container .auth-form"
    ).style.backgroundPosition = "bottom -58px left -70px";

    await axios.get("/auth_user").then(
      (res) => {
        if (res.data.status.success) {
          if (res.data.users[0].e_type != "GATEKEEPER") {
            this.$router.push("/");
          } else if (res.data.users[0].is_subscribe) {
            this.$router.push("/");
          }
        } else {
          localStorage.removeItem("auth_user_token");
          this.$toast.error("Something went wrong, please try again.");
          this.$router.push("/login");
        }
      },
      (error) => {
        // if (error.response.status == 401) {
        //   this.$router.push("/Login");
        // } else {
        this.$toast.error(error.response.data.message);
        // }
      }
    );

    this.stripe = window.Stripe(
      "pk_test_51JYnSXFb6MYHvly5a9zs4VGhOrPL4A6q0ncvg8w7zejnJi9ueAbq5GBeIJ1IirA0lTJAh5bAWdeddMPSx7SpqUHl003WPVQ4wf"
    );

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
.auth-container .auth-form {
  background-image: url("../../assets/images/auth/auth-form.svg");
  background-repeat: no-repeat;
  background-size: unset;
  background-position: bottom -58px left -70px;
}
@import url("../../assets/css/subscription.css");
</style>

