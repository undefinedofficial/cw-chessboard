<template>
  <ChessboardSquare v-bind="props" class="cw-chessboard-marker">
    <div class="cw-chessboard-circle"></div>
  </ChessboardSquare>
</template>

<script setup lang="ts">
import ChessboardSquare, { type ChessboardSquareProps } from "./ChessboardSquare.vue";

const props = defineProps<ChessboardSquareProps>();
</script>

<style>
.cw-chessboard-circle {
  display: block;
  width: 96%;
  height: 96%;
  border-radius: 9999px;
  background-color: transparent;
  border-style: solid;
  border-width: 4px;
  border-color: currentColor;
}
</style>
