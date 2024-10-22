<script setup lang="ts">
import OVoucherPacks from './OVoucherPacks.vue'
import { useEVMWallet } from 'oooo-components/oooo-wallet'
import EVMWalletConnectButton from '@/components/EVMWalletConnectButton.vue'
import OVoucherPackPlaceholder from './OVoucherPackPlaceholder.vue'
import { getArrayFirst } from '@preflower/utils'
import { useQuery } from '@tanstack/vue-query'
import { retrieveVoucherPack } from '@/request/api/voucher'
import OVoucherPack from './OVoucherPack.vue'

const { address } = useEVMWallet()
const route = useRoute()
const code = getArrayFirst(route.query.code)

const { data: pack } = useQuery({
  queryKey: [''],
  queryFn: async () => await retrieveVoucherPack({ packCode: code! }),
  enabled: code != null
})
</script>

<template>
  <div>
    <OVoucherPacks v-if="address" />
    <div
      v-else
      class="flex flex-col items-center"
    >
      <OVoucherPack
        v-if="pack"
        :pack="pack"
        active
      />
      <OVoucherPackPlaceholder v-else>
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
