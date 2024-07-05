<script setup lang="ts">
// import MoreSoon from './MoreSoon.vue'

import Airdrop from './Airdrop/index.vue'

import TaskCard from './TaskCard.vue'

import B2BridgeTask from './Tasks/B2BridgeTask.vue'
import BinanceMerlinBridgeTask from './Tasks/BinanceMerlinBridgeTask.vue'
import AlienxBridgeTask from './Tasks/AlienxBridgeTask.vue'

// import TwitterTask from './Tasks/TwitterTask.vue'
// import DiscordTask from './Tasks/DiscordTask.vue'

// import FOLLOW_TO_EARN_IMAGE from '@/assets/images/goooo-points/follow.png'
// import INVITE_TO_EARN_IMAGE from '@/assets/images/goooo-points/invite.png'
import BRIDGE_TO_EARN_IMAGE from '@/assets/images/goooo-points/bridge.png'
</script>

<template>
  <div class="space-y-[8px] md:space-y-[20px]">
    <h3 class="text-[32px] font-[600] tracking-[1.6px]">
      EARN POINTS
    </h3>
    <!-- <MoreSoon /> -->
    <!-- <TaskCard
      title="FOLLOW TO EARN"
      :img="FOLLOW_TO_EARN_IMAGE"
    >
      <TwitterTask />
      <DiscordTask />
    </TaskCard> -->
    <!-- <TaskCard
      title="INVITE TO EARN"
      :img="INVITE_TO_EARN_IMAGE"
    >
    </TaskCard> -->
    <Airdrop />
    <TaskCard
      title="BRIDGE TO EARN"
      :img="BRIDGE_TO_EARN_IMAGE"
    >
      <AlienxBridgeTask />
      <B2BridgeTask />
      <BinanceMerlinBridgeTask />
    </TaskCard>
  </div>
</template>

<style lang="scss" scoped>

</style>
