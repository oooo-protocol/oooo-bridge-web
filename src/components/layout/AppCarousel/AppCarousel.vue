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

import ALIENX_MOBILE_IMAGE from '@/assets/images/activity/alienx-mob.png'
import ALIENX_PC_IMAGE from '@/assets/images/activity/alienx-pc.png'

import { NETWORK } from '@/entities/chain'

const activies = import.meta.env.VITE_NETWORK === NETWORK.LIVENET
  ? [
    {
      name: 'ALIENX Genesis Passcard',
      imageMobile: ALIENX_MOBILE_IMAGE,
      imagePC: ALIENX_PC_IMAGE,
      url: 'https://alienxchain.io/quest?active=pass_card'
    }
  ]
  : []
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
    <div
      class="hidden xl:block"
      v-if="activies.length > 1"
    >
      <CarouselPrevious />
      <CarouselNext />
    </div>
  </Carousel>
</template>

<style lang="scss">

</style>
