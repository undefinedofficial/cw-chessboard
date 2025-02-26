<template> 
    <component
      is="piece" 
      :draggable="draggable"
      @dragstart="dragstart"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" version="1.1">
        <use :href="`#${piecePack}-${pieceName}`"></use>
      </svg>
    </component> 
</template>

<script lang="ts" setup>
import { computed, h } from "vue";
import type { PieceSymbol } from "../types";

const props = withDefaults(
  defineProps<{ 
    piece: PieceSymbol;
    piecePack?: string;
    draggable?: boolean;
  }>(),
  {
    piecePack: "default",
  }
);

const pieceName = computed(
  () => (props.piece.toUpperCase() === props.piece ? "w" : "b") + props.piece.toLowerCase()
);

function dragstart(e: DragEvent) { 
        if (!props.draggable) return;
        // e.preventDefault();
        // console.log("dragstart");

        e.dataTransfer?.setData("text/plain", "piece " + pieceName.value);
        return true;
      }
 
</script>
