<script setup lang="ts">
import OVoucherPacks from './OVoucherPacks.vue'
import { useEVMWallet } from 'oooo-components/oooo-wallet'
import EVMWalletConnectButton from '@/components/EVMWalletConnectButton.vue'
import OVoucherPackPlaceholder from './OVoucherPackPlaceholder.vue'

const { address } = useEVMWallet()
</script>

<template>
  <div>
    <OVoucherPacks v-if="address" />
    <div
      v-else
      class="flex flex-col items-center"
    >
      <OVoucherPackPlaceholder>
        <p class="text-[20px]">
          o-VOUCHER PACK
        </p>
      </OVoucherPackPlaceholder>
      <EVMWalletConnectButton class="mt-[40px]" />
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
