<script setup lang="ts">
import { QuestTag } from '@/components/QuestItem'
import BadgeModal from './BadgeModal.vue'
import { type UserBadge, UserBadgeMintStatus, type Badge } from '@/entities/badge'
import { getArrayFirst } from '@preflower/utils'

const props = defineProps<{
  badge: MintedBadge | UnmintBadge
}>()

const route = useRoute()
const open = ref(getArrayFirst(route.query.id) === String(props.badge.id))

export interface MintedBadge extends Omit<Badge, 'mintLimit'> {
  status: UserBadgeMintStatus.MINTED
  txnHash: UserBadge['txnHash']
  mintTime: UserBadge['mintTime']
}

export interface UnmintBadge extends Badge {
  status: UserBadgeMintStatus.UNMINT
}

</script>

<template>
  <div
    class="relative flex md:flex-col md:items-center gap-[8px] md:gap-[16px] bg-[#121314] border border-[#29292a] rounded-[2px] pt-[36px] pr-[8px] pb-[20px] pl-[4px] md:p-[40px] md:pt-[20px] cursor-pointer"
    @click="open = true"
  >
    <div
      v-if="badge.status === UserBadgeMintStatus.MINTED"
      class="absolute top-[4px] left-[4px] py-[4px] px-[6px] bg-gradient-to-r from-[#e66dff] to-[#00ff5b] rounded-br-[12px] rounded-tl-[12px] rounded-tr-[2px] rounded-bl-[2px] text-[12px] text-[#000] font-[500]"
    >
      Obtained
    </div>
    <img
      class="w-[88px] h-[88px] md:h-[130px] md:w-[130px]"
      :src="badge.icon"
    >
    <div class="flex flex-col md:items-center gap-[8px] md:gap-[16px]">
      <p class="text-[18px]">
        {{ badge.name }}
      </p>
      <!-- <p class="mt-[8px] text-[#787878] text-[12px]">
      Total Minted: 10,000
    </p> -->
      <div class=" flex gap-[4px]">
        <QuestTag
          v-for="tag of badge.tags"
          :key="tag.name"
          :tag="tag"
        />
      </div>
      <p class="text-[11px] text-[#787878] text-center">
        {{ badge.description }}
      </p>
    </div>
  </div>
  <BadgeModal
    v-model:open="open"
    :badge="badge"
  />
</template>

<style lang="scss" scoped>
</style>
