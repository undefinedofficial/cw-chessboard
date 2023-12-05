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
    <div
      ref="wrapper"
      class="cw-wrapper"
      :style="{
        borderRadius: boardRoundScale,
        borderWidth: borderScale,
      }"
    >
      <div ref="chessboard" class="cw-container" :class="{ outside: coordOutside }">
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
  </div>
</template>

<script lang="ts" setup>
import "./style/main.scss";
import { ref, computed, toRef, provide } from "vue";

import type { ChessboardProps } from "./types";
import { useRescale } from "./hooks/rescale";
import { usePieces } from "./hooks/pieces";
import ChessboardCoords from "./components/ChessboardCoords.vue";

const props = withDefaults(defineProps<ChessboardProps>(), {
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQ",
  orientation: "w",
  duration: 300,
  borderSize: 12,
  roundSize: 0,
  fontSize: 24,
  coordMode: "left",
  boardSet: "default",
  pieceSet: "default",
});
const wrapper = ref<HTMLElement | null>(null);
const chessboard = ref<HTMLElement | null>(null);
const { brdSize, ratioSize, Rescale } = useRescale(wrapper);

const boardSize = computed(() => `${brdSize.value}px`);
const boardRoundScale = computed(() => `${props.roundSize * ratioSize.value}px`);
const borderScale = computed(() => `${props.borderSize * ratioSize.value}px`);
const fontScale = computed(() => `${props.fontSize * ratioSize.value}px`);

const color = toRef(props, "orientation");
const piecesContainer = ref<HTMLElement | null>(null);
const pieces = usePieces(
  piecesContainer,
  toRef(props, "fen"),
  color,
  toRef(props, "duration"),
  toRef(props, "alphaPiece")
);

const boardSet = toRef(props, "boardSet");
const pieceSet = toRef(props, "pieceSet");
provide("chessboard", chessboard);
provide("orientation", color);
provide("pieces", pieces);
provide("boardSet", boardSet);
provide("pieceSet", pieceSet);

defineExpose({
  Rescale,
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
  touch-action: none;
  -o-touch-action: none;
  -ms-touch-action: none;
  -webkit-touch-action: none;

  // transition: width 0.1s linear, height 10ms linear;

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
      cursor: pointer;
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
        transition: none;
      }

      .pieces {
        pointer-events: none;
        will-change: transform, opacity;

        position: absolute;
        top: -1px;
        left: 0;
        width: 100%;
        height: 100%;
        transition: none !important;
        .piece {
          position: absolute;
          display: block;
          height: 12.5%;
          width: 12.5%;
          background-repeat: no-repeat;
          background-size: contain;

          transition: none !important;
        }
      }
    }
  }
}
</style>
