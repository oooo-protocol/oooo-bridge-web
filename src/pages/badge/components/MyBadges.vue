<script setup lang="ts">
import Icon from '@/components/Icon.vue'
import { formatHashWithEllipsis } from '@/lib/utils'
import { useQuery } from '@tanstack/vue-query'
import { retrieveBadgeConfig } from '@/request/api/badge'
import EVMWalletConnectButton from '@/components/EVMWalletConnectButton.vue'
import { useEVMWallet } from '@/composables/oooo-wallet'

defineOptions({ name: 'MyBadges' })

const { address } = useEVMWallet()

const { data: config } = useQuery({
  queryKey: ['/badge/configuration', address],
  queryFn: async () => await retrieveBadgeConfig({ walletAddress: address.value! }),
  enabled: computed(() => address.value != null)
})
const minted = computed(() => config.value?.userBadgeList.length)
</script>

<template>
  <div class="flex flex-col md:flex-row md:items-end gap-[24px] pb-[16px] md:pb-[30px] border-b border-[#4e4e4e]">
    <div>
      <h3 class="text-[24px] md:text-[32px] font-[600] tracking-[1.6px]">
        MY BADGES
      </h3>
      <div
        class="mt-[8px] md:mt-[20px] flex items-center text-[#787878]"
        v-if="address"
      >
        <Icon
          class="md:text-[20px]"
          name="wallet"
        />
        <p class="text-[13px] md:text-base ml-[10px] tracking-[0.8px]">
          {{ formatHashWithEllipsis(address) }}
        </p>
      </div>
      <div
        class="text-[13px] md:text-base text-[#787878] tracking-[0.65px]"
        v-else
      >
        VIEW AND MANAGE YOUR EARNED BADGES
      </div>
    </div>
    <div
      class="md:ml-auto flex md:text-right"
      v-if="address"
    >
      <div>
        <p class="text-[14px] tracking-[0.7px]">
          OBTAINED
        </p>
        <p class="md:mt-[8px] text-[20px] md:text-[26px] font-medium text-[#abeec4]">
          {{ minted ?? '-' }}
        </p>
      </div>
    </div>
    <EVMWalletConnectButton
      class="hidden md:block ml-auto"
      v-else
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
