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

import OOOO_1_PC_IMAGE from '@/assets/images/activity/oooo.jpg'
import OOOO_1_MOBILE_IMAGE from '@/assets/images/activity/oooo-mob.png'
import OOOO_2_PC_IMAGE from '@/assets/images/activity/oooo-2.jpg'
import OOOO_2_MOBILE_IMAGE from '@/assets/images/activity/oooo-2-mob.png'
import OOOO_3_PC_IMAGE from '@/assets/images/activity/oooo-3.jpg'
import OOOO_3_MOBILE_IMAGE from '@/assets/images/activity/oooo-3-mob.jpg'
import OOOO_4_PC_IMAGE from '@/assets/images/activity/oooo-4.jpg'
import OOOO_4_MOBILE_IMAGE from '@/assets/images/activity/oooo-4-mob.jpg'
import BEVM_SUMMER_PC_IMAGE from '@/assets/images/activity/bevm-summer.jpg'
import BEVM_SUMMER_MOBILE_IMAGE from '@/assets/images/activity/bevm-summer-mob.png'
import VOUCHER_PC_IMAGE from '@/assets/images/activity/voucher.jpg'
import VOUCHER_MOBILE_IMAGE from '@/assets/images/activity/voucher-mob.jpg'
import RSK_PC_IMAGE from '@/assets/images/activity/rsk.png'
import RSK_MOBILE_IMAGE from '@/assets/images/activity/rsk-mob.png'

import { NETWORK } from '@/entities/chain'

const activies = import.meta.env.VITE_NETWORK === NETWORK.LIVENET
  ? [
    {
      name: 'RSK activity',
      imageMobile: RSK_MOBILE_IMAGE,
      imagePC: RSK_PC_IMAGE,
      url: 'https://app.galxe.com/quest/oooo/GCmLCtvRvd'
    },
    {
      name: 'BEVM Defi Summer',
      imageMobile: BEVM_SUMMER_MOBILE_IMAGE,
      imagePC: BEVM_SUMMER_PC_IMAGE,
      url: 'https://defiolympics.bevm.io/'
    },
    {
      name: 'o-Voucher',
      imageMobile: VOUCHER_MOBILE_IMAGE,
      imagePC: VOUCHER_PC_IMAGE
    },
    {
      name: 'oooo 4',
      imageMobile: OOOO_4_MOBILE_IMAGE,
      imagePC: OOOO_4_PC_IMAGE
    }, {
      name: 'oooo 3',
      imageMobile: OOOO_3_MOBILE_IMAGE,
      imagePC: OOOO_3_PC_IMAGE
    },
    {
      name: 'oooo 1',
      imageMobile: OOOO_1_MOBILE_IMAGE,
      imagePC: OOOO_1_PC_IMAGE
    }, {
      name: 'oooo 2',
      imageMobile: OOOO_2_MOBILE_IMAGE,
      imagePC: OOOO_2_PC_IMAGE
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
