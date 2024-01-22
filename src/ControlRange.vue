<template>
  <label :for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
    {{ title }} {{ model }} {{ suffix }}
  </label>
  <input
    :id="name"
    type="range"
    v-model.number="model"
    v-bind="$attrs"
    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
  />
</template>

<script lang="ts" setup>
defineProps<{ name: string; title?: string; suffix?: string }>();
const model = defineModel<number>({ required: true });
</script>

<style lang="scss"></style>
