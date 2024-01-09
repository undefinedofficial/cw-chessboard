<template>
  <ChessboardMarkers :markers="markers" />
</template>

<script lang="ts" setup>
import { ref, inject, type Ref, onUnmounted, onMounted } from "vue";

import ChessboardMarkers from "./ChessboardMarkers.vue";
import type { Color } from "./types";
import { MARKER, type Marker, type MarkerArrow } from "./utils/markers";
import { getPointInElement } from "./utils/getPointInElement";
import { pointToSquare, squareToString, squareValid } from "./utils/point";

const markers = ref<Marker[]>([
  {
    type: MARKER.DOT,
    square: "a6",
  },
]);

const chessboard = inject<Ref<HTMLDivElement>>("chessboard")!;
const orientation = inject<Ref<Color>>("orientation")!;

function switchMarker(marker: Marker) {
  if (marker.type === MARKER.DOT) {
    marker.type = MARKER.CIRCLE;
  } else if (marker.type === MARKER.CIRCLE) {
    marker.type = MARKER.SQUARE;
  } else if (marker.type === MARKER.SQUARE) {
    marker.type = MARKER.NONE;
  } else if (marker.type === MARKER.NONE) {
    marker.type = MARKER.DOT;
  }
  return marker;
}

const findMarkerBySquare = (square: string) => markers.value.find((m) => m.square === square);
const findMarkerBySquareAndType = (square: string, type: Marker["type"]) =>
  markers.value.find((m) => m.square === square && m.type === type);

const isArrowMarker = (marker: Marker): marker is MarkerArrow => marker.type === MARKER.ARROW;

let holdPress = false;
const onStart = (ev: PointerEvent) => {
  if (ev.button && ev.button !== 2) {
    markers.value.splice(0);
    return true;
  }
  // const point = getPointInElement(chessboard.value, ev);
  // const square = pointToSquare(point, orientation.value, point);
  // if (!squareValid(square)) return;
  // const squareStr = squareToString(square);
  // const findMarker = findMarkerBySquare(squareStr);
  // if (findMarker?.square === squareStr && !isArrowMarker(findMarker)) {
  //   switchMarker(findMarker);
  //   findMarker.color = ev.altclick ? "red" : ev.ctrlclick ? "green" : "blue";
  //   return;
  // }
  // markers.value.push({
  //   type: MARKER.DOT,
  //   square: squareToString(square),
  //   color: ev.altclick ? "red" : ev.ctrlclick ? "green" : "blue",
  // });
  // holdPress = false;
  //   const point = getPointInElement(chessboard.value, ev);
  //   const square = pointToSquare(point, orientation.value, point);
  //   if (!squareValid(square)) return true;
  //   if (fromSquare && pointEqual(fromSquare, square)) {
  //     onCancelMove(fromSquare);
  //     return true;
  //   }
  return true;
};
const onMove = (ev: PointerEvent) => {
  // if (ev.button && ev.button !== MouseButton.RIGHT && !ev.doubleclick) return true;
  // const point = getPointInElement(chessboard.value, ev);
  // const square = pointToSquare(point, orientation.value, point);
  // if (!squareValid(square)) return;
  // const squareStr = squareToString(square);
  // const lastMarker = markers.value[markers.value.length - 1];
  // if (lastMarker) {
  //   if (lastMarker.square !== squareStr) {
  //     lastMarker.type = MARKER.ARROW;
  //     (lastMarker as MarkerArrow).toSquare = squareStr;
  //     (lastMarker as MarkerArrow).color = ev.altclick ? "red" : ev.ctrlclick ? "green" : "blue";
  //     return;
  //   } else {
  //     lastMarker.type = ev.altclick ? MARKER.CIRCLE : ev.ctrlclick ? MARKER.SQUARE : MARKER.DOT;
  //   }
  // }
  // holdPress = true;
  // lastMarker.type = ev.altclick ? MARKER.CIRCLE : ev.ctrlclick ? MARKER.SQUARE : MARKER.DOT;
  // markers.value[markers.value.length - 1].square = squareToString(square);
};
const onEnd = (ev: PointerEvent) => {
  // if (ev.button && ev.button !== MouseButton.RIGHT && !ev.doubleclick) return true;
  // const point = getPointInElement(chessboard.value!, ev);
  // const square = pointToSquare(point, orientation.value, point);
  // if (!squareValid(square)) {
  //   console.log("ChessboardUserMarkers: Invalid square");
  //   return;
  // }
  // const squareStr = squareToString(square);
  // const findMarker = findMarkerBySquare(squareStr);
  // if (findMarker) {
  //   const findMarkerIdx = markers.value.indexOf(findMarker);
  //   if (findMarker && findMarkerIdx < markers.value.length - 1) {
  //     markers.value.splice(findMarkerIdx, 1);
  //   }
  // }
  // const lastMarker = markers.value[markers.value.length - 1];
  // if (lastMarker.type === MARKER.ARROW && lastMarker.square === squareStr) {
  //   markers.value.pop();
  // }
  // if (holdPress) {
  //   markers.value.push({
  //     type: MARKER.CIRCLE,
  //     square: squareStr,
  //   });
  //   return;
  // }
  // if (checkMarker(MARKER.CIRCLE, squareStr)) return;
  // markers.value.push({
  //   type: MARKER.CIRCLE,
  //   square: squareStr,
  // });
};

const onSquarePointerDown = (ev: PointerEvent) => {
  ev.preventDefault();
  if (!ev.isPrimary) return;

  if (onStart(ev)) return;

  const onSquarePointerUp = (ev: PointerEvent) => {
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerup", onSquarePointerUp);
    onEnd(ev);
  };
  document.addEventListener("pointermove", onMove);
  document.addEventListener("pointerup", onSquarePointerUp);
};

onMounted(() => {
  chessboard.value?.addEventListener("pointerdown", onSquarePointerDown);
});
onUnmounted(() => {
  chessboard.value?.removeEventListener("pointerdown", onSquarePointerDown);
});
</script>
