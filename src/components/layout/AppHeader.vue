<script setup lang="ts">
import { buttonVariants } from '@/components/ui/button'
import Icon from '@/components/Icon.vue'
import AppNav from './AppNav.vue'
import WalletSelect from './WalletSelect.vue'
</script>

<template>
  <div class="app-header relative shrink-0 flex items-center xl:justify-end md:gap-[40px] px-[24px] md:px-[48px] xl:px-[120px] h-[80px]">
    <AppNav />
    <a
      class="ml-auto xl:ml-[0] gap-[8px] text-[#ff961e] hover:text-[#ff961e]"
      :class="buttonVariants({ variant: 'ghost' })"
      href="https://oooo.money/goooo"
    >
      <Icon
        class="text-[20px]"
        name="Goooo"
      />
      Goooo
    </a>
    <WalletSelect />
  </div>
</template>

<style lang="scss">
.app-header {
  z-index: 10;
}
</style>
