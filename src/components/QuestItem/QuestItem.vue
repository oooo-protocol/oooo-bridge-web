<script setup lang="ts">
import EVMWalletConnectButton from '@/components/EVMWalletConnectButton.vue'
import { useEVMWallet } from 'oooo-components/oooo-wallet'
import { Button } from 'oooo-components/ui/button'
import Icon from 'oooo-components/ui/Icon.vue'
import { type Quest } from '@/entities/quest'
import QuestTag from './QuestTag.vue'
import QuestTime from './QuestTime.vue'
import { getArrayFirst } from '@preflower/utils'

defineOptions({ name: 'QuestItem' })

const route = useRoute()

const props = withDefaults(defineProps<{
  quest: Quest
  showConnectWallet?: boolean
  succeed?: boolean
}>(), {
  showConnectWallet: true
})

const { address } = useEVMWallet()
const isShowTask = computed(() => {
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
  const showStartDateTimestamp = props.quest.showStartDate != null ? +new Date(props.quest.showStartDate) : undefined
  const showEndDateTimestamp = props.quest.showEndDate != null ? +new Date(props.quest.showEndDate) : undefined
  if (showStartDateTimestamp != null && current < showStartDateTimestamp) return false
  if (showEndDateTimestamp != null && current > showEndDateTimestamp) return false
  return true
})
</script>

<template>
  <div
    v-if="isShowTask"
    class="quest-item relative flex flex-col md:flex-row md:justify-between md:gap-[60px] p-[16px] bg-gradient-to-r from-[#291f28] to-[#1e2521] rounded-[2px]"
  >
    <div class="quest-item__content flex items-start md:items-center">
      <img
        v-if="quest.icon"
        class="quest-item__image shrink-0 mr-[8px] md:mr-[12px] h-[24px] md:h-[78px]"
        :src="quest.icon"
      >
      <div class="text-[14px] font-medium -tracking-tighter">
        <QuestTime
          class="quest-item__time md:absolute md:right-[16px]"
          :start-date="quest.startDate"
          :end-date="quest.endDate"
        />
        <slot name="title">
          <p class="quest-item__title">
            {{ quest.title }}
          </p>
        </slot>
        <slot name="description">
          <p
            v-if="quest.subTitle"
            class="quest-item__subTitle mt-[4px] text-[12px] font-light text-[#787878]"
          >
            {{ quest.subTitle }}
          </p>
        </slot>
        <div class="mt-[8px] md:mt-[13px] flex flex-wrap gap-[4px]">
          <QuestTag
            v-for="(tag, index) of quest.tags"
            :tag="tag"
            :key="index"
          />
        </div>
      </div>
    </div>
    <div class="quest-item__right shrink-0 flex flex-col justify-end items-end mt-[8px] md:mt-[20px]">
      <template
        v-if="address || !showConnectWallet"
      >
        <Icon
          v-if="succeed"
          name="Finish"
          class="text-[22px] text-[#abeec4]"
        />
        <slot v-else>
          <Button
            class="w-full md:w-[174px]"
            size="sm"
            as="a"
            :href="quest.link"
            target="_blank"
          >
            {{ quest.button }}
          </Button>
        </slot>
      </template>
      <EVMWalletConnectButton
        class="w-full md:w-[172px]"
        v-else
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
