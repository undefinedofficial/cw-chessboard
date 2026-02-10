<template>
  <ChessboardContainer>
    <div class="cw-wrapper" :class="[coordinates, { interactive }]">
      <div class="cw-inner">
        <slot name="before" />
        <div
          class="cw-chessboard"
          v-on="
      interactive
        ? {
            pointerdown: onPointerStart,
            pointermove: onPointerMove,
            pointerup: onPointerEnd,
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

<script lang="ts" setup vapor>
import type { Ref } from "vue";
import { onMounted, watch, useTemplateRef, shallowRef, ref } from "vue";
import type {
  ChessboardProps,
  ChangeEvent,
  Color,
  DoneFn,
  Piece,
  Point,
} from "../types";
import { usePieces } from "../hooks/pieces";
import type { UseChessboardPieces } from "../hooks/pieces";
import { provideContext } from "../hooks/context";
import {
  invertPoint,
  isWhiteSquare,
  normalizePoint,
  pointEqual,
  pointToSquare,
  squareToString,
  squareValid,
} from "../utils";
import ChessboardContainer from "./ChessboardContainer.vue";

const props = withDefaults(defineProps<ChessboardProps>(), {
  orientation: "w",
  coordinates: "outside",
  duration: 300,
  visibility: "all",
  mode: "auto",
  enableColor: "all",
});

const emit = defineEmits<{
  beforeMove: [square: string, done: DoneFn];
  afterMove: [fromSquare: string, toSquare: string, done: DoneFn];
  cancelMove: [square: string];
  enterSquare: [square: string];
  leaveSquare: [square: string];
  ready: [UseChessboardPieces];
  moves: [moves: ChangeEvent[]];
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
  async ({ fen, orientation, alphaPiece, duration, visibility }) => {
    if (fen) pieces.setFen(fen, true);
    pieces.setOrientation(orientation, true);
    pieces.setVisibility(visibility, true);
    pieces.setIsAlphaPiece(alphaPiece);
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
  pieces.setIsAlphaPiece(props.alphaPiece);
  emit("ready", pieces);
});

const _onPointerDown = (e: PointerEvent)=> {
    if (!e.isPrimary || this._disabled) return;

    e.stopPropagation();

    const point = this._getPosition(e);

    const square = pointToSquare(point, this.orientation);
    if (!squareValid(square)) return;

    if (this._fromSquare && pointEqual(this._fromSquare, square)) {
      this._cancelMove();
      e.preventDefault();
      return;
    }

    const fromSquare = squareToString(square);

    const piece = this._board[fromSquare].querySelector<HTMLElement>(`[data-piece]`);
    const pieceCode = symbolToPiece(piece?.dataset.piece! as PieceCode) as PieceSymbol;
    const color = piece?.dataset.color as Color;

    // Click for selecting a chess piece
    if (!piece || !this._isEnabledColor(color)) return;

    // If color piece same as current piece then reset moving piece and set it as active piece.
    if (color === this._fromSquare?.color) this._cancelMove(false);

    if (this._fromSquare && color !== this._fromSquare?.color) return;

    this._isDragging = true;

    if (!this._emit("beforemove", { from: fromSquare, piece: pieceCode }, { cancelable: true })) return;

    this._fromSquare = {
      x: square.x,
      y: square.y,
      name: pieceCode as PieceSymbol,
      color,
    };
    this._onEnterSquare(this._fromSquare);

    (e.currentTarget as HTMLElement)?.setPointerCapture(e.pointerId);
  }
  const _onPointerMove= (e: PointerEvent) =>{
    if (!e.isPrimary || this._disabled) return;

    const point = this._getPosition(e);
    const square = pointToSquare(point, this.orientation);
    if (squareValid(square)) {
      const squareStr = squareToString(square);
      if (this._overSquare !== squareStr) {
        this._emit("oversquare", { square: squareStr });
        if (this._overSquare) this._emit("outsquare", { square: this._overSquare });
        this._overSquare = squareStr;
      }
    }

    e.stopPropagation();

    if (!this._fromSquare || !this._isDragging || this._isRejectMove()) return;

    const squareWidth = point.width / 8;
    const squareHeight = point.height / 8;

    const halfX = point.x - squareWidth / 2;
    const halfY = point.y - squareHeight / 2;
    const squareString = squareToString(this._fromSquare);

    const lastHoldPress = this._holdPress;
    if (!lastHoldPress) {
      const alignX = this._fromSquare.x * squareWidth;
      const alignY = this._fromSquare.y * squareHeight;
      const offsetX = Math.abs(halfX - alignX);
      const offsetY = Math.abs(halfY - alignY);

      this._holdPress = offsetX > Board.DRAGGING_SENSITIVE || offsetY > Board.DRAGGING_SENSITIVE;
      if (lastHoldPress !== this._holdPress) {
        if (this._holdPress) {
          const piece = this._board[squareString].querySelector<HTMLElement>(`[data-piece]`);

          if (!piece) throw new Error("Piece not found");
          this._ghostElement = piece;

          this._pieceElement = piece.cloneNode() as HTMLElement;
          this._pieceElement.classList.add("moving", "dragging");
          this._ghostElement?.classList.toggle("secondary", true);

          this._board[squareString].appendChild(this._pieceElement);
        } else {
          this._ghostElement?.classList.remove("secondary");
          this._ghostElement = undefined;
          this._pieceElement?.remove();
          this._pieceElement = undefined;
        }
      }
    }

    if (this._holdPress && !this._isRejectMove() && this._pieceElement) {
      const { x, y, height, width } = this._board[squareString].getBoundingClientRect();
      this._pieceElement.style.transform = `translate3d(${e.clientX - x - width / 2}px, ${e.clientY - y - height / 2}px, 0) scale(var(--cw-p-piece-drag-scale))`;
    }

    if (this.alignPiece && this._pieceElement) {
      this._pieceElement.style.transform = `translate3d(${(square.x - this._fromSquare.x) * 100}%, ${(square.y - this._fromSquare.y) * 100}%, 0) scale(var(--cw-p-piece-drag-scale))`;
    }

    if (!squareValid(square)) return;

    this._onEnterSquare(square);
  }
  const _onPointerUp= (e: PointerEvent) =>{
    if (!e.isPrimary || this._disabled) return;

    this._isDragging = false;

    e.stopPropagation();
    if (this._isRejectMove()) {
      return this._cancelMove();
    }

    const point = this._getPosition(e);
    const square = pointToSquare(point, this.orientation);

    if (!squareValid(square)) {
      return this._cancelMove();
    }

    // this need edit...
    if (this._ghostElement) {
      this._ghostElement?.classList.remove("secondary");
      this._ghostElement = undefined;
    }
    if (this._pieceElement) {
      this._pieceElement.remove();
      this._pieceElement = undefined;
    }

    // if (holdPress && _fromSquare && pointEqual(_fromSquare, square)) {
    //   onCancelMove(chessboard, _fromSquare);
    //   return;
    // }

    // Click for moving selected a chess piece
    if (!this._fromSquare) return;

    const toSquare = squareToString(square);

    const piece = this._board[toSquare].querySelector<HTMLElement>(`[data-piece]`);

    if (piece?.dataset.color === this._fromSquare.color) {
      return;
    }

    // save the current position of the current piece in the current square before remove

    // const holdPress = !this._holdPress;
    // done is true if the move was successful and not emit cancel event else emit cancel event
    this._cancelMove(
      !this._emit("aftermove", {
        from: squareToString(this._fromSquare),
        to: toSquare,
        piece: piece?.dataset.piece!,
        type: this._holdPress ? "drag" : "click",
      }),
    );
  }

  const _onPointerCancel = (e: PointerEvent)=> {
    e.stopPropagation();
    this._cancelMove(true);
  }

  function _cancelMove(emited = true) {
    if (!this._fromSquare) return;

    // Click for cancel selected a chess piece
    const squareString = squareToString(this._fromSquare);
    if (emited) this._emit("cancelmove", { square: squareString });

    this._enterSquare = null;
    this._fromSquare = null;
    this._holdPress = false;
    this._isDragging = false;

    if (this._ghostElement) {
      this._ghostElement?.classList.remove("secondary");
      this._ghostElement = undefined;
    }
    if (this._pieceElement) {
      this._pieceElement.remove();
      this._pieceElement = undefined;
    }
  }

  function _isEnabledColor = (color: Color) => this.turn === "all" || this.turn === color;

  function _isRejectMove() {
    if (this.mode === "auto") return false;
    return (this.mode === "press" && this._holdPress) || (this.mode === "move" && !this._holdPress);
  }

  function _onEnterSquare(square: Point) {
    if (this._enterSquare && pointEqual(this._enterSquare, square)) return;

    if (this._enterSquare) this._emit("leavesquare", { square: squareToString(this._enterSquare) });
    this._emit("entersquare", { square: squareToString(square) });
    this._enterSquare = square;
  }

  function _getPosition(e: PointerEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y, width: rect.width, height: rect.height };
  }

defineExpose({   pieces });
</script>

<style>
.cw-wrapper,
.cw-inner {
  --cw-square-color-dark: hsl(145deg 32% 44%);
  --cw-square-color-light: hsl(51deg 24% 84%);
  /* --cw-square-color-dark-hover: hsl(144deg 75% 44%);
  --cw-square-color-light-hover: hsl(52deg 98% 70%);
  --cw-square-color-dark-active: hsl(142deg 77% 43%);
  --cw-square-color-light-active: hsl(50deg 95% 64%);
  --cw-outline-color-dark-active: hsl(138deg 85% 53% / 95%);
  --cw-outline-color-light-active: hsl(66deg 97% 72% / 95%);
  --cw-outline-color-focus: hsl(30deg 94% 55% / 90%);
  --cw-outline-blur-radius: 3px;
  --cw-outline-spread-radius: 4px; */
  --cw-coords-font-family: sans-serif;
  --cw-coords-scale: 4;
  --cw-outer-gutter-width: 4%;
  --cw-inner-border-width: 1px;
  --cw-inner-border-radius: 8px;
  --cw-coords-inside-coord-padding-left: 0.5%;
  --cw-coords-inside-coord-padding-right: 0.5%;
  /* --cw-move-target-marker-color-dark-square: hsl(144deg 64% 9% / 90%); */
  /* --cw-move-target-marker-color-light-square: hsl(144deg 64% 9% / 90%); */
  /* --cw-move-target-marker-radius: 24%; */
  /* --cw-move-target-marker-radius-occupied: 82%; */
  --cw-ghost-piece-opacity: 0.35;
  --cw-piece-drag-z-index: 9999;
  --cw-piece-drag-coarse-scale: 2.4;
  --cw-piece-padding: 0.3%;
  /* --cw-arrow-color-primary: hsl(40deg 100% 50% / 80%); */
  /* --cw-arrow-color-secondary: hsl(7deg 93% 61% / 80%); */
  --cw-p-piece-drag-scale: 1;

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
  font-size: calc(var(--cw-coords-font-size) * 1cqw);
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
  /* --cw-p-label-color: var(--cw-square-color-light);
  --cw-p-square-color-hover: var(--cw-square-color-dark-hover);
  --cw-p-move-target-marker-color: var(--cw-move-target-marker-color-dark-square);
  --cw-p-square-color-active: var(--cw-square-color-dark-active);
  --cw-p-outline-color-active: var(--cw-outline-color-dark-active); */
}
[data-square-color="white"] {
  --cw-p-square-color: var(--cw-square-color-light);
  background-color: var(--cw-p-square-color);
  /* --cw-p-label-color: var(--cw-square-color-dark);
  --cw-p-square-color-hover: var(--cw-square-color-light-hover);
  --cw-p-move-target-marker-color: var(--cw-move-target-marker-color-light-square);
  --cw-p-square-color-active: var(--cw-square-color-light-active);
  --cw-p-outline-color-active: var(--cw-outline-color-light-active); */
}

.coords {
  position: absolute;
  display: none;
  font-family: var(--cw-coords-font-family);
  /* font-size: var(--cw-coords-font-size); */
  font-size: calc(1cqw * var(--cw-coords-scale));
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

[data-square] .piece.moving {
  position: absolute;
  z-index: 15;
  left: 0;
  top: 0;
}

[data-square] .piece.secondary {
  z-index: 5;
  opacity: var(--cw-ghost-piece-opacity);
}

[data-square] .piece.dragging {
  z-index: var(--cw-piece-drag-z-index);
}

@media (pointer: coarse) {
  [data-square] .piece.moving {
    --cw-p-piece-drag-scale: var(--cw-piece-drag-coarse-scale);
  }
}

.bb {
  background-image: url("../assets/pieces/staunty/bb.svg");
}

.bk {
  background-image: url("../assets/pieces/staunty/bk.svg");
}

.bn {
  background-image: url("../assets/pieces/staunty/bn.svg");
}

.bp {
  background-image: url("../assets/pieces/staunty/bp.svg");
}

.bq {
  background-image: url("../assets/pieces/staunty/bq.svg");
}

.br {
  background-image: url("../assets/pieces/staunty/br.svg");
}

.wb {
  background-image: url("../assets/pieces/staunty/wb.svg");
}

.wk {
  background-image: url("../assets/pieces/staunty/wk.svg");
}

.wn {
  background-image: url("../assets/pieces/staunty/wn.svg");
}

.wp {
  background-image: url("../assets/pieces/staunty/wp.svg");
}

.wq {
  background-image: url("../assets/pieces/staunty/wq.svg");
}

.wr {
  background-image: url("../assets/pieces/staunty/wr.svg");
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
