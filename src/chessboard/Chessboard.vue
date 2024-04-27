<template>
  <div
    class="cw-chessboard chessboard-theme"
    :class="boardSet"
    :style="{
      width: boardSize,
      height: boardSize,
      fontSize: fontScale,
    }"
  >
    <slot name="before" />
    <div
      ref="wrapper"
      class="cw-wrapper"
      :style="{
        borderRadius: boardRoundScale,
        borderWidth: borderScale,
      }"
    >
      <div
        ref="chessboard"
        class="cw-container"
        :class="{ outside: coordOutside, contour: borderSize > 0 }"
        :style="{
          borderRadius: boardRoundScale,
        }"
      >
        <div ref="piecesContainer" class="pieces" :class="pieceSet"></div>
        <slot />
      </div>
    </div>
    <ChessboardCoords
      :style="{
        margin: borderScale,
      }"
      :coordMode="coordMode"
      :orientation="orientation"
      :coordOutside="coordOutside"
    />
    <slot name="after" />
  </div>
</template>

<script lang="ts" setup>
import "./style/main.scss";
import type { ChessboardProps, ChangeEvent, Color } from "./types";
import { ref, computed, toRef, provide, onMounted, onUnmounted, watch } from "vue";
import ChessboardCoords from "./components/ChessboardCoords.vue";
import { useRescale } from "./hooks/rescale";
import { usePieces } from "./hooks/pieces";
import type { ChessboardPieces } from "./hooks/pieces";

const props = withDefaults(defineProps<ChessboardProps>(), {
  orientation: "w",
  borderSize: 12,
  roundSize: 0,
  fontSize: 24,
  coordMode: "left",
  duration: 300,
  boardSet: "default",
  pieceSet: "default",
  resize: true,
});

const emit = defineEmits<{
  ready: [ChessboardPieces];
  moves: [moves: ChangeEvent[]];
}>();
const wrapper = ref<HTMLElement | null>(null);
const chessboard = ref<HTMLElement | null>(null);
const { size, Rescale } = useRescale(
  computed(() => wrapper.value!.parentElement!.parentElement),
  toRef(props, "resize")
);

const ratioSize = computed(() => size.value / 900);
const boardSize = computed(() => `${size.value}px`);
const boardRoundScale = computed(() => `${props.roundSize * ratioSize.value}px`);
const borderScale = computed(() => `${(props.borderSize - 1) * ratioSize.value}px`);
const fontScale = computed(() => `${props.fontSize * ratioSize.value}px`);

const piecesContainer = ref<HTMLElement | null>(null);
const pieces = usePieces({
  onChange(moves) {
    emit("moves", moves);
  },
  onOrientationChange(orientation) {
    color.value = orientation;
  },
});

watch(
  props,
  async ({ fen, orientation, alphaPiece, duration }) => {
    if (fen) await pieces.setFen(fen, true);
    if (orientation) await pieces.setOrientation(orientation, true);
    pieces.setIsAlphaPiece(alphaPiece);
    pieces.setDuration(duration);
  },
  { deep: true }
);

const color = ref<Color>();
const boardSet = toRef(props, "boardSet");
const pieceSet = toRef(props, "pieceSet");
provide("chessboard", chessboard);
provide("orientation", color);
provide("pieces", pieces);
provide("boardSet", boardSet);
provide("pieceSet", pieceSet);

onMounted(() => {
  pieces.setContainer(piecesContainer.value!);
  if (props.fen) pieces.setFen(props.fen);
  pieces.setOrientation(props.orientation);
  pieces.setDuration(props.duration);
  pieces.setIsAlphaPiece(props.alphaPiece);
  emit("ready", pieces);
});

defineExpose({
  boardSize: size,
  Rescale,
  pieces,
});
</script>

<style lang="scss">
.cw-chessboard {
  user-select: none;
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  border-style: solid;
  border-color: transparent;
  background-color: transparent;
  box-sizing: border-box;

  &.active {
    cursor: pointer;
    touch-action: none;
    -o-touch-action: none;
    -ms-touch-action: none;
    -webkit-touch-action: none;
  }

  .cw-wrapper {
    display: inline-block;
    width: 100%;
    height: 100%;
    border-style: solid;
    overflow: hidden;
    box-sizing: border-box;

    .cw-container {
      display: inline-block;
      position: relative;
      width: 100%;
      height: 100%;
      box-sizing: border-box;

      &::before {
        content: " ";
        background-color: #fff;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        border-radius: inherit;
      }

      &.contour {
        border-width: 1px;
        border-style: solid;
      }

      .pieces {
        pointer-events: none;
        will-change: transform, opacity;

        position: absolute;
        top: -1px;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
        .piece {
          position: absolute;
          display: block;
          height: 12.5%;
          width: 12.5%;
          background-repeat: no-repeat;
          background-size: contain;
        }
      }
    }
  }
}
</style>
