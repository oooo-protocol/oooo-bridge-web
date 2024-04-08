<script setup lang="ts">
</script>

<template>
  <slot />
</template>

<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  overflow-y: scroll;
  background: url('@/assets/images/background.jpg') top/cover no-repeat;
}
</style>
