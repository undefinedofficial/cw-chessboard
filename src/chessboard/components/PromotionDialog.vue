<template>
  <Transition name="promotion-dialog">
    <div v-if="coord" class="promotion-dialog">
      <button
        v-for="(piece, i) in ['q', 'r', 'b', 'n']"
        :key="i"
        class="promotion-piece"
        :style="{ transform: `translate(${coord.x * 100}%, ${i * 100}%)` }"
        @pointerdown.stop="resolveHandler(piece)"
      >
        <component is="piece">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" version="1.1">
            <use :href="`#${piecePack}-${pieceColor}${piece}`"></use>
          </svg>
        </component>
      </button>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { computed, ref, Transition } from "vue";
import type { Color, SquarePoint } from "../types";
import { invertPoint, stringToSquare } from "../utils/point";
import { useContext } from "../hooks/context";

const props = defineProps<{
  color?: Color;
}>();

const { orientation, pieceWhitePack, pieceBlackPack } = useContext();

const pieceColor = computed(() => props.color || orientation.value);

const piecePack = computed(() =>
  pieceColor.value == "w" ? pieceWhitePack.value : pieceBlackPack.value
);

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

piece {
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
