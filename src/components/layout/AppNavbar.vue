<script setup lang="ts">
import { NETWORK } from '@/entities/chain'
import { ENV_VARIABLE } from '@/lib/constants'

const activity = ENV_VARIABLE.VITE_NETWORK === NETWORK.LIVENET
  ? {
    url: 'https://app.galxe.com/quest/oooo/GCgn9tzHvd',
    show: false
  }
  : {
    url: 'https://oooo.money/goooo',
    show: false
  }

</script>

<template>
  <div
    class="app-navbar mx-[24px] md:mx-[48px] xl:mx-auto xl:max-w-[832px] xl:w-full"
    v-if="activity.show"
  >
    <a
      class="app-navbar__banner cursor-pointer"
      :data-network="ENV_VARIABLE.VITE_NETWORK"
      :href="activity.url"
      target="_blank"
    />
  </div>
</template>

<style lang="scss">
.app-navbar {
  &__banner {
    display: block;
    height: 0;
    width: 100%;
    background: no-repeat center/contain;

    &[data-network='testnet'] {
      padding-bottom: 22.63%;
      background-image: url('@/assets/images/testnet/banner.mobile.png');

      @media (min-width: 768px) {
        padding-bottom: 15.625%;
        background-image: url('@/assets/images/testnet/banner.pc.png');
      }
    }

    &[data-network='livenet'] {
      padding-bottom: 22.63%;
      background-image: url('@/assets/images/livenet/banner.mobile.png');

      @media (min-width: 768px) {
        padding-bottom: 15.625%;
        background-image: url('@/assets/images/livenet/banner.pc.png');
      }
    }
  }
}
</style>
