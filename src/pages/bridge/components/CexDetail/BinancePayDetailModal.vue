<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from 'oooo-components/ui/dialog'
import { type CHAIN } from '@/entities/chain'
import { usePreventUnload } from '../../hooks/use-before-unload'
import BinancePayDetail from './BinancePayDetail.vue'

const open = defineModel<boolean>()

const props = defineProps<{
  assetType: string
  assetCode: string
  fromChain: CHAIN
  fromTxnHash: string
  fromWalletAddr: string
}>()

usePreventUnload()
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent
      @pointer-down-outside.prevent
      @escape-key-down.prevent
    >
      <template #header>
        <DialogHeader>
          <DialogTitle>_ TRANSFER PROCESSING</DialogTitle>
        </DialogHeader>
      </template>
      <template #content>
        <BinancePayDetail
          class="overflow-y-auto"
          v-bind="props"
          @close="open = false"
        />
      </template>
    </DialogContent>
  </Dialog>
</template>
