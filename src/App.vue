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
      <ChessboardMarkers :markers="markers" />
      <ChessboardSquare
        square="c5"
        class="flex justify-center items-center overflow-hidden text-sm"
      >
        square
      </ChessboardSquare>
      <ChessboardSquare square="b5" class="flex justify-center items-center text-2xl" above>
        1.0
      </ChessboardSquare>
      <ChessboardControl
        v-if="!viewonly"
        :enableColor="turn"
        :mode="moveMode"
        :alignPiece="alignPiece"
        @beforeMove="onBeforeMove"
        @afterMove="onAfterMove"
        @cancelMove="(onCancelMove($event), selectMarkers('selected'), selectMarkers('active'))"
        @enterSquare="(onEnterSquare($event), selectMarkers('active', MARKER.FRAME, [$event]))"
        @leaveSquare="(onLeaveSquare($event), selectMarkers('active'))"
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
        title="markers size"
        name="markerSize"
        v-model="markerSize"
        suffix=""
        min="0"
        max="9"
      />

      <div class="flex flex-col items-center space-y-3">
        pieces packs
        <div class="h-64 flex space-x-3">
          <ChessboardPiece
            v-for="piece in pieces"
            :pieceSet="piece"
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
import { computed, reactive, ref, watch } from "vue";
import { Chess, type PieceSymbol } from "chess.ts";

import {
  type Marker,
  type InputColor,
  MARKER,
  type MarkerPoint,
  Chessboard,
  ChessboardMarkers,
  ChessboardControl,
  ChessboardSquare,
  PromotionDialog,
  ChessboardPiece,
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
    // chessboardEl.value!.wait().then(() => {
    //   console.log("moved finished");
    // });
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

const markers = ref<(Marker & { id?: string })[]>([
  { type: MARKER.FRAME, color: "red", square: "a4" },
  { type: MARKER.DOT, color: "green", square: "a5" },
  { type: MARKER.DOT, color: "red", square: "a6" },
  { type: MARKER.CIRCLE, color: "blue", square: "a3" },
  { type: MARKER.SQUARE, color: "red", square: "b6" },
  { type: MARKER.ARROW, color: "blue", square: "b3", toSquare: "b4" },
  { type: MARKER.SQUARE, color: "blue", square: "f5" },
  { type: MARKER.SQUARE, color: "blue", square: "f4" },
]);

const markerSize = ref(0);
watch(
  markerSize,
  () => {
    markers.value = markers.value.map((m) => ({ ...m, size: markerSize.value }));
  },
  { immediate: true }
);

const selectMarkers = (
  id: string,
  marker?: MarkerPoint["type"],
  squares?: string[],
  color?: MarkerPoint["color"]
): void => {
  markers.value = markers.value.filter((m) => m.id !== id);
  if (squares)
    squares.forEach((square) =>
      markers.value.push({ id, type: marker!, square, color, size: markerSize.value } as Marker)
    );
};

const onBeforeMove = (square: string, done: (accept: boolean) => void) => {
  console.log("BeforeMove: ", square);
  selectMarkers("drop");

  const moves = chess.moves({ square, verbose: true });
  if (moves.length === 0) return done(false);
  selectMarkers(
    "selected",
    MARKER.DOT,
    moves.map((m) => m.to)
  );
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
  selectMarkers("selected");
  selectMarkers("active");
  const move = chess.move({ from: fromSquare, to: toSquare, promotion });
  if (!move) return done(false);

  await done(true);
  fen.value = chess.fen();
  turn.value = chess.turn();
};
const onCancelMove = (square: string) => {
  console.log("CancelMove: ", square);
  selectMarkers("selected");
};

const onEnterSquare = (square: string) => {
  console.log("EnterSquare: ", square);
};
const onLeaveSquare = (square: string) => {
  console.log("LeaveSquare: ", square);
};

const onDropMove = (square: string) => {
  console.log("DropMove: ", square);
  selectMarkers("drop", MARKER.FRAME, [square]);
};

const onDropEnd = (piece: string, square: string) => {
  alert("DropEnd: " + piece + " " + square);
  selectMarkers("drop");
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
  max-width: 100vw;
  max-height: 100vh;
  width: 100vw;
  height: 100vh;
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
