<template>
  <div class="pieces move-field" v-if="activePiece">
    <component
      is="piece"
      class="active"
      :style="{
        transform: `translate3d(${activePiece.x}px, ${activePiece.y}px, 0px)`,
        zIndex: 100,
      }"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" version="1.1">
        <use :href="`#${piecePack}-${activePiece.color}${activePiece.name}`"></use>
      </svg>
    </component>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import type { Color, DoneFn, InputColor, Piece, Point } from "../types";
import {
  invertPoint,
  normalizePoint,
  pointEqual,
  pointToSquare,
  squareToString,
  squareValid,
} from "../utils/point";
import { useControl } from "../hooks/control";
import { getPointInElement } from "../utils";
import { useContext } from "../hooks/context";
import type { Ref } from "vue";

export interface ChessboardControlProps {
  mode?: "auto" | "move" | "press";
  enableColor?: InputColor;
  alignPiece?: boolean;
}

const props = withDefaults(defineProps<ChessboardControlProps>(), {
  mode: "auto",
  enableColor: "all",
});
const emits = defineEmits<{
  beforeMove: [square: string, done: DoneFn];
  afterMove: [fromSquare: string, toSquare: string, done: DoneFn];
  cancelMove: [square: string];
  enterSquare: [square: string];
  leaveSquare: [square: string];

  dropMove: [square: string];
  dropEnd: [piece: string, square: string];
}>();

const DRAGGING_SENSITIVE = 32;

const { chessboard, pieces, pieceWhitePack, pieceBlackPack, orientation } = useContext();

let fromSquare: Piece | null = null;
const activePiece = ref<Piece | null>(null);

const piecePack = computed(() =>
  activePiece.value?.color == "w" ? pieceWhitePack.value : pieceBlackPack.value
);

const isEnabledColor = (color: Color) => props.enableColor === "all" || props.enableColor === color;

let enterSquare: Point | null = null;
const checkEnterSquare = (square: Point) => {
  if (enterSquare && pointEqual(enterSquare, square)) return;

  if (enterSquare) emits("leaveSquare", squareToString(enterSquare));
  emits("enterSquare", squareToString(square));
  enterSquare = square;
};
let holdPress = false;
const isRejectMove = () => {
  if (props.mode === "auto") return false;
  return (props.mode === "press" && holdPress) || (props.mode === "move" && !holdPress);
};

function alphaPiece(piece: Piece, is: boolean) {
  pieces.setAlphaPiece(
    piece,
    piece.color === "w" ? (piece.name.toUpperCase() as any) : piece.name,
    is
  );
}

function onCancelMove(from: Piece, emited = true) {
  // Click for cancel selected a chess piece
  if (emited) emits("cancelMove", squareToString(from));
  alphaPiece(from, false);
  activePiece.value = null;
  enterSquare = null;
  fromSquare = null;
}

useControl({
  el: chessboard as Ref<HTMLElement>,
  onStart: (point) => {
    holdPress = false;
    const square = pointToSquare(point, orientation.value, point);

    if (!squareValid(square)) return false;

    if (fromSquare && pointEqual(fromSquare, square)) {
      onCancelMove(fromSquare);
      return false;
    }

    const piece = pieces.getPieceByPoint(square);
    // Click for selecting a chess piece
    if (!piece || !isEnabledColor(piece.color)) return true;

    emits("beforeMove", squareToString(square), (done: boolean) => {
      if (!done) return;

      fromSquare = {
        x: square.x,
        y: square.y,
        name: piece.name,
        color: piece.color,
      };
      checkEnterSquare(pointToSquare(point, orientation.value, point));
    });
    return true;
  },
  onMove: (point) => {
    if (!fromSquare) return;

    const squareWidth = point.width / 8;
    const squareHeight = point.height / 8;

    const halfX = point.x - squareWidth / 2;
    const halfY = point.y - squareHeight / 2;

    const lastHoldPress = holdPress;
    if (!holdPress) {
      const alignX = fromSquare.x * squareWidth;
      const alignY = fromSquare.y * squareHeight;
      const offsetX = Math.abs(halfX - alignX);
      const offsetY = Math.abs(halfY - alignY);

      holdPress = offsetX > DRAGGING_SENSITIVE || offsetY > DRAGGING_SENSITIVE;
      if (lastHoldPress !== holdPress) alphaPiece(fromSquare, holdPress);
    }

    if (holdPress && !isRejectMove()) {
      activePiece.value = {
        name: fromSquare.name,
        color: fromSquare.color,
        x: halfX,
        y: halfY,
      };
    } else {
      const { x, y } = invertPoint(fromSquare, orientation.value);
      const alignX = x * squareWidth;
      const alignY = y * squareHeight;
      activePiece.value = {
        name: fromSquare.name,
        color: fromSquare.color,
        x: alignX,
        y: alignY,
      };
    }
    if (isRejectMove()) return;

    if (props.alignPiece && activePiece.value) {
      const square = normalizePoint(point, point);
      const alignX = square.x * squareWidth;
      const alignY = square.y * squareHeight;
      activePiece.value.x = alignX;
      activePiece.value.y = alignY;
    }

    const square = pointToSquare(point, orientation.value, point);
    if (!squareValid(square)) return;
    checkEnterSquare(square);
  },
  onEnd: (point) => {
    if (isRejectMove()) {
      if (fromSquare) onCancelMove(fromSquare);
      return;
    }

    const square = pointToSquare(point, orientation.value, point);

    if (!squareValid(square)) {
      // console.log("Invalid square", fromSquare);

      if (fromSquare) onCancelMove(fromSquare);
      return;
    }

    // this need edit...
    activePiece.value = null;
    // if (holdPress && fromSquare && pointEqual(fromSquare, square)) {
    //   onCancelMove(fromSquare);
    //   return;
    // }

    // Click for moving selected a chess piece
    if (!fromSquare) return;

    const piece = pieces.getPieceByPoint(square);
    if (piece && piece.color === fromSquare.color) {
      alphaPiece(fromSquare, false);
      return;
    }

    emits(
      "afterMove",
      squareToString(fromSquare),
      squareToString(square),
      async (done: boolean) => {
        if (!fromSquare) return console.warn("Cannot move from square ");

        // save the current position of the current piece in the current square before remove
        const from = fromSquare;
        // done is true if the move was successful and not emit cancel event else emit cancel event
        onCancelMove(from, !done);

        if (done) await pieces.movePiece(from, square, !holdPress);
      }
    );
  },
  onCancel: () => {
    if (fromSquare) onCancelMove(fromSquare, true);
  },
});

function onDrop(e: DragEvent) {
  const el = e.currentTarget as HTMLElement;
  const data = e.dataTransfer?.getData("text/plain");

  if (!data?.includes("piece ")) return;

  const point = getPointInElement(el, e);
  const square = pointToSquare(point, orientation.value, point);

  if (!squareValid(square)) return;

  const piece = data.split(" ")[1];

  emits("dropEnd", piece, squareToString(square));
}

function onDragOver(e: DragEvent) {
  e.preventDefault();

  const el = e.currentTarget as HTMLElement;
  const point = getPointInElement(el, e);
  const square = pointToSquare(point, orientation.value, point);

  if (!squareValid(square)) return;

  emits("dropMove", squareToString(square));
}

onMounted(() => {
  chessboard.value?.addEventListener("drop", onDrop);
  chessboard.value?.addEventListener("dragover", onDragOver);
});

onBeforeUnmount(() => {
  chessboard.value?.removeEventListener("drop", onDrop);
  chessboard.value?.removeEventListener("dragover", onDragOver);
});

defineExpose({ activePiece });
</script>

<style>
.pieces.move-field .active {
  cursor: grabbing !important;
}
</style>
