<template>
  <div class="cw-aspect">
    <div class="cw-aspect-inner">
      <slot />
    </div>
  </div>
</template>

<style>
.cw-aspect {
  max-width: 100%;
  height: 100%;
  aspect-ratio: 1;
}

.cw-aspect-inner {
  max-height: 100%;
  width: 100%;
  aspect-ratio: 1;
}
</style>
