<template>
  <div class="cw-chessboard-square" :class="{ above }" :style="floatingStyles">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { invertPoint, stringToSquare } from "../utils";
import { useContext } from "../hooks/context";

export interface ChessboardSquareProps {
  square: string;
  above?: boolean;
}
const props = defineProps<ChessboardSquareProps>();

const { orientation } = useContext();

const floatingStyles = computed(() => {
  const { x, y } = invertPoint(stringToSquare(props.square), orientation.value);
  return `transform: translate3d(${x * 100}%, ${y * 100}%, 0);`;
});
</script>

<style lang="postcss">
.cw-chessboard-square {
  position: absolute;
  top: 0;
  left: 0;
  width: 12.5%;
  height: 12.5%;
  z-index: 3;

  &.above {
    z-index: 14;
  }
}
</style>
