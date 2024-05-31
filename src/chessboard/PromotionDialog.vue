<template>
  <Transition name="promotion-dialog">
    <div v-if="coord" class="promotion-dialog">
      <button
        v-for="(piece, i) in ['q', 'r', 'b', 'n']"
        :key="i"
        class="promotion-piece"
        :class="pieceSet"
        :style="{ transform: `translate(${coord.x * 100}%, ${i * 100}%)` }"
        @pointerdown.stop="resolveHandler(piece)"
        v-html="`<piece class=&quot;${pieceColor}${piece}&quot;></piece>`"
      ></button>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { computed, inject, type Ref, ref, Transition } from "vue";
import type { Color, SquarePoint } from "./types";
import { invertPoint, stringToSquare } from "./utils/point";

const props = defineProps<{
  color?: Color;
}>();

const pieceSet = inject<string>("pieceSet")!;
const orientation = inject<Ref<Color>>("orientation")!;

const pieceColor = computed(() => props.color || orientation.value);

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
    top: 0;
    left: 0;
    width: 12.5%;
    height: 12.5%;
    will-change: transform;
    z-index: 100;

    background: #838383c8;
    transition: background 0.2s ease-in-out;
    &:hover {
      background: #383838d8;
    }

    piece {
      position: absolute;
      top: 0;
      left: 0;
      background-size: cover;
      width: 100%;
      height: 100%;
    }
  }

  &-enter-active {
    animation: show-promotion-dialog 0.2s ease-in-out;
  }
  &-leave-active {
    animation: show-promotion-dialog 0.2s ease-in-out reverse;
  }
}

@keyframes show-promotion-dialog {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
