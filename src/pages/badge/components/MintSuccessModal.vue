<script setup lang="ts">
import { Dialog, DialogContent } from '@/components/ui/dialog'

const open = defineModel<boolean>('open')

defineProps<{
  icon: string
}>()
</script>

<template>
  <Dialog
    v-bind="$attrs"
    v-model:open="open"
  >
    <DialogContent
      class="bg-transparent"
      @pointer-down-outside.prevent
      @escape-key-down.prevent
    >
      <div class="flex flex-col items-center text-center overflow-hidden">
        <div class="badge-nft w-[240px] h-[240px] md:w-[306px] md:h-[306px]">
          <img
            class="badge-nft__image w-[150px] h-[150px] md:w-[210px] md:h-[210px]"
            :src="icon"
          >
        </div>
        <p class="mt-[42px] text-[22px] md:text-[44px] -tracking-tighter">
          MINT SUCCESS
        </p>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style lang="scss" scoped>
.badge-nft {
  @apply relative flex items-center justify-center;
  transform: scale(0) rotate(-45deg);
  animation: badge-nft-scale 0.5s ease-in-out forwards;

  &::after {
    z-index: -1;
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: url('@/assets/images/badge/nft-bg.png') center/contain no-repeat;
    animation: badge-nft-bg 2s linear infinite;
  }

  @keyframes badge-nft-scale {
    to {
      transform: scale(1) rotate(0deg);
    }
  }

  @keyframes badge-nft-bg {
    0% {
      rotate: 0;
    }
    100% {
      rotate: 360deg;
    }
  }
}
</style>
