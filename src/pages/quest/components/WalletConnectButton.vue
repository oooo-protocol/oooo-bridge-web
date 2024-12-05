<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { createFuncall } from 'vue-funcall'
import { type NETWORK, WALLET_TYPE, WalletConnectModal } from '@/composables/oooo-wallet'

const onClickConnect = () => {
  createFuncall(WalletConnectModal, {
    modelValue: true,
    type: WALLET_TYPE.ETHEREUM,
    network: import.meta.env.VITE_NETWORK as NETWORK
  })
}
</script>

<template>
  <Button
    class="w-[196px] tracking-[1px] text-[#bce4cd] select-none"
    variant="outline"
    @click="onClickConnect"
  >
    CONNECT WALLET
  </Button>
</template>
