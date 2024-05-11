<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from 'oooo-components/ui/dialog'
import { CHAIN_IMAGE_MAP } from '@/lib/constants'
import Icon from 'oooo-components/ui/Icon.vue'
import LoadingIcon from '@/components/LoadingIcon.vue'
import { type CHAIN } from '@/entities/chain'

const open = defineModel<boolean>()

defineProps<{
  fromChain: CHAIN
  fromAmount: string
  toChain: CHAIN
  toAmount: string
}>()
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent
      @pointer-down-outside.prevent
      @escape-key-down.prevent
    >
      <template #header>
        <DialogHeader :closable="false">
          <DialogTitle>_ TRANSFER PROCESSING</DialogTitle>
        </DialogHeader>
      </template>
      <div>
        <div class="flex flex-col md:flex-row items-center gap-[12px] md:gap-[44px]">
          <div class="flex items-center gap-[8px] p-[8px] border border-[#5a6960] bg-[#212322] rounded-md w-full">
            <img
              :src="CHAIN_IMAGE_MAP[fromChain]"
              class="w-[32px] h-[32px]"
            >
            <p class="text-[24px]">
              {{ fromAmount }} BTC
            </p>
          </div>
          <Icon
            class="shrink-0 text-[24px] rotate-90 md:rotate-0"
            name="next"
          />
          <div class="flex items-center gap-[8px] p-[8px] border border-[#5a6960] bg-[#212322] rounded-md w-full">
            <img
              :src="CHAIN_IMAGE_MAP[toChain]"
              class="w-[32px] h-[32px]"
            >
            <p class="text-[24px]">
              {{ toAmount }} BTC
            </p>
          </div>
        </div>
        <div class="mt-[10px] flex gap-[10px]">
          <Icon
            class="shrink-0 my-[2px] text-[14px] text-[#ff961e]"
            name="imp"
          />
          <p class="text-[13px] md:text-[14px] text-[#a4a4a4] -tracking-tighter leading-[1.2]">
            <span class="text-[#ff961e]">Please do not close this page after successful transfer, wait for processing by oooo.</span> Don’t change network settings to avoid wrong transactions. You’re responsible for any money lost from this.
          </p>
        </div>
        <div class="mt-[20px] md:mt-[60px]">
          <div
            class="flex gap-[8px] text-[#abeec4]"
          >
            <LoadingIcon class="my-[2px] w-[16px] h-[16px]" />
            <p class="text-[13px] md:text-[14px] -tracking-tighter">
              REQUIRES YOUR OPERATION IN THE WALLET
            </p>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
