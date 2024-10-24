<script setup lang="ts">
import MoreSoon from './MoreSoon.vue'

import TaskCard from './TaskCard.vue'

import TwitterTask from './Tasks/TwitterTask.vue'
import DiscordTask from './Tasks/DiscordTask.vue'

import InviteFriendsTask from './Tasks/InviteFriendsTask.vue'
import InviteBridgeTask from './Tasks/InviteBridgeTask.vue'

import { QuestItem } from '../../../../components/QuestItem'
import { useQuery } from '@tanstack/vue-query'
import { retrieveQuestConfig } from '@/request/api/config'
import { PRESET_GROUP_ID, type Quest, type QuestGroup } from '@/entities/quest'

interface Group extends QuestGroup {
  quests: Quest[]
}

const { data } = useQuery({
  queryKey: ['/config/quests'],
  queryFn: retrieveQuestConfig
})
const groups = computed<Group[]>(() => {
  if (data.value == null) return []
  const { questsTaskGroups, questsTasks } = data.value
  const groups = questsTaskGroups
    .map(item => ({ ...item, quests: [] as Quest[] }))
    .sort((a, b) => b.groupSortOrder - a.groupSortOrder)
  questsTasks.forEach(item => {
    const group = groups.find(group => group.groupId === item.groupId)
    if (group) {
      group.quests.push(item)
    }
  })
  return groups.map(group => ({
    ...group,
    quests: group.quests.sort((a, b) => {
      if (a.sortOrder == null || b.sortOrder == null) return 0
      return b.sortOrder - a.sortOrder
    })
  }))
})
</script>

<template>
  <div class="space-y-[8px] md:space-y-[20px]">
    <h3 class="text-[32px] font-[600] tracking-[1.6px]">
      EARN POINTS
    </h3>
    <template v-if="groups.length > 0">
      <TaskCard
        v-for="group of groups"
        :title="group.groupName"
        :key="group.groupId"
      >
        <template v-if="group.groupId === PRESET_GROUP_ID.INVITE_TO_EARN">
          <InviteFriendsTask />
          <InviteBridgeTask />
        </template>
        <template v-else-if="group.groupId === PRESET_GROUP_ID.FOLLOW_TO_EARN">
          <TwitterTask />
          <DiscordTask />
        </template>
        <QuestItem
          v-for="(quest, i) of group.quests"
          :quest="quest"
          :key="i"
        />
      </TaskCard>
    </template>
    <MoreSoon v-else />
  </div>
</template>

<style lang="scss" scoped>

</style>
