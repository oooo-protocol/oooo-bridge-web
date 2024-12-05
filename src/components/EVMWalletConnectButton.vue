<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { WALLET_TYPE } from '@/composables/oooo-wallet'
import { useWallet } from '@/composables/hooks/use-wallet'

const { onConnect } = useWallet()

const onClickConnect = () => {
  onConnect(WALLET_TYPE.ETHEREUM)
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
