<template>
  <div class="media-filter">
    <form>
      <div class="search">
        <label for="media">
          <img
            src="../../../assets/images/dashboard/contributors/search-3.svg"
            alt="search"
          />
        </label>
        <input
          type="text"
          name="media"
          id="media"
          v-model="mediaName"
          placeholder="Search for media"
        />
      </div>
      <div class="select-inputs">
        <div class="tags">
          <div class="select-container" @click="selectTagsToggle">
            <span :class="selectedTags.length > 0 ? 'select-value text-bold' : 'select-value'"
              >{{ selectedTags.length }} Selected</span
            >
            <img
              src="../../../assets/images/dashboard/filters/select-bottom.svg"
              id="selectBottom"
              alt="select-bottom"
            />
          </div>
          <div class="tags-dropdown">
            <div class="head">
              <div class="title">
                <p>Tags</p>
                <span @click="unselectTags()">Clear</span>
              </div>
              <div class="search-box">
                <input type="text" placeholder="Search" v-model="tagName" />
              </div>
            </div>
            <div class="select-value">
              <div class="tag" v-for="tag in tagsListFilter" :key="tag.pk_i_id">
                <label>
                  <input
                    type="checkbox"
                    :value="tag.pk_i_id"
                    @change="selectTag(tag.pk_i_id)"
                  />
                  <span class="checkmark"></span>&emsp;&ensp; {{ tag.s_name }}
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="uploadedBy">
          <div class="select-container" @click="selectUploadedByToggle">
            <span
              :class="
                uploadedBy != '' ? 'select-value has-val' : 'select-value'
              "
              >{{ uploadedBy != "" ? uploadedBy : "Uploaded by" }}</span
            >
            <img
              src="../../../assets/images/dashboard/filters/select-bottom.svg"
              id="selectBottom"
              alt="select-bottom"
            />
          </div>
          <div class="uploadedBy-dropdown">
            <div class="head">
              <div class="title">Uploaded by</div>
              <div class="search-box">
                <input
                  type="text"
                  placeholder="Search"
                  v-model="contributorName"
                />
              </div>
            </div>
            <div class="select-value">
              <span
                v-for="contributor in uploadedByListFilter"
                :key="contributor.pk_i_id"
                @click="chooseUploadedBy(contributor.s_fullname, contributor.pk_i_id)"
                >{{ contributor.s_fullname }}</span
              >
            </div>
          </div>
        </div>
        <div class="timeline">
          <div class="select-container" @click="selectTimelineToggle">
            <span
              :class="
                period1 != '' && period2 != ''
                  ? 'select-value has-val'
                  : 'select-value'
              "
            >
              {{
                period1 != "" && period2 != ""
                  ? period1 + " - " + period2
                  : "Timeline"
              }}
            </span>
            <img
              src="../../../assets/images/dashboard/filters/select-bottom.svg"
              id="selectBottom"
              alt="select-bottom"
            />
          </div>
          <div class="timeline-dropdown">
            <h3>Choose your preferable duration</h3>
            <p>Now you can see the media related to a certain duratio</p>
            <div class="timeline-selector">
              <div class="periods"></div>
            </div>
            <div class="choosen-period">
              <p>Choose Duration</p>
              <h2>{{ period1 }} - {{ period2 }}</h2>
            </div>
            <div class="btn-group">
              <button class="cancel" @click="hideTimelineModel">Cancel</button>
              <button class="apply" @click="filterMediaByTimeline">
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import $ from "jquery";

export default {
  name: "MediaFilter",
  props: ["mediaList"],
  data() {
    return {
      media: this.mediaList,
      mediaName: "",
      uploadedBy: "",
      uploadedByID: "",
      contributorName: "",
      tagName: "",
      selectedTags: [],
      tagsList: [],
      usersList: [],
      period1: "",
      period2: "",
      id: this.$route.params.id,
      type: "JOURNEYS",
    };
  },
  methods: {
    selectUploadedByToggle() {
      if ($(".uploadedBy").hasClass("open")) {
        $(".uploadedBy").removeClass("open");
      } else {
        $(".uploadedBy").addClass("open");
      }
    },
    async chooseUploadedBy(name, id) {
      this.uploadedBy = name;
      $(".uploadedBy").removeClass("open");
      await axios.get("/media?uploader_id=" + id).then((res) => {
        if (res.data.status.success) {
          this.media = res.data.media;
          this.$emit("updateMediaList", this.media);
        }
      });
    },
    selectTagsToggle() {
      if ($(".tags").hasClass("open")) {
        $(".tags").removeClass("open");
      } else {
        $(".tags").addClass("open");
      }
    },
    unselectTags() {
      $(".tags .tags-dropdown .select-value input").prop("checked", false);
      this.selectedTags = [];
      axios
        .get(
          "/media?searchable_id=" + this.id + "&searchable_type=" + this.type
        )
        .then((res) => {
          if (res.data.status.success) {
            this.media = res.data.media;
            this.$emit("updateMediaList", this.media);
          }
        });
    },
    selectTag(tag) {
      const check = this.selectedTags.indexOf(tag);
      if (check > -1) {
        this.selectedTags.splice(check, 1);
        if (this.selectedTags.length == 0) {
          axios
            .get(
              "/media?searchable_id=" +
                this.id +
                "&searchable_type=" +
                this.type
            )
            .then((res) => {
              if (res.data.status.success) {
                this.media = res.data.media;
                this.$emit("updateMediaList", this.media);
              }
            });
        } else {
          axios
            .get(
              "/media?searchable_id=" +
                this.id +
                "&searchable_type=" +
                this.type +
                "&tags_id=" +
                this.selectedTags
            )
            .then((res) => {
              if (res.data.status.success) {
                this.media = res.data.media;
                this.$emit("updateMediaList", this.media);
              }
            });
        }
      } else {
        this.selectedTags.push(tag);
        axios
          .get(
            "/media?searchable_id=" +
              this.id +
              "&searchable_type=" +
              this.type +
              "&tags_id=" +
              this.selectedTags
          )
          .then((res) => {
            if (res.data.status.success) {
              this.media = res.data.media;
              this.$emit("updateMediaList", this.media);
            }
          });
      }
    },
    selectTimelineToggle() {
      this.period1 = "";
      this.period2 = "";
      if ($(".timeline").hasClass("open")) {
        $(".timeline").removeClass("open");
      } else {
        $(".timeline").addClass("open");
      }
      $(".media-filter .timeline .timeline-dropdown .periods span").removeClass(
        "active"
      );
    },
    hideTimelineModel(e) {
      e.preventDefault();

      this.period1 = "";
      this.period2 = "";
      $(".timeline").removeClass("open");
      $(".media-filter .timeline .timeline-dropdown .periods span").removeClass(
        "active"
      );
    },
    filterMediaByTimeline(e) {
      e.preventDefault();
      axios
        .get(
          "/media?searchable_id=" +
            this.id +
            "&searchable_type=" +
            this.type +
            "&i_year_from=" +
            this.period1 +
            "&i_year_to=" +
            this.period2
        )
        .then((res) => {
          if (res.data.status.success) {
            this.media = res.data.media;
            this.$emit("updateMediaList", this.media);

            $(".timeline").removeClass("open");
            $(
              ".media-filter .timeline .timeline-dropdown .periods span"
            ).removeClass("active");
          }
        });
    },
    choosePeriod(year) {
      if (this.period1 == "" && this.period2 == "") {
        this.period1 = year;
        const yearsSpan = $(
          ".media-filter .timeline .timeline-dropdown .periods span"
        );
        for (let index = 0; index < yearsSpan.length; index++) {
          const element = yearsSpan[index];
          const elementID = $(element).attr("id");
          if (elementID == "period-" + this.period1) {
            $(element).addClass("active");
          } else {
            $(element).removeClass("active");
          }
        }
      } else if (this.period1 != "" && this.period2 == "") {
        this.period2 = year;
        const yearsSpan = $(
          ".media-filter .timeline .timeline-dropdown .periods span"
        );
        for (let index = 0; index < yearsSpan.length; index++) {
          const element = yearsSpan[index];
          const elementID = $(element).attr("id");
          if (
            elementID == "period-" + this.period2 ||
            elementID == "period-" + this.period1
          ) {
            $(
              ".media-filter .timeline .timeline-dropdown #period-" +
                this.period2
            ).addClass("active");
          } else {
            $(element).removeClass("active");
          }
        }
      } else if (this.period1 != "" && this.period2 != "") {
        this.period2 = year;
        const yearsSpan = $(
          ".media-filter .timeline .timeline-dropdown .periods span"
        );
        for (let index = 0; index < yearsSpan.length; index++) {
          const element = yearsSpan[index];
          const elementID = $(element).attr("id");
          if (
            elementID == "period-" + this.period2 ||
            elementID == "period-" + this.period1
          ) {
            $(
              ".media-filter .timeline .timeline-dropdown #period-" +
                this.period2
            ).addClass("active");
          } else {
            $(element).removeClass("active");
          }
        }
      }
    },
  },
  computed: {
    uploadedByListFilter: function () {
      var filtering = new RegExp(this.contributorName, "i");
      return this.usersList.filter((el) => el.s_fullname.match(filtering));
    },
    tagsListFilter: function () {
      var filtering = new RegExp(this.tagName, "i");
      return this.tagsList.filter((el) => el.s_name.match(filtering));
    },
  },
  watch: {
    mediaName: function (v) {
      if (v == "") {
        axios
          .get(
            "/media?searchable_id=" + this.id + "&searchable_type=" + this.type
          )
          .then((res) => {
            if (res.data.status.success) {
              this.media = res.data.media;
              this.$emit("updateMediaList", this.media);
            }
          });
      } else {
        axios
          .get(
            "/media/search?searchable_id=" +
              this.id +
              "&searchable_type=" +
              this.type +
              "&s_key=" +
              v
          )
          .then((res) => {
            if (res.data.status.success) {
              this.media = res.data.media;
              this.$emit("updateMediaList", this.media);
            }
          });
      }
    },
    period1: function (v) {
      if (v == "") {
        this.period1 = "";
      } else {
        this.period1 = v;
      }
    },
    period2: function (v) {
      if (v == "") {
        this.period2 = "";
      } else {
        this.period2 = v;
      }
    },
  },

  async mounted() {
    // Tags
    await axios.get("/tags").then((res) => {
      if (res.data.status.success) {
        this.tagsList = res.data.tags;
      }
    });
    
    //Uploaded By
    await axios.get("/users").then((res) => {
      if (res.data.status.success) {
        this.usersList = res.data.users;
      }
    });

    // Timeline
    const checkDecades = $(
      ".media-filter .timeline .timeline-dropdown .periods span"
    );
    if (checkDecades.length > 0) {
        $(".media-filter .timeline .timeline-dropdown .periods").empty();
        this.period1 = "";
        this.period2 = "";
    }
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear(); // 2022
    const currentDecade = currentYear - (currentYear % 10); // 2020
    const MaxDecade = currentDecade + 10;
    let testArr = [];

    for (let index = 1900; index <= MaxDecade; index += 10) {
      if (index ==  MaxDecade) {
        index = currentDecade + (currentYear % 10);
      }
      testArr.push(index);
    }

    for (let index = 0; index < testArr.length; index++) {
      let val = testArr[index];
      const decadeItem = document.createElement("span");
      decadeItem.setAttribute("id", "period-" + val);
      if (index % 2 == 0) {
        decadeItem.setAttribute("class", "show");
      } else {
        decadeItem.setAttribute("class", "hide");
      }
      decadeItem.innerText = val;
      $(decadeItem).on("click", (e) => {
        let decadeVal = parseInt(e.target.innerText);
        if (this.period1 == "" && this.period2 == "") {
          this.period1 = decadeVal;
          const yearsSpan = $(
            ".media-filter .timeline .timeline-dropdown .periods span"
          );
          for (let index = 0; index < yearsSpan.length; index++) {
            const element = yearsSpan[index];
            const elementID = $(element).attr("id");
            if (elementID == "period-" + this.period1) {
              $(element).addClass("active");
            } else {
              $(element).removeClass("active");
            }
          }
        } else if (this.period1 != "" && this.period2 == "") {
          this.period2 = decadeVal;
          const yearsSpan = $(
            ".media-filter .timeline .timeline-dropdown .periods span"
          );
          for (let index = 0; index < yearsSpan.length; index++) {
            const element = yearsSpan[index];
            const elementID = $(element).attr("id");
            if (
              elementID == "period-" + this.period2 ||
              elementID == "period-" + this.period1
            ) {
              $(
                ".media-filter .timeline .timeline-dropdown #period-" +
                  this.period2
              ).addClass("active");
            } else {
              $(element).removeClass("active");
            }
          }
        } else if (this.period1 != "" && this.period2 != "") {
          this.period2 = decadeVal;
          const yearsSpan = $(
            ".media-filter .timeline .timeline-dropdown .periods span"
          );
          for (let index = 0; index < yearsSpan.length; index++) {
            const element = yearsSpan[index];
            const elementID = $(element).attr("id");
            if (
              elementID == "period-" + this.period2 ||
              elementID == "period-" + this.period1
            ) {
              $(
                ".media-filter .timeline .timeline-dropdown #period-" +
                  this.period2
              ).addClass("active");
            } else {
              $(element).removeClass("active");
            }
          }
        }
      });
      $(".media-filter .timeline .timeline-dropdown .periods").append(decadeItem);
    }
  },
};
</script>

<style scoped>
@import url("../../../assets/css/media-filter.css");
</style>