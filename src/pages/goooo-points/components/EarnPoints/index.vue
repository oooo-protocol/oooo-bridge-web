<script setup lang="ts">
// import MoreSoon from './MoreSoon.vue'

import TaskCard from './TaskCard.vue'

import TwitterTask from './Tasks/TwitterTask.vue'
import DiscordTask from './Tasks/DiscordTask.vue'

import FOLLOW_TO_EARN_IMAGE from '@/assets/images/goooo-points/follow.png'
import INVITE_TO_EARN_IMAGE from '@/assets/images/goooo-points/invite.png'
import BRIDGE_TO_EARN_IMAGE from '@/assets/images/goooo-points/bridge.png'

import InviteFriendsTask from './Tasks/InviteFriendsTask.vue'
import InviteBridgeTask from './Tasks/InviteBridgeTask.vue'

import RSKBridgeTask from './Tasks/RSKBridgeTask.vue'
import MacaronBridgeTask from './Tasks/MacaronBridgeTask.vue'
</script>

<template>
  <div class="space-y-[8px] md:space-y-[20px]">
    <h3 class="text-[32px] font-[600] tracking-[1.6px]">
      EARN POINTS
    </h3>
    <!-- <MoreSoon /> -->
    <TaskCard
      title="FOLLOW TO EARN"
      :img="FOLLOW_TO_EARN_IMAGE"
    >
      <TwitterTask />
      <DiscordTask />
    </TaskCard>
    <TaskCard
      title="INVITE TO EARN"
      :img="INVITE_TO_EARN_IMAGE"
    >
      <InviteFriendsTask />
      <InviteBridgeTask />
    </TaskCard>
    <TaskCard
      title="BRIDGE TO EARN"
      :img="BRIDGE_TO_EARN_IMAGE"
    >
      <RSKBridgeTask />
      <MacaronBridgeTask />
    </TaskCard>
  </div>
</template>

<style lang="scss" scoped>

</style>
