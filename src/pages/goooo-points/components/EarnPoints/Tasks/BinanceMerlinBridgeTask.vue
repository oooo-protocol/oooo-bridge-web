<script setup lang="ts">
import MERLIN_IMAGE from '@/assets/images/goooo-points/merlin.png'

import { Button } from 'oooo-components/ui/button'
import TaskItem from '../TaskItem.vue'

</script>

<template>
  <TaskItem
    title="BRIDGE $BTC FROM BINANCE TO MERLIN."
    description="BRIDGE $BTC FROM BINANCE TO MERLIN AND RECEIVE 8 Goooo AS A REWARD FOR EACH TRANSACTION COMPLETED."
    :image="MERLIN_IMAGE"
    hint="+8 Goooo"
  >
    <Button
      class="w-full md:w-[174px]"
      size="sm"
      as="a"
      href="https://bridge.oooo.money/?token=BTC&from=binance_pay&to=merlin"
      target="_blank"
    >
      GO TO BRIDGE
    </Button>
  </TaskItem>
</template>

<style lang="scss" scoped>

</style>
