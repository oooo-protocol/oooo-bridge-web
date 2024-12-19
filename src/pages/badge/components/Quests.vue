<script setup lang="ts">
import { QuestItem } from '@/components/QuestItem'
import { retriveRewardsHubConfig } from '@/request/api/config'
import { getArrayFirst } from '@preflower/utils'
import { useQuery } from '@tanstack/vue-query'

const route = useRoute()
const { data } = useQuery({
  queryKey: ['/config/bridge/quests'],
  queryFn: retriveRewardsHubConfig
})

const quests = computed(() => {
  if (data.value == null) return undefined
  return data.value.bridgeQuestsTasks
    .filter(item => {
      /**
       * add query `date` to test quest is work.
       */
      const queryDateBase64 = getArrayFirst(route.query.date)
      const queryDate = queryDateBase64 != null
        ? isNaN(+new Date(atob(queryDateBase64)))
          ? null
          : +new Date(atob(queryDateBase64))
        : null
      const current = queryDate ?? +new Date()
      if (item.showStartDate != null && current < +new Date(item.showStartDate)) return false
      if (item.showEndDate != null && current > +new Date(item.showEndDate)) return false
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
</script>

<template>
  <div>
    <h3 class="text-[24px] md:text-[32px] font-[600] tracking-[1.6px]">
      oooo QUESTS
    </h3>
    <div class="mt-[10px] md:mt-[20px] xl:mt-[43px] grid xl:grid-cols-2 gap-[8px] md:gap-[16px] xl:gap-[20px]">
      <QuestItem
        class="xl:gap-[102px]"
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
  </div>
</template>

<style lang="scss" scoped>

</style>
