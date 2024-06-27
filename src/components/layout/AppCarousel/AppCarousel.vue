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

import BEVM_MOBILE_IMAGE from '@/assets/images/activity/bevm-mob.png'
import BEVM_PC_IMAGE from '@/assets/images/activity/bevm-pc.png'
import MERLIN_MOBILE_IMAGE from '@/assets/images/activity/merlin-mob.png'
import MERLIN_PC_IMAGE from '@/assets/images/activity/merlin-pc.png'
import B2_HONEY_MOBILE_IMAGE from '@/assets/images/activity/b2-honey-mob.png'
import B2_HONEY_PC_IMAGE from '@/assets/images/activity/b2-honey-pc.png'
import TOKENPOCKET_MOBILE_IMAGE from '@/assets/images/activity/tokenpocket-mob.png'
import TOKENPOCKET_PC_IMAGE from '@/assets/images/activity/tokenpocket-pc.png'
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
    }, {
      name: 'B2 Honey',
      imageMobile: B2_HONEY_MOBILE_IMAGE,
      imagePC: B2_HONEY_PC_IMAGE,
      url: 'https://honey.bsquared.network/'
    }, {
      name: 'BEVM Airdrop',
      imageMobile: BEVM_MOBILE_IMAGE,
      imagePC: BEVM_PC_IMAGE,
      url: 'https://www.bybit.com/en/web3/airdrop/activity?activityId=109&activityTag=4'
    }, {
      name: 'Goooo Airdrop',
      imageMobile: MERLIN_MOBILE_IMAGE,
      imagePC: MERLIN_PC_IMAGE,
      url: 'https://app.galxe.com/quest/oooo/GCXMctdbZ4'
    }, {
      name: 'oooo x TokenPocket',
      imageMobile: TOKENPOCKET_MOBILE_IMAGE,
      imagePC: TOKENPOCKET_PC_IMAGE,
      url: 'https://oooo.money/goooo'
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
