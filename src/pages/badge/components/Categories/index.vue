<script setup lang="ts">
import { retrieveBadgeConfig } from '@/request/api/badge'
import { useQuery } from '@tanstack/vue-query'
import Badge, { type MintedBadge, type UnmintBadge } from './Badge.vue'
import { useEVMWallet } from '@/composables/oooo-wallet'
import { UserBadgeMintStatus } from '@/entities/badge'

const { address } = useEVMWallet()

const { data: config } = useQuery({
  queryKey: ['/badge/configuration', address],
  queryFn: async () => await retrieveBadgeConfig({ walletAddress: address.value })
})
const categories = computed(() => {
  if (config.value == null) return []

  const badges = config.value.badgeList.map(item => {
    const mintedBadge = config.value.userBadgeList.find(badge => badge.badgeId === item.id)
    if (mintedBadge == null) return { ...item, status: UserBadgeMintStatus.UNMINT } satisfies UnmintBadge
    return { ...item, status: UserBadgeMintStatus.MINTED, txnHash: mintedBadge.txnHash, mintTime: mintedBadge.mintTime } satisfies MintedBadge
  })

  return config.value.categoryList.map(item => {
    return {
      ...item,
      badges: badges.filter(badge => badge.categoryId === item.id)
    }
  })
})
</script>

<template>
  <div class="md:mt-[80px]">
    <div
      class="mt-[60px]"
      v-for="category of categories"
      :key="category.id"
    >
      <h3 class="text-[24px] md:text-[32px] font-[600] tracking-[1.6px]">
        {{ category.title }}
      </h3>
      <p class="mt-[4px] text-[#9e9e9e]">
        {{ category.description }}
      </p>
      <div class="mt-[20px] grid md:grid-cols-2 xl:grid-cols-3 gap-[8px] md:gap-[16px] xl:gap-[20px]">
        <Badge
          v-for="badge of category.badges"
          :key="badge.id"
          :badge="badge"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
