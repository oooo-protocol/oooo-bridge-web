<script setup lang="ts">
import ROOTSTOCK_IMAGE from '@/assets/images/goooo-points/rootstock.png'
import { Button } from 'oooo-components/ui/button'
import TaskItem from '../TaskItem.vue'
</script>

<template>
  <TaskItem
    title="COMPLETE QUESTS TO WIN Goooo AND O-VOUCHER"
    description="BRIDGE TO ROOTSTOCK AND GET 8 Goooo AND 1 O-VOUCHER"
    :image="ROOTSTOCK_IMAGE"
    hint="+8 Goooo"
  >
    <Button
      class="w-full md:w-[174px]"
      size="sm"
      as="a"
      href="https://app.galxe.com/quest/oooo/GCmLCtvRvd"
      target="_blank"
    >
      GO TO BRIDGE
    </Button>
  </TaskItem>
</template>

<style lang="scss" scoped>
</style>
