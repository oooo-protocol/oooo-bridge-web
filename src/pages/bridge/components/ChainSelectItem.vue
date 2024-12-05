<script setup lang="ts">
import { useWallet } from '@/composables/hooks/use-wallet'
import { type Chain } from '@/entities/bridge'
import { type CHAIN } from '@/entities/chain'
import { useQuery } from '@tanstack/vue-query'
import { WALLET_TYPE } from '@/composables/oooo-wallet'
import { CHAIN_IMAGE_MAP } from '@/lib/constants'
import { SERVER_TOKEN_TYPE } from '@/entities/server'

const props = defineProps<{
  chain: Chain
}>()

const { address, walletType, getBalance } = useWallet()

const enabled = computed(() => {
  if (address.value == null) return false
  const tokenType = props.chain.tokenType
  switch (tokenType) {
    case SERVER_TOKEN_TYPE.CEX:
      return false
    case SERVER_TOKEN_TYPE.BITCOIN:
      return walletType.value === WALLET_TYPE.BITCOIN
    case SERVER_TOKEN_TYPE.FRACTAL:
      return walletType.value === WALLET_TYPE.FRACTAL
    case SERVER_TOKEN_TYPE.APTOS_COIN:
    case SERVER_TOKEN_TYPE.APTOS_TOKEN:
      return walletType.value === WALLET_TYPE.APTOS || walletType.value === WALLET_TYPE.MOVEMENT_APTOS
    case SERVER_TOKEN_TYPE.ETH_COIN:
    case SERVER_TOKEN_TYPE.ETH_TOKEN:
      return walletType.value === WALLET_TYPE.ETHEREUM
    default:
      return false
  }
})
const { data: balance } = useQuery({
  queryKey: ['getBalance', props.chain.tokenId, address],
  queryFn: async () => {
    console.log('get balance')
    return await getBalance(props.chain)
  },
  staleTime: 5 * 1000,
  enabled
})
</script>

<template>
  <div
    class="flex items-center gap-[8px] p-[8px] hover:bg-[#3c4840] cursor-pointer"
  >
    <img
      class="w-[24px] h-[24px]"
      :src="CHAIN_IMAGE_MAP[chain.chainName as CHAIN]"
    >
    <div class="flex flex-col md:flex-row md:justify-between md:items-center w-full overflow-hidden">
      <p class="-tracking-tighter">
        {{ chain.showName }}
      </p>
      <p class="text-[14px] md:text-base -tracking-tighter text-[#a4a4a4] md:text-[#fff] break-words">
        {{ Number(balance) > 0 ? balance : '- -' }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
