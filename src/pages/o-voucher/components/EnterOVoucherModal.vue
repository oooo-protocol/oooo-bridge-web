<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from 'oooo-components/ui/dialog'
import { Input } from 'oooo-components/ui/input'
import { Button } from 'oooo-components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useEVMWallet } from 'oooo-components/oooo-wallet'
import { redeemVoucherPack } from '@/request/api/voucher'
import useSignatureStore from '@/store/signature'
import { type VoucherPack } from '@/entities/voucher'
import { useToast } from 'oooo-components/ui/toast'

const open = defineModel<boolean>()
const { address } = useEVMWallet()
const signature = useSignatureStore()
const queryClient = useQueryClient()
const code = ref<string>('')
const { toast } = useToast()

const { isPending: loading, mutate } = useMutation({
  mutationFn: async () => {
    return await redeemVoucherPack({
      ...signature.signInfo!,
      packCode: code.value
    })
  },
  onSuccess: (pack) => {
    queryClient.setQueryData(
      ['/voucher/pack/list', address],
      (old?: VoucherPack[]) => old ? [pack, ...old] : [pack]
    )
    open.value = false
    toast({
      description: 'o-Voucher Pack code is correct, please continue to claim.'
    })
  },
  onError: (e) => {
    toast({
      description: e.message
    })
  }
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent
      @pointer-down-outside.prevent
    >
      <template #header>
        <DialogHeader>
          <DialogTitle>_ ENTER o-VOUCHER CODE</DialogTitle>
        </DialogHeader>
      </template>
      <Input
        class="mb-[40px] md:my-[78px] py-[12px] text-center"
        v-model="code"
        placeholder="---- ---- ---- ----"
      />
      <div class="flex flex-col-reverse md:flex-row gap-[10px]">
        <Button
          class="w-full md:w-[204px]"
          variant="secondary"
          @click="open = false"
        >
          CLAMIM LATER
        </Button>
        <Button
          class="w-full md:w-[204px]"
          @click="mutate"
          :loading="loading"
          :disabled="code?.length === 0"
        >
          CONFIRM
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style lang="scss" scoped>

</style>
