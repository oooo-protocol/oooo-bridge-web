<script setup lang="ts">
import { useWallet } from '@/composables/hooks/use-wallet'
import { type Chain } from '@/entities/bridge'
import { type CHAIN } from '@/entities/chain'
import { SERVER_ASSET, SERVER_CHAIN_TYPE } from '@/entities/server'
import { useQuery } from '@tanstack/vue-query'
import { WALLET_TYPE } from 'oooo-components/oooo-wallet'
import { CHAIN_IMAGE_MAP } from '@/lib/constants'
import { getConfigFromChain } from '@/lib/utils'
import { retrieveBitcoinOrFractalAddressBalance } from '@/request/api/bridge'

const props = defineProps<{
  chain: Chain
}>()

const { address, walletType, getInstance } = useWallet()

const enabled = computed(() => {
  if (address.value == null) return false
  switch (props.chain.type) {
    case SERVER_CHAIN_TYPE.CEX:
      return false
    case SERVER_CHAIN_TYPE.BITCOIN_L2:
      return walletType.value === WALLET_TYPE.BITCOIN || walletType.value === WALLET_TYPE.FRACTAL
    case SERVER_CHAIN_TYPE.APTOS:
      return walletType.value === WALLET_TYPE.APTOS
    default:
      return true
  }
})
const { data: balance } = useQuery({
  queryKey: ['getNativeBalance', props.chain.chainName, address, props.chain.contractAddress],
  queryFn: async () => {
    const _address = address.value!
    const instance = getInstance()
    console.log('get balance')
    const chainConfig = getConfigFromChain(props.chain.chainName)
    if (instance.type === WALLET_TYPE.BITCOIN || instance.type === WALLET_TYPE.FRACTAL) {
      return await retrieveBitcoinOrFractalAddressBalance(props.chain.chainName as CHAIN.BTC | CHAIN.FRACTAL, _address)
    } else if (instance.type === WALLET_TYPE.APTOS) {
      console.log('get balance')
      return await instance.getNativeBalance(_address, chainConfig)
    } else {
      if (props.chain.assetType === SERVER_ASSET.COIN) {
        return await instance.getNativeBalance(_address, chainConfig)
      } else {
        return await instance.getTokenBalance(_address, chainConfig, props.chain.contractAddress)
      }
    }
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
