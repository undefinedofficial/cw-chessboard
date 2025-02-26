<template>
  <div class="chessboard-preview">
    <Chessboard
      :fen="fen"
      :orientation="orientation"
      :borderSize="borderSize"
      :roundSize="roundSize"
      :fontSize="fontSize"
      :coordOutside="coordOutside"
      :coordMode="coordMode"
      :duration="duration"
      :alphaPiece="alphaPiece"
      :boardSet="boardSet"
      :pieceSet="piecesSet"
      :visibility="visibility"
      :resize="true"
      ref="chessboardEl"
    >
      <ChessboardSurface white="#f0d9b5" black="#b58863" />
      <ChessboardPieces />

      <ChessboardCircle class="text-red-500/80" square="a4" />
      <ChessboardSquare square="a5" class="bg-sky-700" />
      <ChessboardFrame square="b5" class="text-green-700" />
      <ChessboardArrow square="b4" toSquare="c4" class="text-violet-700" :size="arrowSize" />
      <ChessboardDot square="c5" class="text-purple-800" />
      <ChessboardSquare
        square="a6"
        class="flex flex-col justify-center items-center overflow-hidden text-center text-xs"
      >
        best<br />
        chess <br />
        board
      </ChessboardSquare>
      <ChessboardSquare square="b6" class="flex justify-center items-center text-2xl" above>
        1.0
      </ChessboardSquare>

      <ChessboardFrame class="text-green-800/60" v-if="dropCoord" :square="dropCoord" />

      <ChessboardSquare class="bg-cyan-400/60" v-for="move in lastMove" :square="move" />
      <ChessboardFrame class="text-black/60" v-if="moveFromSquare" :square="moveFromSquare" />
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

      <ChessboardControl
        v-if="!viewonly"
        :enableColor="turn"
        :mode="moveMode"
        :alignPiece="alignPiece"
        @beforeMove="onBeforeMove"
        @afterMove="onAfterMove"
        @cancelMove="onCancelMove($event)"
        @enterSquare="onEnterSquare($event)"
        @leaveSquare="onLeaveSquare($event)"
        @dropMove="onDropMove"
        @dropEnd="onDropEnd"
      />
      <PromotionDialog ref="promotionDialogEl" />
    </Chessboard>
  </div>
  <div class="chessboard-config">
    <div class="flex flex-col w-full h-full space-y-3">
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
        max="100"
      />
      <ControlRange
        title="round size"
        name="roundSize"
        v-model="roundSize"
        suffix="fr"
        min="0"
        max="100"
      />
      <ControlRange
        title="font size"
        name="fontSize"
        v-model="fontSize"
        suffix="fr"
        min="0"
        max="100"
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
          id="coordOutside"
          type="checkbox"
          v-model="coordOutside"
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
        />
        <label
          for="coordOutside"
          class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          coord outside
        </label>
      </div>
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

      <div class="flex flex-col items-center space-y-3">
        pieces packs
        <div class="h-64 flex space-x-3">
          <ChessboardPiece
            v-for="piece in pieces"
            :piecePack="piece"
            class="w-16 h-16"
            piece="Q"
            draggable
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { Chess, type PieceSymbol } from "chess.ts";

import {
  type InputColor,
  Chessboard,
  ChessboardControl,
  ChessboardSquare,
  PromotionDialog,
  ChessboardPiece,
  ChessboardArrow,
  ChessboardDot,
  ChessboardFrame,
  ChessboardCircle,
  ChessboardSurface,
  ChessboardPieces,
} from "cw-chessboard/index";
import ControlRadio from "./ControlRadio.vue";
import ControlRange from "./ControlRange.vue";

const chessboardEl = ref<InstanceType<typeof Chessboard>>();
const promotionDialogEl = ref<InstanceType<typeof PromotionDialog>>();

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

const borderSize = ref(20);
const roundSize = ref(0);
const fontSize = ref(28 * 2);
const duration = ref(300);
const coordOutside = ref(false);
const alphaPiece = ref(true);
const orientation = ref<"w" | "b">("w");
const coordMode = ref<any>("left");
const moveMode = ref<"auto" | "move" | "press">("auto");
const viewonly = ref(false);
const alignPiece = ref(false);
const arrowSize = ref(7);

const moveToSquare = ref<string | null>(null);
const moveFromSquare = ref<string | null>(null);
const moveVariants = ref<string[]>([]);
const lastMove = ref<string[]>([]);
const dropCoord = ref<string | null>(null);

const onBeforeMove = (square: string, done: (accept: boolean) => void) => {
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
  done: (accept: boolean) => void
) => {
  let promotion!: PieceSymbol;
  if (chess.isPromotion({ from: fromSquare, to: toSquare }))
    promotion = (await promotionDialogEl.value!.require(toSquare)) as PieceSymbol;

  console.log("AfterMove: ", fromSquare, toSquare);

  moveFromSquare.value = null;
  moveToSquare.value = null;
  moveVariants.value = [];

  const move = chess.move({ from: fromSquare, to: toSquare, promotion });
  if (!move) return done(false);

  lastMove.value = [fromSquare];
  await done(true);
  lastMove.value.push(toSquare);

  fen.value = chess.fen();
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

const onDropMove = (square: string) => {
  console.log("DropMove: ", square);
  dropCoord.value = square;
};

const onDropEnd = (piece: string, square: string) => {
  alert("DropEnd: " + piece + " " + square);
  dropCoord.value = null;
};
</script>

<style>
@tailwind base;
@layer base {
  html {
    -webkit-tap-highlight-color: transparent;
  }
}
@tailwind components;
@tailwind utilities;

html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;

  @apply md:flex md:mx-5 md:overflow-hidden;
}

.chessboard-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  width: 100%;
  height: 100%;
  overflow: hidden;
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
  @apply m-5;
}
</style>
