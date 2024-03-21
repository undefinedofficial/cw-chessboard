<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1">
    <defs>
      <marker
        id="arrow"
        class="arrow-head"
        refX="19"
        refY="20"
        markerHeight="5"
        markerWidth="5"
        viewBox="0 0 40 40"
        orient="auto"
      >
        <g
          id="strict-marker-arrow"
          transform="matrix(5.1931792,0,0,5.1931792,3.5980168,-0.83225447)"
        >
          <path
            d="M 0.535156,0.398438 C 0.398438,0.507812 0.316406,0.671875 0.3125,0.847656 0.316406,1.02344 0.398438,1.1875 0.535156,1.29688 L 3.01172,3.35938 3.72266,4.01563 3.01172,4.64453 0.535156,6.67969 C 0.394531,6.79297 0.3125,6.96094 0.3125,7.13672 c 0,0.17578 0.082031,0.34375 0.222656,0.45703 0.328125,0.25781 0.792974,0.25781 1.117184,0 L 5.45703,4.46094 C 5.59766,4.34766 5.68359,4.17969 5.69141,4 5.69141,3.82031 5.60547,3.65234 5.45703,3.54297 L 1.64453,0.394531 C 1.31641,0.148438 0.859375,0.148438 0.535156,0.398438 Z m 0,0"
            stroke="none"
            stroke-width="0"
            :class="color"
          ></path>
        </g>
      </marker>
    </defs>
    <line
      class="arrow-line"
      :x1="from.x"
      :y1="from.y"
      :x2="to.x"
      :y2="to.y"
      marker-end="url(#arrow)"
      stroke="currentColor"
      :stroke-width="size * 1.5"
      stroke-linecap="round"
      :class="color"
    />
  </svg>
</template>

<script lang="ts" setup>
import { computed, inject, type Ref } from "vue";
import type { Color, Point } from "../types";
import { invertPoint, pointHalfSquareNS, squareToPointNS, stringToSquare } from "../utils/point";

const props = defineProps<{
  square: string;
  toSquare: string;
  color: string;
  size: number;
}>();

const orientation = inject<Ref<Color>>("orientation")!;

const from = computed(() =>
  pointHalfSquareNS(squareToPointNS(invertPoint(stringToSquare(props.square), orientation.value)))
);
const to = computed(() =>
  pointHalfSquareNS(squareToPointNS(invertPoint(stringToSquare(props.toSquare), orientation.value)))
);
</script>

<style>
.arrow-head {
  stroke-linecap: round;
}

.arrow-line {
  stroke-linecap: round;
}
</style>
