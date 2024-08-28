<script setup lang="ts">
import MACARON_IMAGE from '@/assets/images/goooo-points/macaron.png'
import { Button } from 'oooo-components/ui/button'
import TaskItem from '../TaskItem.vue'
</script>

<template>
  <TaskItem
    title="COMPLETE MACARON EVENT TO WIN Goooo AND O-VOUCHER"
    description="Rewards: 2X Macaron DeFi Points, 8 Goooo, $20 o-Voucher Pack"
    :image="MACARON_IMAGE"
    hint="+8 Goooo"
  >
    <Button
      class="w-full md:w-[174px]"
      size="sm"
      as="a"
      href="https://competition.macaron.xyz/#/points"
      target="_blank"
    >
      GO TO BRIDGE
    </Button>
  </TaskItem>
</template>

<style lang="scss" scoped>
</style>
