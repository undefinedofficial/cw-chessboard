<template>
  <div class="chessboard-preview">
    <Chessboard
      :fen="fenProxy"
      :orientation="orientation"
      :coordinates-dir="coordMode"
      :coordinates="coordinates"
      :duration="duration"
      :visibility="visibility"
      :alignPiece="alignPiece"
      :interactive="!viewonly"
      :style="style"
      ref="chessboardEl"
      @beforemove="onBeforeMove"
      @aftermove="onAfterMove"
      @cancelmove="onCancelMove($event)"
      @entersquare="onEnterSquare($event)"
      @leavesquare="onLeaveSquare($event)"
    >
      <ChessboardCircle class="text-red-500/80" square="a4" />
      <ChessboardSquare square="a5" class="bg-sky-700" />
      <ChessboardFrame square="b5" class="text-green-700" />
      <ChessboardArrow
        square="b4"
        toSquare="c4"
        class="text-violet-700"
        :size="arrowSize"
      />
      <ChessboardDot square="c5" class="text-purple-800" />
      <ChessboardSquare
        square="a6"
        class="flex flex-col justify-center items-center overflow-hidden text-center text-xs"
      >
        best<br />
        chess <br />
        board
      </ChessboardSquare>
      <ChessboardSquare
        square="b6"
        class="flex justify-center items-center text-2xl"
        above
      >
        1.0
      </ChessboardSquare>

      <ChessboardSquare
        class="bg-cyan-400/60"
        v-for="move in lastMove"
        :square="move"
      />
      <ChessboardFrame
        class="text-black/60"
        v-if="moveFromSquare"
        :square="moveFromSquare"
      />
      <ChessboardFrame
        class="text-black/60 transition-all"
        v-if="moveToSquare && moveToSquare !== moveFromSquare"
        :square="moveToSquare"
      />
      <ChessboardDot
        class="text-black/60 transition-all"
        v-for="move in moveVariants"
        :square="move"
      />

      <PromotionDialog ref="promotionDialogEl" />
    </Chessboard>
  </div>
  <div class="chessboard-config m-5">
    <div class="flex flex-col w-full h-full space-y-3">
      <ControlRadio
        title="coordinates"
        name="moveMode"
        v-model="coordinates"
        :items="['none', 'inside', 'outside']"
      />
      <ControlRadio
        title="move mode"
        name="moveMode"
        v-model="moveMode"
        :items="['move', 'press', 'auto']"
      />
      <ControlRadio
        title="move turn"
        name="turn"
        v-model="turn"
        :items="['none', 'w', 'b', 'all']"
      />
      <ControlRadio
        title="coord mode"
        name="coordMode"
        :items="['none', 'left', 'right']"
        v-model="coordMode"
      />
      <ControlRadio
        title="orientation"
        name="orientation"
        :items="['w', 'b']"
        v-model="orientation"
      />
      <ControlRadio
        title="visibility"
        name="visibility"
        v-model="visibility"
        :items="['none', 'w', 'b', 'all']"
      />
      <div>
        board pack
        <select class="px-4 py-1.5 text-black rounded-md" v-model="boardSet">
          <option v-for="th in boards" :value="th">{{ th }}</option>
        </select>
      </div>
      <div>
        pieces pack
        <select class="px-4 py-1.5 text-black rounded-md" v-model="piecesSet">
          <option v-for="th in pieces" :value="th">{{ th }}</option>
        </select>
      </div>
      <div class="space-x-4">
        fens
        <input type="radio" name="fen" v-model="fen" value="8/8/8/8/8/8/8/8" />
        <input
          type="radio"
          name="fen"
          v-model="fenProxy"
          value="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        />
        <input
          type="radio"
          name="fen"
          v-model="fenProxy"
          value="rnbqkbnr/pp3ppp/4p3/2pp4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 1"
        />
        <input
          type="radio"
          name="fen"
          v-model="fenProxy"
          value="rn2kbnr/ppp1pppp/3q4/3p1b1Q/4P3/3B4/PPPP1PPP/RNB1K1NR w KQkq - 0 1"
        />
      </div>

      <ControlRange
        title="border size"
        name="border"
        v-model="borderSize"
        suffix="fr"
        min="0"
        step="0.1"
        max="5"
      />
      <ControlRange
        title="round size"
        name="roundSize"
        v-model="roundSize"
        suffix="fr"
        min="0"
        step="0.1"
        max="5"
      />
      <ControlRange
        title="font size"
        name="fontSize"
        v-model="fontSize"
        suffix="fr"
        min="0"
        step="0.1"
        max="5"
      />
      <ControlRange
        title="animation duration"
        name="duration"
        v-model="duration"
        suffix="ms"
        min="0"
        max="1000"
      />

      <div class="flex items-center ps-3">
        <input
          id="viewonly"
          type="checkbox"
          v-model="viewonly"
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
        />
        <label
          for="viewonly"
          class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          viewonly
        </label>
      </div>
      <div class="flex items-center ps-3">
        <input
          id="alphaPiece"
          type="checkbox"
          v-model="alphaPiece"
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
        />
        <label
          for="alphaPiece"
          class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          alpha piece
        </label>
      </div>
      <div class="flex items-center ps-3">
        <input
          id="alignPiece"
          type="checkbox"
          v-model="alignPiece"
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
        />
        <label
          for="alignPiece"
          class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          align piece
        </label>
      </div>

      <ControlRange
        title="arrow size"
        name="arrowSize"
        v-model="arrowSize"
        suffix=""
        min="0"
        max="9"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, useTemplateRef } from "vue";
import { Chess, type PieceSymbol as ChessPieceSymbol } from "chess.ts";

import {
  type InputColor,
  Chessboard,
  ChessboardSquare,
  PromotionDialog,
  ChessboardArrow,
  ChessboardDot,
  ChessboardFrame,
  ChessboardCircle,
  type InputType,
  type PieceSymbol,
  type CoordinatesPlacement,
} from "cw-chessboard/index";
import ControlRadio from "./ControlRadio.vue";
import ControlRange from "./ControlRange.vue";
import { useCssVars } from "./hooks/cssVars";

import PIECE_BP from "../pieces/staunty/bp.svg?url";
import PIECE_BR from "../pieces/staunty/br.svg?url";
import PIECE_BN from "../pieces/staunty/bn.svg?url";
import PIECE_BB from "../pieces/staunty/bb.svg?url";
import PIECE_BQ from "../pieces/staunty/bq.svg?url";
import PIECE_BK from "../pieces/staunty/bk.svg?url";

import PIECE_WP from "../pieces/staunty/wp.svg?url";
import PIECE_WR from "../pieces/staunty/wr.svg?url";
import PIECE_WN from "../pieces/staunty/wn.svg?url";
import PIECE_WB from "../pieces/staunty/wb.svg?url";
import PIECE_WQ from "../pieces/staunty/wq.svg?url";
import PIECE_WK from "../pieces/staunty/wk.svg?url";

const chessboard = useTemplateRef("chessboardEl");
const promotionDialogEl = useTemplateRef("promotionDialogEl");

let chess = new Chess();
const boards = ["default", "blue", "green", "sport", "wood_light"]; // "wood_light"],
const pieces = ["default", "grady", "staunty", "stock"];

const boardSet = ref("default");
const piecesSet = ref("grady");

const visibility = ref<InputColor>("all");
const turn = ref<InputColor>("w");
const fen = ref(chess.fen());

const fenProxy = computed({
  get: () => fen.value,
  set: (v) => {
    chess = new Chess(v);
    fen.value = v;
  },
});
const orientation = ref<"w" | "b">("w");
const duration = ref(300);

const borderSize = ref(4);
const roundSize = ref(0);
const fontSize = ref(4);
const coordinates = ref<CoordinatesPlacement>("outside");
const alphaPiece = ref(true);
const coordMode = ref<any>("left");
const moveMode = ref<"auto" | "move" | "press">("auto");
const viewonly = ref(false);
const alignPiece = ref(false);
const arrowSize = ref(7);

const style = useCssVars(
  computed(() => ({
    "cw-square-color-dark": "hsl(145deg 32% 44%)",
    "cw-square-color-light": "hsl(51deg 24% 84%)",

    "cw-outer-gutter-width": borderSize.value + "%",
    "cw-inner-border-width": "1px",
    "cw-inner-border-radius": roundSize.value + "%",

    "cw-coords-font-family": "sans-serif",
    "cw-coords-font-scale": fontSize.value.toString(),

    "cw-coords-inside-coord-padding-left": "0.5%",
    "cw-coords-inside-coord-padding-right": "0.5%",

    "cw-ghost-piece-opacity": alphaPiece.value ? "0.35" : "0",
    "cw-piece-drag-z-index": "9999",
    "cw-piece-drag-coarse-scale": "2.4",

    "cw-piece-padding": "0.3%",
    "cw-p-piece-drag-scale": "1",

    "cw-piece-bp": `url("${PIECE_BP}")`,
    "cw-piece-br": `url("${PIECE_BR}")`,
    "cw-piece-bn": `url("${PIECE_BN}")`,
    "cw-piece-bb": `url("${PIECE_BB}")`,
    "cw-piece-bq": `url("${PIECE_BQ}")`,
    "cw-piece-bk": `url("${PIECE_BK}")`,

    "cw-piece-wp": `url("${PIECE_WP}")`,
    "cw-piece-wr": `url("${PIECE_WR}")`,
    "cw-piece-wn": `url("${PIECE_WN}")`,
    "cw-piece-wb": `url("${PIECE_WB}")`,
    "cw-piece-wq": `url("${PIECE_WQ}")`,
    "cw-piece-wk": `url("${PIECE_WK}")`,
  }))
);

const moveToSquare = ref<string | null>(null);
const moveFromSquare = ref<string | null>(null);
const moveVariants = ref<string[]>([]);
const lastMove = ref<string[]>([]);

const onBeforeMove = (
  square: string,
  piece: PieceSymbol,
  done: (accept: boolean) => void
) => {
  console.log("BeforeMove: ", square);

  const moves = chess.moves({ square, verbose: true });
  if (moves.length === 0) return done(false);

  moveFromSquare.value = square;
  moveVariants.value = moves.map((m) => m.to);

  done(true);
};

const onAfterMove = async (
  fromSquare: string,
  toSquare: string,
  type: InputType,
  done: (accept: boolean) => void
) => {
  let promotion!: ChessPieceSymbol;
  if (chess.isPromotion({ from: fromSquare, to: toSquare }))
    promotion = await promotionDialogEl.value!.require(toSquare);

  console.log("AfterMove: ", fromSquare, toSquare);

  moveFromSquare.value = null;
  moveToSquare.value = null;
  moveVariants.value = [];

  const move = chess.move({ from: fromSquare, to: toSquare, promotion });
  if (!move) return done(false);

  lastMove.value = [fromSquare];
  done(true);
  lastMove.value.push(toSquare);

  fen.value = chess.fen();
  chessboard.value?.pieces.setFen(fen.value, type === "click");
  turn.value = chess.turn();
};
const onCancelMove = (square: string) => {
  console.log("CancelMove: ", square);
  moveFromSquare.value = null;
  moveToSquare.value = null;
  moveVariants.value = [];
};

const onEnterSquare = (square: string) => {
  console.log("EnterSquare: ", square);
  moveToSquare.value = square;
};
const onLeaveSquare = (square: string) => {
  console.log("LeaveSquare: ", square);
};
</script>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.chessboard-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  width: 100%;
  height: 100%;
}

.chessboard-config {
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  justify-content: center;
  height: 100%;
  width: 320px;
  min-width: 320px;
  max-width: 320px;
  /* overflow: auto; */

  width: 100vw;
  height: 100vh;
}
</style>
