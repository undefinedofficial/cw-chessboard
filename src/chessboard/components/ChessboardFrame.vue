<template>
  <ChessboardSquare v-bind="props">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" version="1.1">
      <g
        id="strict-marker-frame"
        transform="translate(2, 2)"
        fill="#000000"
        fill-opacity="0"
        stroke-width="2"
        stroke="currentColor"
      >
        <path
          d="M2.66453526e-15,10.5882353 L2.66453526e-15,2.11764706 C2.66453526e-15,1.41176471 0.176470588,0.882352941 0.529411765,0.529411765 C0.882352941,0.176470588 1.41176471,-2.84217094e-14 2.11764706,-2.84217094e-14 L10.5882353,-2.84217094e-14"
        ></path>
        <path
          d="M25.4117647,36 L25.4117647,27.5294118 C25.4117647,26.8235294 25.5882353,26.2941176 25.9411765,25.9411765 C26.2941176,25.5882353 26.8235294,25.4117647 27.5294118,25.4117647 L36,25.4117647"
          transform="translate(30.705882, 30.705882) rotate(-180.000000) translate(-30.705882, -30.705882) "
        ></path>
        <path
          d="M0,36 L0,27.5294118 C0,26.8235294 0.176470588,26.2941176 0.529411765,25.9411765 C0.882352941,25.5882353 1.41176471,25.4117647 2.11764706,25.4117647 L10.5882353,25.4117647"
          transform="translate(5.294118, 30.705882) rotate(-90.000000) translate(-5.294118, -30.705882) "
        ></path>
        <path
          d="M25.4117647,10.5882353 L25.4117647,2.11764706 C25.4117647,1.41176471 25.5882353,0.882352941 25.9411765,0.529411765 C26.2941176,0.176470588 26.8235294,0 27.5294118,0 L36,0"
          transform="translate(30.705882, 5.294118) rotate(-270.000000) translate(-30.705882, -5.294118) "
        ></path>
      </g>
    </svg>
  </ChessboardSquare>
</template>

<script setup lang="ts">
import ChessboardSquare, { type ChessboardSquareProps } from "./ChessboardSquare.vue";

const props = defineProps<ChessboardSquareProps>();
</script>
