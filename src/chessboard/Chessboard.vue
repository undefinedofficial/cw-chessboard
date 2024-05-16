<template>
  <div
    ref="container"
    class="cw-chessboard chessboard-theme"
    :class="boardSet"
    :style="{
      width: boardSize,
      height: boardSize,
      fontSize: fontScalePx,
    }"
  >
    <slot name="before" />
    <div ref="wrapper" class="cw-wrapper" :style="borderStyles">
      <div
        ref="chessboard"
        class="cw-container"
        :class="{ outside: coordOutside, contour: borderSize > 0 }"
        :style="{
          borderRadius: boardRoundScale,
        }"
      >
        <slot />
        <div ref="piecesContainer" class="pieces" :class="pieceSet"></div>
      </div>
    </div>
    <ChessboardCoords
      :borderScale="borderScale"
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
const container = ref<HTMLElement | null>(null);

/**
 * Get the chessboard root element
 */
const getElement = () => container.value;

const wrapper = ref<HTMLElement | null>(null);
const chessboard = ref<HTMLElement | null>(null);
const { size, Rescale } = useRescale(
  computed(() => wrapper.value!.parentElement!.parentElement),
  toRef(props, "resize")
);

const ratioSize = computed(() => size.value / 900);

const fontScale = computed(() => props.fontSize * ratioSize.value);

const isContainBorder = computed(() => fontScale.value / 1.5 < props.borderSize);

const borderScale = computed(() => {
  if (!props.coordOutside || isContainBorder.value)
    return `${(props.borderSize * ratioSize.value).toFixed(2)}px`;

  const borderSize = !isContainBorder.value ? props.fontSize / 1.5 : props.borderSize;

  return `${(borderSize * ratioSize.value).toFixed(2)}px`;
});

const boardRoundScale = computed(() => `${props.roundSize * ratioSize.value}px`);

const borderStyles = computed(() => {
  return {
    borderRadius: boardRoundScale.value,
    borderWidth: borderScale.value,
    ...(isContainBorder.value
      ? {}
      : {
          borderColor: "transparent",
          backgroundColor: "transparent",
        }),
  };
});

const boardSize = computed(() => `${size.value}px`);
const fontScalePx = computed(() => `${fontScale.value.toFixed(3)}px`);

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
    if (fen) pieces.setFen(fen, true);
    if (orientation) pieces.setOrientation(orientation, true);
    pieces.setIsAlphaPiece(alphaPiece);
    pieces.setDuration(duration);
  },
  { deep: true }
);

const color = ref<Color>(props.orientation);
const boardSet = toRef(props, "boardSet");
const pieceSet = toRef(props, "pieceSet");
provide("container", container);
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

defineExpose({ getElement, boardSize: size, Rescale, pieces });
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
        display: contents;
        & > piece {
          position: absolute;
          top: 0;
          left: 0;
          width: 12.5%;
          height: 12.5%;
          background-size: cover;
          z-index: 5;
          will-change: transform, opacity;
          // pointer-events: none;
        }
      }
    }
  }
}
</style>
