<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { BTC_WALLETS, ETH_WALLETS, CHAIN, type WALLET } from '@/lib/constants'
import Button from '@/components/ui/button/Button.vue'
import { useWallet } from '@/composables/hooks/use-wallet'
import { useToast } from '@/components/ui/toast/use-toast'

defineOptions({
  name: 'WalletConnectModal'
})
const props = defineProps<{
  chain: CHAIN
}>()
const { onConnect } = useWallet()
const { toast } = useToast()

const open = ref(true)
const wallets = computed(() => {
  return props.chain === CHAIN.BTC ? BTC_WALLETS : ETH_WALLETS
})

const onConnectWallet = async (wallet: WALLET) => {
  try {
    await onConnect(wallet)
    open.value = false
  } catch (e) {
    toast({
      description: (e as Error).message
    })
  }
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <template #header>
        <DialogHeader>
          <DialogTitle>_ CONNECT YOUR WALLET</DialogTitle>
        </DialogHeader>
      </template>
      <div class="space-y-[16px]">
        <Button
          class="justify-start gap-[8px] p-[8px] w-full text-[16px]"
          v-for="wallet of wallets"
          :key="wallet.value"
          variant="outline"
          @click="onConnectWallet(wallet.value)"
        >
          <img
            class="w-[24px] h-[24px]"
            :src="wallet.image"
          >
          {{ wallet.name }}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style lang="scss" scoped>

</style>
