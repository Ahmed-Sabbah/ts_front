<template>
  <div class="landscap-size24" id="landscap-size24" ref="landscapSize24">
    <div class="first-row">
      <div class="col-1">
        <div
          class="row-1"
          id="box1"
          @drop="drop($event)"
          @dragover="allowDrop($event)"
          draggable="true"
          @dragstart="dragstart($event)"
          @dragend="dragEnd($event)"
          @dragleave="dragLeave($event)"
        >
          <span>1</span>
        </div>
        <div
          class="row-2"
          id="box2"
          @drop="drop($event)"
          @dragover="allowDrop($event)"
          draggable="true"
          @dragstart="dragstart($event)"
          @dragend="dragEnd($event)"
          @dragleave="dragLeave($event)"
        >
          <span>2</span>
        </div>
      </div>
      <div
        class="col-2"
        id="box3"
        @drop="drop($event)"
        @dragover="allowDrop($event)"
        draggable="true"
        @dragstart="dragstart($event)"
        @dragend="dragEnd($event)"
        @dragleave="dragLeave($event)"
      >
        <span>3</span>
      </div>
      <div class="col-3">
        <div class="row-1">
          <div
            class="row-1-col-1"
            id="box4"
            @drop="drop($event)"
            @dragover="allowDrop($event)"
            draggable="true"
            @dragstart="dragstart($event)"
            @dragend="dragEnd($event)"
            @dragleave="dragLeave($event)"
          >
            <span>4</span>
          </div>
          <div
            class="row-1-col-2"
            id="box5"
            @drop="drop($event)"
            @dragover="allowDrop($event)"
            draggable="true"
            @dragstart="dragstart($event)"
            @dragend="dragEnd($event)"
            @dragleave="dragLeave($event)"
          >
            <span>5</span>
          </div>
        </div>
        <div class="row-2">
          <div
            class="row-2-col-1"
            id="box6"
            @drop="drop($event)"
            @dragover="allowDrop($event)"
            draggable="true"
            @dragstart="dragstart($event)"
            @dragend="dragEnd($event)"
            @dragleave="dragLeave($event)"
          >
            <span>6</span>
          </div>
          <div
            class="row-2-col-2"
            id="box7"
            @drop="drop($event)"
            @dragover="allowDrop($event)"
            draggable="true"
            @dragstart="dragstart($event)"
            @dragend="dragEnd($event)"
            @dragleave="dragLeave($event)"
          >
            <span>7</span>
          </div>
        </div>
      </div>
      <div class="col-4">
        <div
          class="row-1"
          id="box8"
          @drop="drop($event)"
          @dragover="allowDrop($event)"
          draggable="true"
          @dragstart="dragstart($event)"
          @dragend="dragEnd($event)"
          @dragleave="dragLeave($event)"
        >
          <span>8</span>
        </div>
        <div class="row-2">
          <div
            class="row-2-col-1"
            id="box9"
            @drop="drop($event)"
            @dragover="allowDrop($event)"
            draggable="true"
            @dragstart="dragstart($event)"
            @dragend="dragEnd($event)"
            @dragleave="dragLeave($event)"
          >
            <span>9</span>
          </div>
          <div
            class="row-2-col-2"
            id="box10"
            @drop="drop($event)"
            @dragover="allowDrop($event)"
            draggable="true"
            @dragstart="dragstart($event)"
            @dragend="dragEnd($event)"
            @dragleave="dragLeave($event)"
          >
            <span>10</span>
          </div>
        </div>
      </div>
    </div>
    <div class="second-row">
      <div class="col-1">
        <div class="row-1">
          <div
            class="row-2-col-1"
            id="box21"
            @drop="drop($event)"
            @dragover="allowDrop($event)"
            draggable="true"
            @dragstart="dragstart($event)"
            @dragend="dragEnd($event)"
            @dragleave="dragLeave($event)"
          >
            <span>21</span>
          </div>
          <div
            class="row-2-col-2"
            id="box22"
            @drop="drop($event)"
            @dragover="allowDrop($event)"
            draggable="true"
            @dragstart="dragstart($event)"
            @dragend="dragEnd($event)"
            @dragleave="dragLeave($event)"
          >
            <span>22</span>
          </div>
        </div>
        <div
          class="row-2"
          id="box23"
          @drop="drop($event)"
          @dragover="allowDrop($event)"
          draggable="true"
          @dragstart="dragstart($event)"
          @dragend="dragEnd($event)"
          @dragleave="dragLeave($event)"
        >
          <span>23</span>
        </div>
        <div
          class="row-3"
          id="box24"
          @drop="drop($event)"
          @dragover="allowDrop($event)"
          draggable="true"
          @dragstart="dragstart($event)"
          @dragend="dragEnd($event)"
          @dragleave="dragLeave($event)"
        >
          <span>24</span>
        </div>
      </div>
      <div class="col-2">
        <div
          id="box11"
          @drop="drop($event)"
          @dragover="allowDrop($event)"
          draggable="true"
          @dragstart="dragstart($event)"
          @dragend="dragEnd($event)"
          @dragleave="dragLeave($event)"
        >
          <span>11</span>
        </div>
        <div
          id="box12"
          @drop="drop($event)"
          @dragover="allowDrop($event)"
          draggable="true"
          @dragstart="dragstart($event)"
          @dragend="dragEnd($event)"
          @dragleave="dragLeave($event)"
        >
          <span>12</span>
        </div>
        <div
          id="box13"
          @drop="drop($event)"
          @dragover="allowDrop($event)"
          draggable="true"
          @dragstart="dragstart($event)"
          @dragend="dragEnd($event)"
          @dragleave="dragLeave($event)"
        >
          <span>13</span>
        </div>
        <div
          id="box14"
          @drop="drop($event)"
          @dragover="allowDrop($event)"
          draggable="true"
          @dragstart="dragstart($event)"
          @dragend="dragEnd($event)"
          @dragleave="dragLeave($event)"
        >
          <span>14</span>
        </div>
        <div
          id="box15"
          @drop="drop($event)"
          @dragover="allowDrop($event)"
          draggable="true"
          @dragstart="dragstart($event)"
          @dragend="dragEnd($event)"
          @dragleave="dragLeave($event)"
        >
          <span>15</span>
        </div>
        <div
          id="box16"
          @drop="drop($event)"
          @dragover="allowDrop($event)"
          draggable="true"
          @dragstart="dragstart($event)"
          @dragend="dragEnd($event)"
          @dragleave="dragLeave($event)"
        >
          <span>16</span>
        </div>
        <div
          id="box17"
          @drop="drop($event)"
          @dragover="allowDrop($event)"
          draggable="true"
          @dragstart="dragstart($event)"
          @dragend="dragEnd($event)"
          @dragleave="dragLeave($event)"
        >
          <span>17</span>
        </div>
        <div
          id="box18"
          @drop="drop($event)"
          @dragover="allowDrop($event)"
          draggable="true"
          @dragstart="dragstart($event)"
          @dragend="dragEnd($event)"
          @dragleave="dragLeave($event)"
        >
          <span>18</span>
        </div>
        <div
          id="box19"
          @drop="drop($event)"
          @dragover="allowDrop($event)"
          draggable="true"
          @dragstart="dragstart($event)"
          @dragend="dragEnd($event)"
          @dragleave="dragLeave($event)"
        >
          <span>19</span>
        </div>
        <div
          id="box20"
          @drop="drop($event)"
          @dragover="allowDrop($event)"
          draggable="true"
          @dragstart="dragstart($event)"
          @dragend="dragEnd($event)"
          @dragleave="dragLeave($event)"
        >
          <span>20</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  name: "LandscapCollageSize24",
  props: ["droppedMediaList", "orderKeysArr", "orderValuesArr"],
  data() {
    return {
      selectedMediaList: this.droppedMediaList,
      boxOrderKeys: this.orderKeysArr,
      boxOrderValues: this.orderValuesArr,
    };
  },
  methods: {
    allowDrop(ev) {
      ev.preventDefault();
      let item = ev.target.querySelector("span");
      if (item) {
        item.style.display = "none";
      }
    },
    drop(ev) {
      ev.preventDefault();

      if (ev.dataTransfer.getData("layoutMedia")) {
        // var layoutMediaID = ev.dataTransfer.getData("layoutMedia");
      } else {
        var data = ev.dataTransfer.getData("mediaID");
        let mediaBoxImg = document.querySelector(
          ".create-collage .step3 #" + data
        );
        // $(ev.target).append(mediaBoxImg);
        const nodeCopy = mediaBoxImg.cloneNode(true);

        var element = ev.target.tagName;
        if (element == "DIV") {
          ev.target.appendChild(nodeCopy);
          const collagePhoto = ev.target
            .querySelector("img")
            .getAttribute("data-id");
          ev.target
            .querySelector("img")
            .setAttribute("crossorigin", "anonymous");
          this.selectedMediaList.push(collagePhoto);
          this.$emit("updateDroppedMediaList", this.selectedMediaList);

          let targetID = ev.target.id;
          this.boxOrderKeys.push(targetID);
          this.$emit("updateOrderKeysArr", this.boxOrderKeys);
          this.boxOrderValues.push(collagePhoto);
          this.$emit("updateOrderValuesArr", this.boxOrderValues);
        }
      }
    },
    dragstart(ev) {
      var element = ev.target.tagName;
      if (element == "IMG") {
        ev.stopPropagation();
        ev.dataTransfer.setData(
          "layoutMedia",
          ev.target.getAttribute("data-id")
        );
        let layoutMediaID = ev.target.getAttribute("data-id");
        let boxID = ev.path[1].id;

        this.selectedMediaList.splice(
          this.selectedMediaList.indexOf(layoutMediaID),
          1
        );
        this.$emit("updateDroppedMediaList", this.selectedMediaList);

        this.boxOrderValues.splice(
          this.boxOrderValues.indexOf(layoutMediaID),
          1
        );
        this.$emit("updateOrderValuesArr", this.boxOrderValues);

        this.boxOrderKeys.splice(this.boxOrderKeys.indexOf(boxID), 1);
        this.$emit("updateOrderKeysArr", this.boxOrderKeys);
      } else {
        ev.preventDefault();
      }
    },
    dragEnd(ev) {
      ev.preventDefault();
      $(ev.target).remove();
    },
    dragLeave(ev) {
      ev.preventDefault();

      let item = ev.target.querySelector("span");
      if (item) {
        item.style.display = "inline-block";
      }
    },
  },
};
</script>

<style scoped>
@import url("../../../assets/css/landscape-size-24.css");
</style>