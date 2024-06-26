<script setup lang="ts">
import { BridgeContainer, BridgeHeader } from './components/BridgeContainer'
import BinancePayDetail from './components/CexDetail/BinancePayDetail.vue'
import { type CHAIN } from '@/entities/chain'
import { getArrayFirst } from '@preflower/utils'
import AppFooter from 'oooo-components/layout/AppFooter.vue'

const route = useRoute()
const router = useRouter()

const fromChain = computed(() => getArrayFirst(route.query.fromChain) as CHAIN)
const fromTxnHash = computed(() => getArrayFirst(route.query.fromTxnHash))
const fromWalletAddr = computed(() => getArrayFirst(route.query.fromWalletAddr))
const assetType = computed(() => getArrayFirst(route.query.assetType))
const assetCode = computed(() => getArrayFirst(route.query.assetCode))

watch([fromChain, fromTxnHash, fromWalletAddr, assetType, assetCode], ([fromChain, fromTxnHash, fromWalletAddr, assetType, assetCode]) => {
  if (fromChain == null || fromTxnHash == null || fromWalletAddr == null || assetType == null || assetCode == null) {
    void router.replace('bridge')
  }
})
</script>

<template>
  <BridgeContainer>
    <BridgeHeader
      title="_ TRANSFER PROCESSING"
    />
    <BinancePayDetail
      v-if="fromChain && fromTxnHash && fromWalletAddr && assetType && assetCode"
      :from-chain="fromChain"
      :from-txn-hash="fromTxnHash"
      :from-wallet-addr="fromWalletAddr"
      :asset-type="assetType"
      :asset-code="assetCode"
      is-sharing
    />
  </BridgeContainer>
  <AppFooter />
</template>

<style lang="scss" scoped>

</style>
