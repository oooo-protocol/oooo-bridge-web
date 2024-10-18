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
import VOUCHER_PC_IMAGE from '@/assets/images/activity/voucher.jpg'
import VOUCHER_MOBILE_IMAGE from '@/assets/images/activity/voucher-mob.jpg'
import XLAYER_PC_IMAGE from '@/assets/images/activity/xlayer.png'
import XLAYER_MOBILE_IMAGE from '@/assets/images/activity/xlayer-mob.png'
import SCROLL_PC_IMAGE from '@/assets/images/activity/scroll.png'
import SCROLL_MOBILE_IMAGE from '@/assets/images/activity/scroll-mob.png'
import DEAGENT_PC_IMAGE from '@/assets/images/activity/deagent.jpg'
import DEAGENT_MOBILE_IMAGE from '@/assets/images/activity/deagent-mob.jpg'
import BOB_PC_IMAGE from '@/assets/images/activity/bob.jpg'
import BOB_MOBILE_IMAGE from '@/assets/images/activity/bob-mob.jpg'

import { NETWORK } from '@/entities/chain'

const activies = import.meta.env.VITE_NETWORK === NETWORK.LIVENET
  ? [
    {
      name: 'Deagent activity',
      imageMobile: DEAGENT_MOBILE_IMAGE,
      imagePC: DEAGENT_PC_IMAGE,
      url: 'https://bit.ly/alpha_x'
    },
    {
      name: 'Bob activity',
      imageMobile: BOB_MOBILE_IMAGE,
      imagePC: BOB_PC_IMAGE,
      url: 'https://app.gobob.xyz/apps?category=Bridge'
    },
    {
      name: 'Scroll activity',
      imageMobile: SCROLL_MOBILE_IMAGE,
      imagePC: SCROLL_PC_IMAGE,
      url: 'https://x.com/oooo_money/status/1841447841920950704?s=46'
    },
    {
      name: 'XLayer activity',
      imageMobile: XLAYER_MOBILE_IMAGE,
      imagePC: XLAYER_PC_IMAGE,
      url: 'https://app.galxe.com/quest/oooo/GCS1YtxTSY'
    },
    {
      name: 'o-Voucher',
      imageMobile: VOUCHER_MOBILE_IMAGE,
      imagePC: VOUCHER_PC_IMAGE
    },
    {
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
    :plugins="[Autoplay({ stopOnInteraction: false, stopOnMouseEnter: true })]"
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
