<template><render /></template>

<script lang="ts" setup>
import { computed, h } from "vue";
import type { PieceSymbol } from "./types";

const props = withDefaults(
  defineProps<{
    piece: PieceSymbol;
    pieceSet?: string;
    draggable?: boolean;
  }>(),
  {
    pieceSet: "default",
  }
);

const pieceClass = computed(
  () => (props.piece.toUpperCase() === props.piece ? "w" : "b") + props.piece.toLowerCase()
);

const render = () =>
  h(
    "div",
    {
      class: "pieces " + props.pieceSet,
      draggable: props.draggable,
      onDragstart: (e) => {
        if (!props.draggable) return;
        // e.preventDefault();
        console.log("dragstart");

        e.dataTransfer?.setData("text/plain", "piece " + pieceClass.value);
        return true;
      },
    },
    h("piece", {
      class: pieceClass.value,
      style: "display: block; width: 100%; height: 100%",
      dragable: props.draggable,
    })
  );
</script>

<style lang="scss"></style>
