<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { type VoucherPariConfig } from '@/entities/voucher'

const open = defineModel<boolean>()
const props = defineProps<{
  configs: VoucherPariConfig[]
}>()
const text = computed(() => props.configs.map(p => p.desc).join(', '))
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <template #header>
        <DialogHeader>
          <DialogTitle>_ MORE PAIRS</DialogTitle>
        </DialogHeader>
      </template>
      <p class="md:text-[19px] -tracking-tighter">
        AVAILABLE FOR:
      </p>
      <p class="mt-[8px] -tracking-tighter text-[#a4a4a4]">
        {{ text }}
      </p>
    </DialogContent>
  </Dialog>
</template>

<style lang="scss" scoped>

</style>
