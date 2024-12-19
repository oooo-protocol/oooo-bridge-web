<script setup lang="ts">
import DialogPro from '@/components/DialogPro.vue'

const open = defineModel<boolean>('open')
</script>

<template>
  <DialogPro
    v-model:open="open"
  >
    <div
      class="flex flex-col items-center py-[24px]"
    >
      <img
        class="h-[180px]"
        src="@/assets/images/transfer-loading.dark.gif"
      >
      <p class="mt-[40px] text-[#bce4cd] -tracking-tighter">
        CLAIM PROGRESSING
      </p>
      <p class="mt-[8px] text-[14px] text-[#a4a4a4] -tracking-tighter text-center">
        REQUIRES YOUR OPERATION IN THE WALLET
      </p>
    </div>
  </DialogPro>
</template>

<style lang="scss" scoped>

</style>
