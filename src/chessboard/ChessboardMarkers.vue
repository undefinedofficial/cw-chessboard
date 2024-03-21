<template>
  <div class="markers">
    <template v-for="(marker, i) of markers" :key="marker.id || i">
      <ChessboardSquare v-if="marker.type === MARKER.DOT" class="marker" :square="marker.square">
        <div class="marker-dot" :class="marker.color || 'default'"></div>
      </ChessboardSquare>
      <ChessboardSquare
        v-else-if="marker.type === MARKER.FRAME"
        class="marker"
        :square="marker.square"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="marker-frame"
          :class="marker.color || 'default'"
          viewBox="0 0 40 40"
          version="1.1"
        >
          <g
            id="strict-marker-frame"
            transform="translate(2, 2)"
            fill="#000000"
            fill-opacity="0"
            stroke-width="2"
          >
            <path
              d="M2.66453526e-15,10.5882353 L2.66453526e-15,2.11764706 C2.66453526e-15,1.41176471 0.176470588,0.882352941 0.529411765,0.529411765 C0.882352941,0.176470588 1.41176471,-2.84217094e-14 2.11764706,-2.84217094e-14 L10.5882353,-2.84217094e-14"
              id="Path"
            ></path>
            <path
              d="M25.4117647,36 L25.4117647,27.5294118 C25.4117647,26.8235294 25.5882353,26.2941176 25.9411765,25.9411765 C26.2941176,25.5882353 26.8235294,25.4117647 27.5294118,25.4117647 L36,25.4117647"
              id="Path"
              transform="translate(30.705882, 30.705882) rotate(-180.000000) translate(-30.705882, -30.705882) "
            ></path>
            <path
              d="M0,36 L0,27.5294118 C0,26.8235294 0.176470588,26.2941176 0.529411765,25.9411765 C0.882352941,25.5882353 1.41176471,25.4117647 2.11764706,25.4117647 L10.5882353,25.4117647"
              id="Path"
              transform="translate(5.294118, 30.705882) rotate(-90.000000) translate(-5.294118, -30.705882) "
            ></path>
            <path
              d="M25.4117647,10.5882353 L25.4117647,2.11764706 C25.4117647,1.41176471 25.5882353,0.882352941 25.9411765,0.529411765 C26.2941176,0.176470588 26.8235294,0 27.5294118,0 L36,0"
              id="Path"
              transform="translate(30.705882, 5.294118) rotate(-270.000000) translate(-30.705882, -5.294118) "
            ></path>
          </g>
        </svg>
      </ChessboardSquare>
      <ChessboardSquare
        v-else-if="marker.type === MARKER.CIRCLE"
        class="marker"
        :square="marker.square"
      >
        <div class="marker-circle" :class="marker.color || 'default'"></div>
      </ChessboardSquare>
      <ChessboardSquare
        v-else-if="marker.type === MARKER.SQUARE"
        class="marker"
        :square="marker.square"
      >
        <div class="marker-square" :class="marker.color || 'default'"></div>
      </ChessboardSquare>
      <ChessboardSquare
        v-else-if="marker.type === MARKER.TEXT"
        class="marker"
        :square="marker.square"
      >
        <div class="marker-text" :class="marker.color || 'default'">{{ marker.text }}</div>
      </ChessboardSquare>
      <ArrowMarker
        v-else-if="marker.type === MARKER.ARROW"
        class="marker"
        :square="marker.square"
        :toSquare="marker.toSquare"
        :color="marker.color || 'default'"
        :size="marker.size || 7"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import ArrowMarker from "./components/ChessboardArrow.vue";
import ChessboardSquare from "./ChessboardSquare.vue";
import { MARKER, type Marker } from "./utils/markers";

export interface MarkersProps {
  markers: Marker[];
}
const props = defineProps<MarkersProps>();
</script>

<style lang="scss">
.cw-markers {
  position: absolute;
  left: -9999px;
  top: -9999px;
  pointer-events: none;
  width: 0;
  height: 0;
  overflow: hidden;
  display: none;
}

.markers {
  position: absolute;
  left: 0;
  right: 0;
  top: -1px;
  bottom: 0;
  .marker {
    user-select: none;
    pointer-events: none;
    will-change: transform, opacity;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.1s ease-in-out;

    .marker-frame {
      width: 96%;
      height: 96%;
      background-color: transparent !important;
    }
    .marker-circle {
      width: 96%;
      height: 96%;
      border-radius: 9999px;
      opacity: 0.9;
      background-color: transparent !important;
      border-style: solid;
      border-width: 4px;
    }
    .marker-dot {
      width: 40%;
      height: 40%;
      border-radius: 9999px;
      opacity: 0.9;
    }
    .marker-square {
      width: 100%;
      height: 100%;
      opacity: 0.8;
    }
    .marker-text {
      background-color: transparent !important;
      font-size: 24px;
    }
  }
}
</style>
