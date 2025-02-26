<template>
  <ChessboardSquare v-bind="props" class="cw-chessboard-marker">
    <div class="cw-chessboard-dot"></div>
  </ChessboardSquare>
</template>

<script setup lang="ts">
import ChessboardSquare, { type ChessboardSquareProps } from "./ChessboardSquare.vue";

const props = defineProps<ChessboardSquareProps>();
</script>

<style>
.cw-chessboard-dot {
  display: block;
  background-color: currentColor;
  border-radius: 9999px;
  width: 30%;
  height: 30%;
}
</style>
