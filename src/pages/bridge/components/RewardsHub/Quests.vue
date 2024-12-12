<script setup lang="ts">
import { QuestItem } from '@/components/QuestItem'
import { retriveRewardsHubConfig } from '@/request/api/config'
import { useQuery } from '@tanstack/vue-query'

const emits = defineEmits<(e: 'inited') => void>()

const { data, isFetched } = useQuery({
  queryKey: ['/config/bridge/quests'],
  queryFn: retriveRewardsHubConfig
})

const quests = computed(() => {
  if (data.value == null) return undefined
  return data.value.bridgeQuestsTasks
    .filter(item => {
      const current = new Date()
      if (item.showStartDate != null && current < new Date(item.showStartDate)) return false
      if (item.showEndDate != null && current > new Date(item.showEndDate)) return false
      return true
    })
    .sort((a, b) => {
      if (a.sortOrder == null || b.sortOrder == null) return 0
      return b.sortOrder - a.sortOrder
    })
})

const onClickQuest = (link?: string) => {
  if (link != null) {
    window.open(link, '_blank')
  }
}

watch(isFetched, (val) => {
  if (!val) return
  emits('inited')
}, {
  immediate: true
})
</script>

<template>
  <div class="rewards-hub__quests">
    <p>QUESTS</p>
    <QuestItem
      class="mt-[6px] md:gap-[102px]"
      :class="{
        'cursor-pointer': quest.link != null
      }"
      v-for="(quest, index) of quests"
      :quest="quest"
      :key="index"
      @click="onClickQuest(quest.link)"
      :show-connect-wallet="false"
    >
      <img
        class="w-[28px]"
        src="@/assets/images/go.png"
      >
    </QuestItem>
  </div>
</template>

<style lang="scss" scoped>
.rewards-hub__quests {
  :deep(.quest-item) {
    flex-direction: column;
    gap: 0;
    padding: 12px;
  }

  :deep(.quest-item__content) {
    align-items: flex-start;
  }

  :deep(.quest-item__image) {
    width: 64px;
    height: 64px;
  }

  :deep(.quest-item__title) {
    font-size: 12px;
  }

  :deep(.quest-item__subTitle) {
    font-size: 10px;
  }

  :deep(.quest-item__time) {
    position: relative;
    right: 0;
    font-size: 10px;
  }

  :deep(.quest-item__right) {
    margin-top: 6px;
  }
}
</style>
