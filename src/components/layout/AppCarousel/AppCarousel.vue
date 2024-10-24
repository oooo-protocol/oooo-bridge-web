<script setup lang="ts">
import AppCarouselItem from './AppCarouselItem.vue'

import { useQuery } from '@tanstack/vue-query'
import { retrieveBridgeBannerConfig } from '@/request/api/config'
import { CarouselPro, CarouselItem } from '@/components/CarouselPro'

const { data } = useQuery({
  queryKey: ['/config/bridge/banners'],
  queryFn: retrieveBridgeBannerConfig
})
const banners = computed(() => {
  if (data.value == null) return []
  return data.value
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
  <CarouselPro
    class="app-navbar"
    v-if="banners.length > 0"
    :hide-arrow="banners.length === 1"
  >
    <CarouselItem
      v-for="(banner, index) of banners"
      :key="index"
    >
      <AppCarouselItem
        :link="banner.link"
        :image-mobile="banner.mobileImageUrl"
        :image-p-c="banner.imageUrl"
      />
    </CarouselItem>
  </CarouselPro>
</template>

<style lang="scss">

</style>
