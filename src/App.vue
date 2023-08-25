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
      :boardPack="boardPack"
      :piecePack="piecesPack"
    >
      <ChessboardMarkers :markers="markers" />
      <ChessboardControl
        v-if="!viewonly"
        :enableColor="turn"
        :mode="moveMode"
        @beforeMove="onBeforeMove"
        @afterMove="onAfterMove"
        @cancelMove="onCancelMove($event), selectMarkers('selected'), selectMarkers('active')"
        @enterSquare="onEnterSquare($event), selectMarkers('active', MARKER.FRAME, [$event])"
        @leaveSquare="onLeaveSquare($event), selectMarkers('active')"
      />
    </Chessboard>
  </div>
  <div>
    <div class="space-x-4">
      <input type="range" min="0" max="100" v-model.number="borderSize" />
      <input type="range" min="0" max="100" v-model.number="roundSize" />
      <input type="range" min="0" max="100" v-model.number="fontSize" />
      <input type="range" min="0" max="1000" v-model.number="duration" />
      <input type="checkbox" v-model="coordOutside" />
      <input type="checkbox" v-model="viewonly" />
      <input type="checkbox" v-model="alphaPiece" />
    </div>
    <div class="space-x-4">
      orientation
      <input type="radio" name="orientation" v-model="orientation" value="w" />
      <input type="radio" name="orientation" v-model="orientation" value="b" />
    </div>
    <div>
      board pack
      <select v-model="boardPack" class="text-black">
        <option v-for="th in boards" :value="th">{{ th }}</option>
      </select>
      pieces pack
      <select v-model="piecesPack" class="text-black">
        <option v-for="th in pieces" :value="th">{{ th }}</option>
      </select>
    </div>
    <div class="space-x-4">
      coords
      <input type="radio" name="coordMode" v-model="coordMode" value="none" />
      <input type="radio" name="coordMode" v-model="coordMode" value="left" />
      <input type="radio" name="coordMode" v-model="coordMode" value="right" />
    </div>
    <div class="space-x-4">
      move mode
      <input type="radio" name="moveMode" v-model="moveMode" value="move" />
      <input type="radio" name="moveMode" v-model="moveMode" value="press" />
      <input type="radio" name="moveMode" v-model="moveMode" value="auto" />
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
    <div class="space-x-4">
      turn move
      <input type="radio" name="turn" v-model="turn" value="none" />
      <input type="radio" name="turn" v-model="turn" value="w" />
      <input type="radio" name="turn" v-model="turn" value="b" />
      <input type="radio" name="turn" v-model="turn" value="all" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { Chess } from "chess.ts";

import {
  type Marker,
  type InputColor,
  MARKER,
  type MarkerPoint,
  Chessboard,
  ChessboardMarkers,
  ChessboardControl,
} from "cw-chessboard/index";

let chess = new Chess();
const boards = ["default", "blue", "green", "sport", "wood_light"]; // "wood_light"],
const pieces = ["default", "staunty", "stock"];

const boardPack = ref("default");
const piecesPack = ref("staunty");

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

const markers = ref<(Marker & { id?: string })[]>([
  { type: MARKER.FRAME, color: "red", square: "a4" },
  { type: MARKER.DOT, color: "green", square: "a5" },
  { type: MARKER.DOT, color: "red", square: "a6" },
  { type: MARKER.CIRCLE, color: "blue", square: "a3" },
  { type: MARKER.SQUARE, color: "red", square: "b6" },
  { type: MARKER.TEXT, square: "b5", text: "1.0" },
  { type: MARKER.ARROW, color: "blue", square: "b3", toSquare: "b4" },
]);

const selectMarkers = (
  id: string,
  marker?: MarkerPoint["type"],
  squares?: string[],
  color?: MarkerPoint["color"]
): void => {
  markers.value = markers.value.filter((m) => m.id !== id);
  if (squares)
    squares.forEach((square) => markers.value.push({ id, type: marker!, square, color }));
};

const onBeforeMove = (square: string, done: (accept: boolean) => void) => {
  console.log("BeforeMove: ", square);

  const moves = chess.moves({ square, verbose: true });
  if (moves.length === 0) return done(false);
  selectMarkers(
    "selected",
    MARKER.DOT,
    moves.map((m) => m.to)
  );
  done(true);
};
const onAfterMove = (fromSquare: string, toSquare: string, done: (accept: boolean) => void) => {
  console.log("AfterMove: ", fromSquare, toSquare);
  selectMarkers("selected");
  selectMarkers("active");
  const move = chess.move({ from: fromSquare, to: toSquare });
  if (!move) return done(false);

  done(true);
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
</script>

<style>
html,
body,
#app {
  max-width: 100vw;
  max-height: 100vh;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chessboard-preview {
  margin: 50px;
  max-width: 100vw;
  max-height: 100vh;
}
</style>
