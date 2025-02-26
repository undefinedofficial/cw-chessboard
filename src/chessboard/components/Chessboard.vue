<template>
  <div
    ref="container"
    class="cw-chessboard chessboard-theme"
    :style="{
      width: boardSize,
      height: boardSize,
      fontSize: fontScalePx,
      '--cw-coords-white': coordWhite,
      '--cw-coords-black': coordBlack,
    }"
  >
    <slot name="before" />
    <div
      class="cw-wrapper"
      :style="{ borderRadius, background: borderColor, padding: borderScale }"
    >
      <div
        ref="chessboard"
        class="cw-container"
        :class="{ outside: coordOutside }"
        :style="{ borderRadius }"
      >
        <div class="cw-chessboard-inner">
          <slot />
          <div ref="piecesContainer" class="pieces"></div>
        </div>
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
import type { ChessboardProps, ChangeEvent, Color } from "../types";
import { ref, computed, toRef, onMounted, watch } from "vue";
import ChessboardCoords from "./ChessboardCoords.vue";
import { useRescale } from "../hooks/rescale";
import { usePieces } from "../hooks/pieces";
import type { UseChessboardPieces } from "../hooks/pieces";
import { provideContext } from "../hooks/context";

const props = withDefaults(defineProps<ChessboardProps>(), {
  orientation: "w",
  borderSize: 12,
  borderColor: "#692e2b",
  roundSize: 0,
  fontSize: 24,
  coordMode: "left",
  coordWhite: "#c5a076",
  coordBlack: "#ecdab9",
  duration: 300,
  resize: true,
  visibility: "all",
  piecePack: "default",
});

const emit = defineEmits<{
  ready: [UseChessboardPieces];
  moves: [moves: ChangeEvent[]];
}>();
const container = ref<HTMLElement>();

/**
 * Get the chessboard root element
 */
const getElement = () => container.value;

const chessboard = ref<HTMLElement>();
const { size, Rescale } = useRescale(
  computed(() => container.value!.parentElement),
  toRef(props, "resize")
);

const ratioSize = computed(() => size.value / 900);

const fontScale = computed(() => props.fontSize * ratioSize.value);

const isContainBorder = computed(() => fontScale.value < props.borderSize);

const borderScale = computed(() => {
  if (!props.coordOutside || isContainBorder.value)
    return `${(props.borderSize * ratioSize.value).toFixed(2)}px`;

  const borderSize = !isContainBorder.value ? props.fontSize / 1.5 : props.borderSize;

  return `${(borderSize * ratioSize.value).toFixed(2)}px`;
});

const borderRadius = computed(() => `${props.roundSize * ratioSize.value}px`);

const boardSize = computed(() => `${size.value}px`);
const fontScalePx = computed(() => `${fontScale.value.toFixed(3)}px`);

const color = ref<Color>(props.orientation);
const piecesContainer = ref<HTMLElement | null>(null);
const pieces = usePieces({
  onChange(moves) {
    emit("moves", moves);
  },
  onOrientationChange(orientation) {
    color.value = orientation;
  },
  onRenderPiece: props.onRenderPiece,
});

const pieceWhitePack = computed(() => props.pieceWhitePack || props.piecePack);
const pieceBlackPack = computed(() => props.pieceBlackPack || props.piecePack);

watch(
  props,
  async ({ fen, orientation, alphaPiece, duration, visibility }) => {
    if (fen) pieces.setFen(fen, true);
    pieces.setOrientation(orientation, true);
    pieces.setVisibility(visibility, true);
    pieces.setPiecePack(pieceWhitePack.value, pieceBlackPack.value, true);
    pieces.setIsAlphaPiece(alphaPiece);
    pieces.setDuration(duration);
  },
  { deep: true }
);

provideContext({
  container,
  chessboard,
  orientation: color,
  pieces,
  pieceWhitePack,
  pieceBlackPack,
});

onMounted(() => {
  pieces.setContainer(piecesContainer.value!);
  pieces.setDuration(props.duration);
  if (props.fen) pieces.setFen(props.fen);
  pieces.setOrientation(props.orientation);
  pieces.setVisibility(props.visibility);
  pieces.setIsAlphaPiece(props.alphaPiece);
  pieces.setPiecePack(
    props.pieceWhitePack || props.piecePack,
    props.pieceBlackPack || props.piecePack
  );
  emit("ready", pieces);
});

defineExpose({ getElement, boardSize: size, Rescale, pieces, fontScale });
</script>

<style lang="postcss">
.cw-chessboard {
  user-select: none;
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  background-color: transparent;
}

.cw-chessboard.active {
  touch-action: none;
  -o-touch-action: none;
  -ms-touch-action: none;
  -webkit-touch-action: none;
}

.cw-chessboard-inner {
  position: relative;
  height: 100%;
  width: 100%;
  border-radius: inherit;
}

.cw-wrapper {
  display: inline-block;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
}

.cw-container {
  display: inline-block;
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;

  .pieces {
    display: contents;

    piece {
      position: absolute;
      top: 0;
      left: 0;
      width: 12.5%;
      height: 12.5%;
      background-size: cover;
      z-index: 5;
      will-change: transform, opacity;
      user-select: none;
      cursor: grab;

      &:active {
        cursor: grabbing;
      }
    }
  }
}
</style>
