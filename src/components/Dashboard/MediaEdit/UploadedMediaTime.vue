<template>
  <div class="step-box next-step" id="mediaTime">
    <div class="box-1">
      <h3 class="box-1-title">Time</h3>
      <p class="box-1-description">Description paragraph</p>

      <div class="choose-decade">
        <div class="decade">
          <p>Choose a decade <span>*</span></p>
          <span class="item" id="choosenDecade" @click="choosenDecadeFunction">
            {{ choosenDecade }}
            <img
              src="../../../assets/images/dashboard/media/edit.svg"
              alt="edit"
          /></span>
        </div>
        <div class="items" id="decades"></div>
      </div>
      <div class="choose-year" style="display: flex">
        <div class="year">
          <p>Choose a year <span>*</span></p>
          <span
            class="item"
            style="display: flex"
            id="choosenYear"
            @click="choosenYearFunction"
          >
            {{ choosenYear }}
            <img
              src="../../../assets/images/dashboard/media/edit.svg"
              alt="edit"
          /></span>
        </div>
        <div class="items" id="years" style="display: none"></div>
      </div>
      <div class="choose-month" style="display: flex">
        <div class="month">
          <p>Choose a month <span>*</span></p>
          <span
            class="item"
            style="display: flex"
            id="choosenMonth"
            @click="choosenMonthFunction"
          >
            {{ choosenMonth }}
            <img
              src="../../../assets/images/dashboard/media/edit.svg"
              alt="edit"
          /></span>
        </div>
        <div class="items" id="months" style="display: none">
          <span @click="getMonth('Jan')">Jan</span>
          <span @click="getMonth('Feb')">Feb</span>
          <span @click="getMonth('Mar')">Mar</span>
          <span @click="getMonth('Apr')">Apr</span>
          <span @click="getMonth('May')">May</span>
          <span @click="getMonth('Jun')">Jun</span>
          <span @click="getMonth('Jul')">Jul</span>
          <span @click="getMonth('Aug')">Aug</span>
          <span @click="getMonth('Sep')">Sep</span>
          <span @click="getMonth('Oct')">Oct</span>
          <span @click="getMonth('Nov')">Nov</span>
          <span @click="getMonth('Dec')">Dec</span>
        </div>
      </div>
      <div class="choose-day" style="display: flex">
        <div class="day">
          <p>Choose a day</p>
          <span
            class="item"
            style="display: flex"
            id="choosenDay"
            @click="choosenDayFunction"
          >
            {{ choosenDay }}
            <img
              src="../../../assets/images/dashboard/media/edit.svg"
              alt="edit"
          /></span>
        </div>
        <div class="items" id="days" style="display: none">
          <span @click="getDay('1')">1</span>
          <span @click="getDay('2')">2</span>
          <span @click="getDay('3')">3</span>
          <span @click="getDay('4')">4</span>
          <span @click="getDay('5')">5</span>
          <span @click="getDay('6')">6</span>
          <span @click="getDay('7')">7</span>
          <span @click="getDay('8')">8</span>
          <span @click="getDay('9')">9</span>
          <span @click="getDay('10')">10</span>
          <span @click="getDay('11')">11</span>
          <span @click="getDay('12')">12</span>
          <span @click="getDay('13')">13</span>
          <span @click="getDay('14')">14</span>
          <span @click="getDay('15')">15</span>
          <span @click="getDay('16')">16</span>
          <span @click="getDay('17')">17</span>
          <span @click="getDay('18')">18</span>
          <span @click="getDay('19')">19</span>
          <span @click="getDay('20')">20</span>
          <span @click="getDay('21')">21</span>
          <span @click="getDay('22')">22</span>
          <span @click="getDay('23')">23</span>
          <span @click="getDay('24')">24</span>
          <span @click="getDay('25')">25</span>
          <span @click="getDay('26')">26</span>
          <span @click="getDay('27')">27</span>
          <span @click="getDay('28')">28</span>
          <span @click="getDay('29')">29</span>
          <span @click="getDay('30')">30</span>
          <span @click="getDay('31')">31</span>
        </div>
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
        <button class="back-btn" @click="showFamityAndFriendsStep">Back</button>
        <button class="next-btn" disabled @click="showMediaLocationStep">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  name: "UploadedMediaTime",
  props: [
    "props_e_type",
    "props_s_extension",
    "props_d_size",
    "props_dt_uploaded_by",
    "props_dt_uploaded_at",
    "props_i_decade",
    "props_i_year",
    "props_i_month",
    "props_i_day",
  ],
  data() {
    return {
      choosenDecade: "",
      choosenYear: "",
      choosenMonth: "",
      choosenDay: "",
      selectedDecate: this.props_i_decade,
      selectedYear: this.props_i_year,
      selectedMonth: this.props_i_month,
      selectedDay: this.props_i_day,
    };
  },
  methods: {
    showFamityAndFriendsStep() {
      $("#mediaTime").css("display", "none");
      $("#familyAndFriends").css("display", "flex");
      $("#showTime").removeClass("active");
      $("#showFriends").removeClass("done");
    },
    showMediaLocationStep() {
      $("#mediaTime").css("display", "none");
      $("#mediaLocation").css("display", "flex");
      $("#showTime").addClass("done");
      $("#showLocation").addClass("active");
    },
    choosenDecadeFunction() {
      this.choosenDecade = "";
      this.selectedDecate = "";
      this.$emit("update_i_decade", this.selectedDecate);
      this.choosenYear = "";
      this.selectedYear = "";
      this.$emit("update_i_year", this.selectedYear);
      this.choosenMonth = "";
      this.selectedMonth = "";
      this.$emit("update_i_month", this.selectedMonth);
      this.choosenDay = "";
      this.selectedDay = "";
      this.$emit("update_i_day", this.selectedDay);
      $("#mediaTime .box-1 .choose-decade #choosenDecade").hide();
      $("#mediaTime .box-1 .choose-year").hide();
      $("#mediaTime .box-1 .choose-year #choosenYear").hide();
      $("#mediaTime .box-1 .choose-month").hide();
      $("#mediaTime .box-1 .choose-month #choosenMonth").hide();
      $("#mediaTime .box-1 .choose-day").hide();
      $("#mediaTime .box-1 .choose-day #choosenDay").hide();
      $("#mediaTime .box-1 .choose-decade #decades").css("display", "flex");

      if (
        this.choosenDecade == "" ||
        this.choosenYear == "" ||
        this.choosenMonth == ""
      ) {
        $(".upload-media #mediaTime .box-2 .btn-group .next-btn").prop(
          "disabled",
          true
        );
      } else {
        $(".upload-media #mediaTime .box-2 .btn-group .next-btn").prop(
          "disabled",
          false
        );
      }
    },
    choosenYearFunction() {
      this.choosenYear = "";
      this.selectedYear = "";
      this.$emit("update_i_year", this.selectedYear);
      this.choosenMonth = "";
      this.selectedMonth = "";
      this.$emit("update_i_month", this.selectedMonth);
      this.choosenDay = "";
      this.selectedDay = "";
      this.$emit("update_i_day", this.selectedDay);
      $("#mediaTime .box-1 .choose-year").css("display", "block");
      $("#mediaTime .box-1 .choose-year #choosenYear").hide();
      $("#mediaTime .box-1 .choose-year #years").css("display", "flex");
      $("#mediaTime .box-1 .choose-year #years").children("span").remove();
      $("#mediaTime .box-1 .choose-month").hide();
      $("#mediaTime .box-1 .choose-month #choosenMonth").hide();
      $("#mediaTime .box-1 .choose-day").hide();
      $("#mediaTime .box-1 .choose-day #choosenDay").hide();
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      let decadeVal = this.choosenDecade;

      for (let j = 0; j <= 9; j++) {
        const yearElement = document.createElement("span");
        yearElement.innerText = decadeVal;
        decadeVal++;
        $(yearElement).on("click", (ev) => {
          let yearVal = parseInt(ev.target.innerText);
          this.choosenYear = yearVal;
          this.selectedYear = yearVal;
          this.$emit("update_i_year", this.selectedYear);
          if (!this.selectedDecate || this.selectedDecate == "") {
            this.selectedDecate = this.choosenDecade;
            this.$emit("update_i_decade", this.selectedDecate);
          }
          $("#mediaTime .box-1 .choose-year #years").hide();
          $("#mediaTime .box-1 .choose-year #choosenYear").css(
            "display",
            "flex"
          );
          $("#mediaTime .box-1 .choose-year #years").children("span").remove();
          $("#mediaTime .box-1 .choose-month").css("display", "block");
          $("#mediaTime .box-1 .choose-month #months").css("display", "flex");

          if (
            this.choosenDecade == "" ||
            this.choosenYear == "" ||
            this.choosenMonth == ""
          ) {
            $(".upload-media #mediaTime .box-2 .btn-group .next-btn").prop(
              "disabled",
              true
            );
          } else {
            $(".upload-media #mediaTime .box-2 .btn-group .next-btn").prop(
              "disabled",
              false
            );
          }
        });
        if (decadeVal > currentYear + 1) {
          break;
        } else {
          $(".step-box#mediaTime .choose-year .items").append(yearElement);
        }
      }
    },
    choosenMonthFunction() {
      this.choosenMonth = "";
      this.selectedMonth = "";
      this.$emit("update_i_month", this.selectedMonth);
      this.choosenDay = "";
      this.selectedDay = "";
      this.$emit("update_i_day", this.selectedDay);
      $("#mediaTime .box-1 .choose-month").css("display", "block");
      $("#mediaTime .box-1 .choose-month #choosenMonth").hide();
      // $("#mediaTime .box-1 .choose-month .month").css("display", "block");
      $("#mediaTime .box-1 .choose-month #months").css("display", "flex");
      $("#mediaTime .box-1 .choose-day").hide();
      $("#mediaTime .box-1 .choose-day #choosenDay").hide();

      if (
        this.choosenDecade == "" ||
        this.choosenYear == "" ||
        this.choosenMonth == ""
      ) {
        $(".upload-media #mediaTime .box-2 .btn-group .next-btn").prop(
          "disabled",
          true
        );
      } else {
        $(".upload-media #mediaTime .box-2 .btn-group .next-btn").prop(
          "disabled",
          false
        );
      }
    },
    getMonth(val) {
      this.choosenMonth = val;
      this.selectedMonth = val;
      this.$emit("update_i_month", this.selectedMonth);
      $("#mediaTime .box-1 .choose-month #months").hide();
      $("#mediaTime .box-1 .choose-month #choosenMonth").css("display", "flex");
      $("#mediaTime .box-1 .choose-day").css("display", "block");
      $("#mediaTime .box-1 .choose-day #days").css("display", "flex");

      if (
        this.choosenDecade == "" ||
        this.choosenYear == "" ||
        this.choosenMonth == ""
      ) {
        $(".upload-media #mediaTime .box-2 .btn-group .next-btn").prop(
          "disabled",
          true
        );
      } else {
        $(".upload-media #mediaTime .box-2 .btn-group .next-btn").prop(
          "disabled",
          false
        );
      }
    },
    choosenDayFunction() {
      this.choosenDay = "";
      this.selectedDay = "";
      this.$emit("update_i_day", this.selectedDay);
      $("#mediaTime .box-1 .choose-day #choosenDay").hide();
      $("#mediaTime .box-1 .choose-day #days").css("display", "flex");
    },
    getDay(val) {
      this.choosenDay = val;
      this.selectedDay = val;
      this.$emit("update_i_day", this.selectedDay);
      $("#mediaTime .box-1 .choose-day #days").css("display", "none");
      $("#mediaTime .box-1 .choose-day #choosenDay").css("display", "flex");
    },
  },
  mounted() {
    $("#mediaTime .box-1 .choose-year .items div span").on(
      "click",
      function () {
        $("#mediaTime .box-1 .choose-year .items div span").removeClass(
          "selected"
        );
        $(this).addClass("selected");
      }
    );

    $(".step-box#mediaTime .choose-decade .items").css("display", "none");
    $("#mediaTime .box-1 .choose-decade #choosenDecade").css("display", "flex");

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentDecade = currentYear - (currentYear % 10);
    let testArr = [];

    for (let index = 1900; index <= currentDecade; index += 10) {
      testArr.push(index);
    }

    for (let index = 0; index < testArr.length; index++) {
      let val = testArr[index];
      const element = document.createElement("span");
      element.innerText = val;
      $(element).on("click", (e) => {
        let decadeVal = parseInt(e.target.innerText);
        $("#mediaTime .box-1 .choose-decade #choosenDecade").css(
          "display",
          "flex"
        );
        $("#mediaTime .box-1 .choose-year").css("display", "block");
        $("#mediaTime .box-1 .choose-year #years").css("display", "flex");
        $("#mediaTime .box-1 .choose-year #years").children("span").remove();
        this.choosenDecade = decadeVal;
        this.selectedDecate = decadeVal;
        this.$emit("update_i_decade", this.selectedDecate);

        for (let j = 0; j <= 9; j++) {
          const yearElement = document.createElement("span");
          yearElement.innerText = decadeVal;
          decadeVal++;
          $(yearElement).on("click", (ev) => {
            let yearVal = parseInt(ev.target.innerText);
            this.choosenYear = yearVal;
            this.selectedYear = yearVal;
            this.$emit("update_i_year", this.selectedYear);
            if (!this.selectedDecate || this.selectedDecate == "") {
              this.selectedDecate = this.choosenDecade;
              this.$emit("update_i_decade", this.selectedDecate);
            }
            $("#mediaTime .box-1 .choose-year #years").hide();
            $("#mediaTime .box-1 .choose-year #choosenYear").css(
              "display",
              "flex"
            );
            $("#mediaTime .box-1 .choose-month").css("display", "block");
            $("#mediaTime .box-1 .choose-month #months").css("display", "flex");

            if (
              this.choosenDecade == "" ||
              this.choosenYear == "" ||
              this.choosenMonth == ""
            ) {
              $(".upload-media #mediaTime .box-2 .btn-group .next-btn").prop(
                "disabled",
                true
              );
            } else {
              $(".upload-media #mediaTime .box-2 .btn-group .next-btn").prop(
                "disabled",
                false
              );
            }
          });
          if (decadeVal > currentYear + 1) {
            break;
          } else {
            $(".step-box#mediaTime .choose-year .items").append(yearElement);
          }
        }

        if (
          this.choosenDecade == "" ||
          this.choosenYear == "" ||
          this.choosenMonth == ""
        ) {
          $(".upload-media #mediaTime .box-2 .btn-group .next-btn").prop(
            "disabled",
            true
          );
        } else {
          $(".upload-media #mediaTime .box-2 .btn-group .next-btn").prop(
            "disabled",
            false
          );
        }
        $(".step-box#mediaTime .choose-decade .items").css("display", "none");
      });
      $(".step-box#mediaTime .choose-decade .items").append(element);
    }

    this.choosenDecade = this.selectedDecate;
    this.choosenYear = this.selectedYear;
    // this.getDecade(this.selectedDecate);
    // this.getYear(this.selectedYear);
    this.getMonth(this.selectedMonth);
    if (this.selectedDay) {
      this.getDay(this.selectedDay);
    }
  },
};
</script>
