<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import Button from '@/components/ui/button/Button.vue'

defineOptions({
  name: 'BybitWalletAlert'
})

const open = defineModel<boolean>()
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <template #header>
        <DialogHeader>
          <DialogTitle>_ CONNECT YOUR WALLET</DialogTitle>
        </DialogHeader>
      </template>
      <div
        class="px-[16px] py-[24px] md:px-[40px] md:py-[32px] overflow-y-auto"
      >
        <div class="relative w-full h-0 pb-[48%]">
          <img
            class="absolute w-full h-full"
            src="@/assets/images/bybit-alert.png"
          >
        </div>
        <p class="mt-[30px] text-[19px] font-semibold text-[#ff961e] -tracking-tighter">
          ⚠️ TO PARTICIPATE IN THE EVENT
        </p>
        <p class="mt-[8px] -tracking-tighter">
          Please connect your Bybit Seed Phrase Wallet. Bybit Cloud wallet is not supported.
        </p>
      </div>
      <div class="px-[16px] pt-[10px] pb-[24px] md:px-[40px] flex flex-col md:flex-row gap-[10px]">
        <Button
          class="w-full md:w-[204px]"
          @click="open = false"
        >
          I UNDERSTAND
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style lang="scss" scoped>

</style>
