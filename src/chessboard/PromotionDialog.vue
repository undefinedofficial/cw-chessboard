<template>
  <Transition
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
    enter-active-class="transition-opacity"
    leave-active-class="transition-opacity"
  >
    <div v-if="coord" class="promotion-dialog pieces" :class="pieceSet">
      <button
        v-for="(piece, i) in ['q', 'r', 'b', 'n']"
        class="piece promotion-piece"
        :class="`w${piece}`"
        :style="{ transform: `translate(${coord.x * 100}%, ${i * 100}%)` }"
        @pointerdown.stop="resolveHandler(piece)"
      ></button>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { inject, type Ref, ref } from "vue";
import type { Color, SquarePoint } from "./types";
import { invertPoint, stringToSquare } from "./utils/point";

const pieceSet = inject<string>("pieceSet")!;
const orientation = inject<Ref<Color>>("orientation")!;

const coord = ref<SquarePoint | null>();
let resolveHandler: (result: string) => void;
let rejectHandler: () => void;
const require = (square: string) =>
  new Promise<string>((resolve, reject) => {
    if (coord.value) return rejectHandler();

    coord.value = invertPoint(stringToSquare(square), orientation.value);
    resolveHandler = (piece: string) => {
      coord.value = null;
      resolve(piece);
    };
    rejectHandler = reject;
  });
const abort = () => {
  coord.value = null;
  rejectHandler();
};

defineExpose({ require, abort });
</script>

<style lang="scss">
.promotion-dialog {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  pointer-events: all !important;

  .promotion-piece {
    position: absolute;
    background: #838383c8;
    transition: background 0.2s ease-in-out;
    &:hover {
      background: #383838d8;
    }
  }
}
</style>
