<script setup lang="ts">
import AppNav from './AppNav.vue'
import WalletSelect from './WalletSelect.vue'
</script>

<template>
  <div class="app-header shrink-0 flex items-center justify-between xl:justify-end gap-[40px] px-[24px] md:px-[48px] xl:pr-[120px] h-[80px]">
    <AppNav />
    <WalletSelect />
  </div>
</template>

<style lang="scss">
.app-header {
  z-index: 10;
}
</style>
