<script setup lang="ts">
import SCROLL_IMAGE from '@/assets/images/goooo-points/scroll.png'
import { Button } from 'oooo-components/ui/button'
import TaskItem from '../TaskItem.vue'
</script>

<template>
  <TaskItem
    title="BRIDGE TO GET YOUR EXCLUSIVE BADGE ON SCROLL"
    description="REWARDS: oooo BADGES on SCROLL, o-VOUCHER PACK, UNLIMITED 8 Goooo for EACH TRANSACTION"
    :image="SCROLL_IMAGE"
    hint="+8 Goooo"
  >
    <Button
      class="w-full md:w-[174px]"
      size="sm"
      as="a"
      href="https://bridge.oooo.money/?token=ETH&from=bsc&to=scroll"
      target="_blank"
    >
      GO TO BRIDGE
    </Button>
  </TaskItem>
</template>

<style lang="scss" scoped>
</style>
