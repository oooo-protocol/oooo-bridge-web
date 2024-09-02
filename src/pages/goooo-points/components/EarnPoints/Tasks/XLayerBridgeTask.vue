<script setup lang="ts">
import XLAYER_IMAGE from '@/assets/images/goooo-points/xlayer.png'
import { Button } from 'oooo-components/ui/button'
import TaskItem from '../TaskItem.vue'
</script>

<template>
  <TaskItem
    title="MISSION X LAYER WITH oooo TO SHARE PRIZE POOL!"
    description="REWARDS: 8 Goooo + $20 o-VOUCHER PACK"
    :image="XLAYER_IMAGE"
    hint="+8 Goooo"
  >
    <Button
      class="w-full md:w-[174px]"
      size="sm"
      as="a"
      href="https://app.galxe.com/quest/oooo/GCS1YtxTSY"
      target="_blank"
    >
      GO TO BRIDGE
    </Button>
  </TaskItem>
</template>

<style lang="scss" scoped>
</style>
