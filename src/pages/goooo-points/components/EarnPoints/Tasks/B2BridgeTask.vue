<script setup lang="ts">
import B2_IMAGE from '@/assets/images/goooo-points/b2.png'

import { Button } from 'oooo-components/ui/button'
import TaskItem from '../TaskItem.vue'

</script>

<template>
  <TaskItem
    title="BRIDGE $BTC FROM ANY CHAIN TO B² Network."
    description="BRIDGE $BTC FROM ANY CHAIN TO B² Network AND RECEIVE 8 Goooo AS A REWARD FOR EACH TRANSACTION COMPLETED."
    :image="B2_IMAGE"
    hint="+8 Goooo"
  >
    <Button
      class="w-full md:w-[174px]"
      size="sm"
      as="a"
      href="https://bridge.oooo.money/?token=BTC&from=binance_pay&to=bsquared"
      target="_blank"
    >
      GO TO BRIDGE
    </Button>
  </TaskItem>
</template>

<style lang="scss" scoped>

</style>
