<script setup lang="ts">
import {
  Carousel,
  CarouselContent
} from 'oooo-components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import AutoHeight from 'embla-carousel-auto-height'
import Icon from 'oooo-components/ui/Icon.vue'
import { Button } from 'oooo-components/ui/button'

defineProps<{
  hideArrow?: boolean
}>()
</script>

<template>
  <Carousel
    v-slot="{ canScrollNext, canScrollPrev, scrollNext, scrollPrev, carouselApi }"
    :plugins="[Autoplay({ stopOnInteraction: false, stopOnMouseEnter: true, delay: 4 * 1000 }), AutoHeight()]"
    :opts="{
      loop: true
    }"
  >
    <CarouselContent class="items-start">
      <slot />
    </CarouselContent>
    <Button
      v-if="!hideArrow"
      class="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-[44px] rotate-180 text-[24px]"
      variant="ghost"
      size="icon"
      :disabled="!canScrollPrev"
      @click="() => {
        scrollPrev()
        const autoPlay = carouselApi?.plugins().autoplay
        if (autoPlay) autoPlay.reset()
      }"
    >
      <Icon name="arrow1" />
    </Button>
    <Button
      v-if="!hideArrow"
      class="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-[44px] text-[24px]"
      variant="ghost"
      size="icon"
      :disabled="!canScrollNext"
      @click="() => {
        scrollNext()
        const autoPlay = carouselApi?.plugins().autoplay
        if (autoPlay) autoPlay.reset()
      }"
    >
      <Icon name="arrow1" />
    </Button>
  </Carousel>
</template>

<style lang="scss" scoped>

</style>
