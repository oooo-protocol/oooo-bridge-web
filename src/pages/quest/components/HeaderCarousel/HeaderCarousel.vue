<script setup lang="ts">
import { CarouselPro, CarouselItem } from '@/components/CarouselPro'
import { retrieveQuestConfig } from '@/request/api/config'
import { useQuery } from '@tanstack/vue-query'
import DEFAULT_BANNER_IMAGE from '@/assets/images/quest/banner.png'
import { getArrayFirst } from '@preflower/utils'
import HeaderCarouselItem from './HeaderCarouselItem.vue'

const route = useRoute()
const { isPending, data } = useQuery({
  queryKey: ['/config/quests'],
  queryFn: retrieveQuestConfig
})
const banners = computed(() => {
  const questsTopBanners = data.value?.questsTopBanners ?? []
  const activeBanners = questsTopBanners
    .filter(item => {
      /**
       * add query `date` to test quest is work.
       */
      const queryDateBase64 = getArrayFirst(route.query.date)
      const queryDate = queryDateBase64 != null
        ? isNaN(+new Date(atob(queryDateBase64)))
          ? null
          : +new Date(atob(queryDateBase64))
        : null
      const current = queryDate ?? +new Date()
      if (item.startDate != null && current < +new Date(item.startDate)) return false
      if (item.endDate != null && current > +new Date(item.endDate)) return false
      return true
    })
    .sort((a, b) => {
      return b.sortOrder - a.sortOrder
    })
  return activeBanners.length === 0
    ? [{ imageUrl: DEFAULT_BANNER_IMAGE, sortOrder: 1 }]
    : activeBanners
})
</script>

<template>
  <div
    v-if="isPending"
    class="shrink-0 h-[250px] xl:h-[520px]"
  />
  <CarouselPro
    v-else
    hide-arrow
  >
    <CarouselItem
      v-for="(banner, index) of banners"
      :key="index"
    >
      <HeaderCarouselItem
        :image-mobile="banner.mobileImageUrl"
        :image-p-c="banner.imageUrl"
        :link="banner.link"
      />
    </CarouselItem>
  </CarouselPro>
</template>

<style lang="scss" scoped>

</style>
