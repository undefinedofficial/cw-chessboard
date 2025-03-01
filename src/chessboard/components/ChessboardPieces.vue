<template>
  <Teleport :to>
    <div class="cw-chessboard-pieces" v-html="svg"></div>
  </Teleport>
</template>

<script lang="ts" setup>
import { Teleport } from "vue";
import DEFAULT_PIECES from "../assets/pieces/default.svg?raw";

withDefaults(
  defineProps<{
    to?: string;
    svg?: string;
  }>(),
  {
    to: "body",
    svg: DEFAULT_PIECES,
  }
);
</script>

<style>
.cw-chessboard-pieces {
  position: absolute;
  top: -9999px;
  left: -9999px;
  display: none;
  visibility: hidden;
  pointer-events: none;
  z-index: -1;
}
</style>
