<script setup lang="ts">
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from 'oooo-components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import AppCarouselItem from './AppCarouselItem.vue'
import GOOOO_MOBILE_IMAGE from '@/assets/images/testnet/banner.mobile.png'
import GOOOO_PC_IMAGE from '@/assets/images/testnet/banner.pc.png'

const activies = [
  {
    name: 'Goooo Points',
    imageMobile: GOOOO_MOBILE_IMAGE,
    imagePC: GOOOO_PC_IMAGE,
    url: 'https://app.galxe.com/quest/oooo/GCgn9tzHvd'
  }
]
</script>

<template>
  <Carousel
    class="app-navbar mx-[24px] md:mx-[48px] xl:mx-auto xl:max-w-[832px] xl:w-full"
    v-if="activies.length > 0"
    :plugins="[Autoplay()]"
    :opts="{
      loop: true
    }"
  >
    <CarouselContent>
      <CarouselItem
        v-for="activity of activies"
        :key="activity.name"
      >
        <AppCarouselItem
          :link="activity.url"
          :image-mobile="activity.imageMobile"
          :image-p-c="activity.imagePC"
        />
      </CarouselItem>
    </CarouselContent>
    <div class="hidden md:block">
      <CarouselPrevious />
      <CarouselNext />
    </div>
  </Carousel>
</template>

<style lang="scss">

</style>
