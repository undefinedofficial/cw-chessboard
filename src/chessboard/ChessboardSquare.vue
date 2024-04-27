<template>
  <div class="cw-chessboard-square" :class="{ above: above }" :style="floatingStyles">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, type Ref } from "vue";
import type { Color } from "./types";
import { invertPoint, stringToSquare } from "./utils";

export interface ChessboardSquareProps {
  square: string;
  above?: boolean;
}
const props = defineProps<ChessboardSquareProps>();

const orientation = inject<Ref<Color>>("orientation")!;

const floatingStyles = computed(() => {
  const { x, y } = invertPoint(stringToSquare(props.square), orientation.value);
  return `transform: translate(${x * 100}%, ${y * 100}%);`;
});
</script>

<style lang="scss">
.cw-chessboard-square {
  position: absolute;
  top: 1px;
  left: 0;
  width: 12.5%;
  height: 12.5%;
  // transition: all 0.2s ease-in-out;
  z-index: 3;

  &.above {
    z-index: 14;
  }
}
</style>
