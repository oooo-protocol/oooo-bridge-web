<script setup lang="ts">
import BITLAYER_IMAGE from '@/assets/images/goooo-points/bitlayer.png'
import { Button } from 'oooo-components/ui/button'
import TaskItem from '../TaskItem.vue'
</script>

<template>
  <TaskItem
    title="BRIDGE BTC FROM ANY CHAIN TO BITLAYER."
    description="WIN GOOOO POINTS FOR FURTURE AIRDROP."
    :image="BITLAYER_IMAGE"
    hint="+8 Goooo"
  >
    <Button
      class="w-full md:w-[174px]"
      size="sm"
      as="a"
      href="https://www.bitlayer.org/ready-player-one/dapps-center"
      target="_blank"
    >
      GO TO BRIDGE
    </Button>
  </TaskItem>
</template>

<style lang="scss" scoped>
</style>
