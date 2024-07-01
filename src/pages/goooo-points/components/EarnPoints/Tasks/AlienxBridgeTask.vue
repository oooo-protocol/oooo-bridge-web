<script setup lang="ts">
import ALIENX_IMAGE from '@/assets/images/goooo-points/alienx.png'

import { Button } from 'oooo-components/ui/button'
import TaskItem from '../TaskItem.vue'

</script>

<template>
  <TaskItem
    title="BRIDGE 0.001 $ETH FROM ANY CHAIN TO ALIENX."
    description="MINT YOUR ALIENX GENESIS PASSCARD TO QUALIFY FOR THE $AIX AIRDROP."
    :image="ALIENX_IMAGE"
    hint="$AIX Airdrop"
  >
    <Button
      class="w-full md:w-[174px]"
      size="sm"
      as="a"
      href="https://bridge.oooo.money/?token=ETH&from=arbitrum&to=alienx"
      target="_blank"
    >
      GO TO BRIDGE
    </Button>
    <Button
      class="w-full md:w-[174px]"
      size="sm"
      variant="outline"
      as="a"
      href="https://alienxchain.io/quest?active=pass_card"
      target="_blank"
    >
      MINT PASSCARD
    </Button>
  </TaskItem>
</template>

<style lang="scss" scoped>

</style>
