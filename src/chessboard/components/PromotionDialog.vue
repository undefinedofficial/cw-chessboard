<template>
  <Transition name="promotion-dialog">
    <div v-if="coord" class="promotion-dialog">
      <button
        v-for="(piece, i) in PIECES"
        :key="i"
        class="promotion-piece"
        :style="{ transform: `translate(${coord.x * 100}%, ${i * 100}%)` }"
        @pointerdown.stop="resolveHandler(piece)"
      >
        <div class="piece" :class="pieceColor + piece"></div>
      </button>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { computed,  shallowRef, Transition } from "vue";
import type { Color, SquarePoint } from "../types";
import { invertPoint, stringToSquare } from "../utils/square";
import { useContext } from "../hooks/context";

const props = defineProps<{
  color?: Color;
}>();

const PIECES = ["q", "r", "b", "n"] as const;

type PIECE_TYPE = (typeof PIECES)[number];

const { orientation } = useContext();

const pieceColor = computed(() => props.color || orientation.value);

const coord = shallowRef<SquarePoint | null>();
let resolveHandler: (result: PIECE_TYPE) => void;
let rejectHandler: () => void;

const require = (square: string) =>
  new Promise<PIECE_TYPE>((resolve, reject) => {
    if (coord.value) return rejectHandler();

    coord.value = invertPoint(stringToSquare(square), orientation.value);
    resolveHandler = resolve;
    rejectHandler = reject;
  }).finally(() => {
    coord.value = null;
  });

const abort = () => rejectHandler?.();

defineExpose({ require, abort });
</script>

<style scoped>
.promotion-dialog {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  pointer-events: all !important;
}

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
}

.piece {
  position: absolute;
  top: 0;
  left: 0;
  background-size: cover;
  width: 100%;
  height: 100%;
}

.promotion-dialog-enter-active {
  animation: show-promotion-dialog 0.2s ease-in-out;
}
.promotion-dialog-leave-active {
  animation: show-promotion-dialog 0.2s ease-in-out reverse;
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
