<template>
  <div class="space-x-2 flex items-center">
    <span class="block text-md font-bold text-gray-900 dark:text-gray-300">
      {{ title }}
    </span>
    <div
      class="inline-flex rounded-md shadow-sm overflow-hidden border border-gray-900"
      role="group"
    >
      <button
        v-for="item in items"
        :key="item"
        type="button"
        class="px-4 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white"
        :class="{ 'bg-gray-900  text-white': item === model }"
        @click="model = item"
      >
        {{ item }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineModel } from "vue";
const props = defineProps<{
  name: string;
  title?: string;
  items: string[];
}>();

const model = defineModel<string>({ required: true });
</script>

<style lang="scss"></style>
