<script setup lang="ts">
import { CarouselItem, CarouselPro } from '@/components/CarouselPro'
import { retriveRewardsHubConfig } from '@/request/api/config'
import { useQuery } from '@tanstack/vue-query'

const { data } = useQuery({
  queryKey: ['/config/bridge/quests'],
  queryFn: retriveRewardsHubConfig
})

const banners = computed(() => {
  if (data.value == null) return []
  return data.value.bridgeQuestsBanners
    .filter(item => {
      const current = new Date()
      if (item.startDate != null && current < new Date(item.startDate)) return false
      if (item.endDate != null && current > new Date(item.endDate)) return false
      return true
    })
    .sort((a, b) => {
      return b.sortOrder - a.sortOrder
    })
})
</script>

<template>
  <div
    v-if="banners.length > 0"
    class="w-full py-[20px] px-[44px] bg-[#1c1c1c]"
  >
    <CarouselPro>
      <CarouselItem
        v-for="(banner, index) of banners"
        :key="index"
      >
        <a
          class="block h-[64px]"
          :href="banner.link"
          target="_blank"
        >
          <img :src="banner.imageUrl">
        </a>
      </CarouselItem>
    </CarouselPro>
  </div>
</template>

<style lang="scss" scoped>

</style>
