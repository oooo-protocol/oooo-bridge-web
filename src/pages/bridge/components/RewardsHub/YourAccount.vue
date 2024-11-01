<script setup lang="ts">
import EVMWalletConnectButton from '@/components/EVMWalletConnectButton.vue'
import { retrieveAccountInfo } from '@/request/api/task'
import { useQuery } from '@tanstack/vue-query'
import { useEVMWallet } from 'oooo-components/oooo-wallet'
import PointTag from '../PointTag.vue'

const { address } = useEVMWallet()

const enabled = computed(() => address.value != null)
const { data } = useQuery({
  queryKey: ['/point/account', address],
  queryFn: async () => await retrieveAccountInfo({ walletAddress: address.value! }),
  enabled
})
</script>

<template>
  <div class="flex items-center gap-[8px]">
    <p class="text-[12px] font-[500] text-[#a4a4a4]">
      YOUR ACCOUNT
    </p>
    <template v-if="data">
      <PointTag type="goooo">
        +{{ data.point }}
      </PointTag>
      <PointTag type="gem">
        {{ data.gem }}
      </PointTag>
    </template>
    <EVMWalletConnectButton
      v-else-if="!address"
      class="px-[10px] py-[6px] w-auto h-auto xl:text-[12px] leading-[1.2]"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
