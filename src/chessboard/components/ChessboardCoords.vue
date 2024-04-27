<template>
  <div class="chessboard-coords" v-if="isShow">
    <div
      class="coords numbers"
      :class="{
        outside: coordOutside,
        'coords-right': isRight,
      }"
    >
      <span class="coord" v-for="n in 8" :class="n % 2 !== (isRight ? 1 : 0) ? 'white' : 'black'">
        <span>{{ orientation === "w" ? 9 - n : n }}</span>
      </span>
    </div>
    <div
      class="coords letters"
      :class="{
        outside: coordOutside,
        'coords-right': isRight,
      }"
    >
      <span class="coord" v-for="l in 8" :class="l % 2 === 0 ? 'white' : 'black'">
        <span>{{ String.fromCharCode(orientation === "w" ? l + 96 : 105 - l) }}</span>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { Color, CoordMode } from "../types";

const props = defineProps<{
  orientation: Color;
  coordMode: CoordMode;
  coordOutside?: boolean;
}>();

const isShow = computed(() => props.coordMode !== "none");
const isRight = computed(() => props.coordMode === "right");
</script>

<style lang="scss">
.chessboard-coords {
  pointer-events: none;
  position: absolute;
  left: 2px;
  right: 2px;
  top: 2px;
  bottom: 2px;
  .coords {
    pointer-events: none;
    position: absolute;
    transition: all 0.1s linear;

    .coord {
      display: block;
      font-size: 0.6em;
      font-weight: bold;
      text-transform: uppercase;
      line-height: 100%;
    }
    &.numbers {
      display: block;
      height: 100%;
      left: 2px;
      top: 2px;
      &.outside {
        left: 0;
        transform: translateX(-140%);
        .coord {
          align-items: center;
        }
      }

      .coord {
        display: flex;
        height: 12.5%;
      }
    }
    &.coords-right.numbers {
      left: auto;
      right: 2px;
      &.outside {
        transform: translateX(160%);
      }
    }
    &.coords-right.letters {
      text-align: start;
      left: 3px;
    }

    &.letters {
      display: inline-flex;
      width: 100%;
      right: 6px;
      bottom: 0;

      text-align: end;
      &.outside {
        transform: translateY(110%);
        text-align: center;
        right: 0;
      }
      .coord {
        width: 12.5%;
      }
    }
  }
}
</style>
