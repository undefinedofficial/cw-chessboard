<template>
  <ChessboardContainer>
    <div class="cw-wrapper" :class="[coordinates, { interactive }]">
      <div class="cw-inner">
        <slot name="before" />
        <div
          class="cw-chessboard"
          v-on="interactive
        ? {
            pointerdown: onPointerDown,
            pointermove: onPointerMove,
            pointerup: onPointerUp,
            pointercancel: onPointerCancel,
            contextmenu: (e: Event) => e.preventDefault(),
          }
        : {}
    "
        >
          <table class="cw-grid">
            <tr v-for="i of 8" :key="i" role="row">
              <td
                v-for="j of 8"
                :key="j"
                role="cell"
                :data-square="
                  squareToString(invertPoint({ x: j - 1, y: i - 1 }, color))
                "
                :data-square-color="
                  isWhiteSquare(j - 1, i - 1) ? 'white' : 'black'
                "
              ></td>
            </tr>
          </table>
          <slot />
          <div
            ref="piecesContainer"
            class="pieces"
            style="display: contents"
          ></div>
        </div>
        <slot name="after" />
      </div>
      <div class="coords file" role="presentation" aria-hidden="true">
        <div
          v-for="i of 8"
          :key="i"
          class="coord"
          :class="i % 2 === 0 ? 'light' : 'dark'"
        >
          {{ String.fromCharCode((color === "w" ? i - 1 : 8 - i) + 97) }}
        </div>
      </div>
      <div class="coords rank" role="presentation" aria-hidden="true">
        <div
          v-for="i of 8"
          :key="i"
          class="coord"
          :class="i % 2 === 0 ? 'dark' : 'light'"
        >
          {{ color === "w" ? 9 - i : i }}
        </div>
      </div>
    </div>
  </ChessboardContainer>
</template>

<script lang="ts">
const DRAGGING_SENSITIVE = 50;
</script>

<script lang="ts" setup>
import { onMounted, watch, useTemplateRef, shallowRef } from "vue";
import ChessboardContainer from "./ChessboardContainer.vue";
import { provideContext } from "../hooks/context";
import { usePieces, type UseChessboardPieces } from "../hooks/pieces";

import type {
  ChessboardProps,
  ChangeEvent,
  Color,
  DoneFn,
  Piece,
  Point,
  PieceCode,
  PieceSymbol,
  Square,
  InputType,
} from "../types";
import {
  invertPoint,
  isWhiteSquare,
  pointEqual,
  pointToSquare,
  squareToString,
  squareValid,
  symbolToPiece,
} from "../utils/square";

const props = withDefaults(defineProps<ChessboardProps>(), {
  orientation: "w",
  coordinates: "outside",
  duration: 300,
  visibility: "all",
  mode: "auto",
  turn: "all",
});

const emit = defineEmits<{
  ready: [UseChessboardPieces];
  moves: [moves: ChangeEvent[]];

  beforemove: [square: string, piece: PieceSymbol, done: DoneFn];
  aftermove: [
    fromSquare: string,
    toSquare: string,
    type: InputType,
    done: DoneFn
  ];
  cancelmove: [square: string];
  entersquare: [square: string];
  leavesquare: [square: string];
  oversquare: [square: string];
  outsquare: [square: string];
}>();

const color = shallowRef<Color>(props.orientation);
const piecesContainer = useTemplateRef("piecesContainer");

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
  async ({ fen, orientation, duration, visibility }) => {
    if (fen) pieces.setFen(fen, true);
    pieces.setOrientation(orientation, true);
    pieces.setVisibility(visibility, true);
    pieces.setDuration(duration);
  },
  { deep: true }
);

provideContext({
  orientation: color,
  pieces,
});

onMounted(() => {
  pieces.setContainer(piecesContainer.value!);
  pieces.setDuration(props.duration);
  if (props.fen) pieces.setFen(props.fen);
  pieces.setOrientation(props.orientation);
  pieces.setVisibility(props.visibility);
  emit("ready", pieces);
});

const queryPieceElement = (square: Square) =>
  piecesContainer.value?.querySelector<HTMLDivElement>(
    `.piece[data-square=${square}]`
  );

let _overSquare: string | null;
let _fromSquare: Piece | null;
let _enterSquare: Point | null;
let _isDragging: boolean;
let _holdPress: boolean;
let _ghostElement: HTMLElement | undefined;
let _pieceElement: HTMLElement | undefined;
let _disabled: boolean | undefined;

function onPointerDown(e: PointerEvent) {
  if (!e.isPrimary || _disabled) return;

  // e.stopPropagation();

  const point = _getPosition(e);

  const square = pointToSquare(point, color.value);
  if (!squareValid(square)) return;

  if (_fromSquare && pointEqual(_fromSquare, square)) {
    _cancelMove();
    e.preventDefault();
    return;
  }

  const fromSquare = squareToString(square);

  const piece = pieces.getPieceByPoint(square);

  // Click for selecting a chess piece
  if (!piece || !_isEnabledColor(piece?.color!)) return;

  // If color piece same as current piece then reset moving piece and set it as active piece.
  if (piece.color === _fromSquare?.color) _cancelMove(false);

  if (_fromSquare && piece.color !== _fromSquare?.color) return;

  _isDragging = true;

  emit("beforemove", fromSquare, piece.name, (is) => {
    if (!is) return;

    _fromSquare = {
      x: square.x,
      y: square.y,
      ...piece,
    };
    _onEnterSquare(_fromSquare);

    (e.currentTarget as HTMLElement)?.setPointerCapture(e.pointerId);
  });
}
function onPointerMove(e: PointerEvent) {
  if (!e.isPrimary || _disabled) return;

  const point = _getPosition(e);
  const square = pointToSquare(point, color.value);
  if (squareValid(square)) {
    const squareStr = squareToString(square);
    if (_overSquare !== squareStr) {
      emit("oversquare", squareStr);
      if (_overSquare) emit("outsquare", _overSquare);
      _overSquare = squareStr;
    }
  }

  // e.stopPropagation();

  if (!_fromSquare || !_isDragging || _isRejectMove()) return;

  const squareWidth = point.width / 8;
  const squareHeight = point.height / 8;

  const halfX = point.x - squareWidth / 2;
  const halfY = point.y - squareHeight / 2;
  const squareString = squareToString(_fromSquare);

  const lastHoldPress = _holdPress;
  if (!lastHoldPress) {
    const alignX = _fromSquare.x * squareWidth;
    const alignY = _fromSquare.y * squareHeight;
    const offsetX = Math.abs(halfX - alignX);
    const offsetY = Math.abs(halfY - alignY);

    _holdPress = offsetX > DRAGGING_SENSITIVE || offsetY > DRAGGING_SENSITIVE;
    if (lastHoldPress !== _holdPress) {
      if (_holdPress) {
        const piece = queryPieceElement(squareString);

        if (!piece) throw new Error("Piece not found");
        _ghostElement = piece;

        _pieceElement = piece.cloneNode() as HTMLElement;
        _pieceElement.classList.add("moving", "dragging");
        _ghostElement?.classList.toggle("secondary", true);

        piecesContainer.value?.appendChild(_pieceElement);
      } else {
        _ghostElement?.classList.remove("secondary");
        _ghostElement = undefined;
        _pieceElement?.remove();
        _pieceElement = undefined;
      }
    }
  }

  if (_holdPress && !_isRejectMove() && _pieceElement && _ghostElement) {
    const { width, height } = _ghostElement!.getBoundingClientRect();
    _pieceElement.style.transform = `translate3d(${point.x - width / 2}px, ${
      point.y - height / 2
    }px, 0) scale(var(--cw-p-piece-drag-scale))`;
  }

  if (!squareValid(square)) return;

  if (props.alignPiece && _pieceElement) {
    _pieceElement.style.transform = `translate3d(${square.x * 100}%, ${
      square.y * 100
    }%, 0) scale(var(--cw-p-piece-drag-scale))`;
  }

  _onEnterSquare(square);
}
function onPointerUp(e: PointerEvent) {
  if (!e.isPrimary || _disabled) return;

  _isDragging = false;

  // e.stopPropagation();
  if (_isRejectMove()) return _cancelMove();

  const point = _getPosition(e);
  const square = pointToSquare(point, color.value);

  if (!squareValid(square)) return _cancelMove();

  // this need edit...
  if (_ghostElement) {
    _ghostElement?.classList.remove("secondary");
    _ghostElement = undefined;
  }
  if (_pieceElement) {
    _pieceElement.remove();
    _pieceElement = undefined;
  }

  // if (holdPress && _fromSquare && pointEqual(_fromSquare, square)) {
  //   onCancelMove(chessboard, _fromSquare);
  //   return;
  // }

  // Click for moving selected a chess piece
  if (!_fromSquare) return;

  const piece = pieces.getPieceByPoint(square);
  if (piece?.color === _fromSquare.color) return;

  // save the current position of the current piece in the current square before remove

  // const holdPress = !this._holdPress;
  // done is true if the move was successful and not emit cancel event else emit cancel event

  emit(
    "aftermove",
    squareToString(_fromSquare),
    squareToString(square),
    _holdPress ? "drag" : "click",
    (is) => _cancelMove(!is)
  );
}

function onPointerCancel(e: PointerEvent) {
  // e.stopPropagation();
  _cancelMove(true);
}

function _cancelMove(emited = true) {
  if (!_fromSquare) return;

  // Click for cancel selected a chess piece
  const squareString = squareToString(_fromSquare);
  if (emited) emit("cancelmove", squareString);

  _enterSquare = null;
  _fromSquare = null;
  _holdPress = false;
  _isDragging = false;

  if (_ghostElement) {
    _ghostElement?.classList.remove("secondary");
    _ghostElement = undefined;
  }
  if (_pieceElement) {
    _pieceElement.remove();
    _pieceElement = undefined;
  }
}

function _isEnabledColor(color: Color) {
  return props.turn === "all" || props.turn === color;
}

function _isRejectMove() {
  if (props.mode === "auto") return false;
  return (
    (props.mode === "press" && _holdPress) ||
    (props.mode === "move" && !_holdPress)
  );
}

function _onEnterSquare(square: Point) {
  if (_enterSquare && pointEqual(_enterSquare, square)) return;

  if (_enterSquare) emit("leavesquare", squareToString(_enterSquare));
  emit("entersquare", squareToString(square));
  _enterSquare = square;
}

function _getPosition(e: PointerEvent) {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  return { x, y, width: rect.width, height: rect.height };
}

defineExpose({ pieces });
</script>

<style>
.cw-wrapper,
.cw-inner {
  position: relative;
  aspect-ratio: 1;
}
.cw-wrapper {
  border-radius: var(--cw-inner-border-radius);
  container-name: cw-wrapper;
  container-type: inline-size;
}

.cw-wrapper.interactive {
  touch-action: none;
}

.cw-wrapper.outside {
  padding: var(--cw-outer-gutter-width);
  background-color: var(--cw-square-color-light);
}

.cw-chessboard {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: var(--cw-inner-border-width) solid
    var(--cw-inner-border-color, var(--cw-square-color-dark));
  border-collapse: collapse;
  table-layout: fixed;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;

  font-family: var(--cw-coords-font-family);
  font-size: calc(var(--cw-coords-font-scale) * 1cqw);
}
.cw-chessboard > [data-square],
.cw-chessboard .piece {
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  height: 12.5%;
  width: 12.5%;
}

.cw-grid {
  width: 100%;
  pointer-events: none;
}

.cw-grid > tr {
  vertical-align: middle;
}
.cw-grid > tr > td {
  position: relative;
  padding: 12.5% 0 0;
}

[data-square-color="black"] {
  --cw-p-square-color: var(--cw-square-color-dark);
  background-color: var(--cw-p-square-color);
}
[data-square-color="white"] {
  --cw-p-square-color: var(--cw-square-color-light);
  background-color: var(--cw-p-square-color);
}

.coords {
  position: absolute;
  display: none;
  font-family: var(--cw-coords-font-family);
  font-size: calc(1cqw * var(--cw-coords-font-scale));
  pointer-events: none;
  touch-action: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

.coord {
  display: flex;
  box-sizing: border-box;
}

.coords.file > .coord {
  width: 12.5%;
}

.coords.rank {
  flex-direction: column;
}

.coords.rank > .coord {
  height: 12.5%;
}

.cw-wrapper.outside > .coords {
  display: flex;
  color: var(--cw-square-color-dark);
}

.cw-wrapper.outside > .coords > .coord {
  align-items: center;
  justify-content: center;
}

.cw-wrapper.outside > .coords.file {
  right: var(--cw-outer-gutter-width);
  bottom: 0;
  left: var(--cw-outer-gutter-width);
  width: calc(100% - 2 * var(--cw-outer-gutter-width));
  height: var(--cw-outer-gutter-width);
}

.cw-wrapper.outside > .coords.rank {
  top: var(--cw-outer-gutter-width);
  bottom: var(--cw-outer-gutter-width);
  left: 0;
  width: var(--cw-outer-gutter-width);
  height: calc(100% - 2 * var(--cw-outer-gutter-width));
}

.cw-wrapper.inside > .coords {
  display: flex;
  width: 100%;
  height: 100%;
  inset: 0;
}

.cw-wrapper.inside > .coords > .coord.light {
  color: var(--cw-square-color-dark);
}

.cw-wrapper.inside > .coords > .coord.dark {
  color: var(--cw-square-color-light);
}

.cw-wrapper.inside > .coords.file > .coord {
  align-items: flex-end;
  justify-content: flex-end;
  padding-right: var(--cw-coords-inside-coord-padding-right);
}

.cw-wrapper.inside > .coords.rank > .coord {
  padding-left: var(--cw-coords-inside-coord-padding-left);
}

/* [data-square] .piece,
[data-square] .slot {
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
} */

.piece {
  z-index: 10;
  box-sizing: border-box;
  padding: var(--cw-piece-padding);

  background-origin: content-box;
  background-repeat: no-repeat;
  background-size: cover;
  pointer-events: none;
}

.piece.moving[data-square] {
  z-index: 15;
}

.piece.secondary[data-square] {
  z-index: 5;
  opacity: var(--cw-ghost-piece-opacity);
}

[data-square] .piece.dragging {
  z-index: var(--cw-piece-drag-z-index);
}

@media (pointer: coarse) {
  .piece.moving[data-square] {
    --cw-p-piece-drag-scale: var(--cw-piece-drag-coarse-scale);
  }
}

.bb {
  background-image: var(--cw-piece-bb);
}

.bk {
  background-image: var(--cw-piece-bk);
}

.bn {
  background-image: var(--cw-piece-bn);
}

.bp {
  background-image: var(--cw-piece-bp);
}

.bq {
  background-image: var(--cw-piece-bq);
}

.br {
  background-image: var(--cw-piece-br);
}

.wb {
  background-image: var(--cw-piece-wb);
}

.wk {
  background-image: var(--cw-piece-wk);
}

.wn {
  background-image: var(--cw-piece-wn);
}

.wp {
  background-image: var(--cw-piece-wp);
}

.wq {
  background-image: var(--cw-piece-wq);
}

.wr {
  background-image: var(--cw-piece-wr);
}

.dialog {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 15;
}

.dialog .container {
  position: absolute;
  left: 0;
  display: flex;
  width: calc(100% / 8);
  height: 50%;
}
.dialog.top .container {
  flex-direction: column;
  top: 0;
}

.dialog.bottom .container {
  flex-direction: column-reverse;
  bottom: 0;
}

.dialog .container .square {
  height: 100%;
  width: 100%;
  background: rgba(150, 150, 150, 0.4);
  padding: 0;
  margin: 0;
  outline: 0;
  border: 0;
  cursor: pointer;
  transition: background ease-in-out 0.05s;
}

.dialog .container .square:hover {
  background: rgba(120, 120, 120, 0.4);
}

.dialog .container .square .piece {
  display: block;
  height: 100%;
  width: 100%;
  background-size: cover;
  transition: transform ease-in-out 0.05s;
}
.dialog .container .square:hover .piece {
  transform: scale(1.2);
}
</style>
