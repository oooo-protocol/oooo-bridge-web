<script setup lang="ts">
import { CarouselPro, CarouselItem } from '@/components/CarouselPro'
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
  if (data.value == null) return []
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
  <CarouselPro v-if="quests.length > 0">
    <CarouselItem
      :class="{
        'cursor-pointer': quest.link != null
      }"
      v-for="(quest, index) of quests"
      :key="index"
    >
      <QuestItem
        :quest="quest"
        @click="onClickQuest(quest.link)"
        :show-connect-wallet="false"
      >
        <img
          class="h-[16px] w-[28px]"
          src="@/assets/images/go.png"
        >
      </QuestItem>
    </CarouselItem>
  </CarouselPro>
</template>

<style lang="scss" scoped>

</style>
