<script setup lang="ts">
import CHECK_IN_IMAGE from '@/assets/images/check-in.png'
import CALENDAR_IMAGE from '@/assets/images/calendar.png'
import DONE_IMAGE from '@/assets/images/done.png'
import GEM_IMAGE from '@/assets/images/gem.png'
import { useQuery } from '@tanstack/vue-query'
import { retrieveCheckInDays } from '@/request/api/quest'
import { useEVMWallet, WALLET_TYPE } from 'oooo-components/oooo-wallet'
import { formatDate } from '@/lib/utils'
import { CHECK_IN_STATUS, type CheckIn } from '@/entities/quest'
import CheckInChainModal from './CheckInChainModal.vue'
import { useWallet } from '@/composables/hooks/use-wallet'

const { address } = useEVMWallet()
const { onConnect } = useWallet()

const showCheckInChainModal = ref(false)

const { data } = useQuery({
  queryKey: ['/gem/checkin/daily', address],
  queryFn: async () => await retrieveCheckInDays({ walletAddress: address.value })
})

const getItemImage = (item: CheckIn, index: number) => {
  if (item.status === CHECK_IN_STATUS.CHECKED) return DONE_IMAGE
  if (index < 3) return CALENDAR_IMAGE
  if (index === 3) return CHECK_IN_IMAGE
  if (index > 3) return GEM_IMAGE
}

const onCheckIn = (item: CheckIn, index: number) => {
  if (index !== 3 || item.status !== CHECK_IN_STATUS.UNCHECK) return
  if (address.value != null) {
    showCheckInChainModal.value = true
  } else {
    onConnect(WALLET_TYPE.ETHEREUM)
  }
}
</script>

<template>
  <div v-if="data">
    <p>DAILY CHECK-IN</p>
    <div class="mt-[8px] flex gap-[5px] overflow-x-auto">
      <div
        class="shrink-0 flex-1 flex flex-col items-center min-w-[52px] border border-[#5a6960] rounded-[2px] text-center"
        :class="{
          'cursor-pointer border-[#ff86f7]': index === 3 && item.status === CHECK_IN_STATUS.UNCHECK,
          'opacity-50': index < 3
        }"
        v-for="(item, index) of data.lists"
        :key="item.checkInDay"
        @click="onCheckIn(item, index)"
      >
        <img
          class="mt-[8px] w-[24px] h-[24px]"
          :src="getItemImage(item, index)"
        >
        <div class="mt-[auto] py-[6px]">
          <p
            class="text-[10px] text-[#44ed8c]"
            v-if="item.gemAmount"
          >
            +{{ item.gemAmount }} Gem
          </p>
        </div>
        <p
          class="flex justify-center items-center w-full h-[22px] border-t border-inherit  bg-[#39443d] text-[10px]"
          :class="{
            'bg-[#84247d]': index === 3 && item.status === CHECK_IN_STATUS.UNCHECK
          }"
        >
          {{ formatDate(item.checkInDay, 'MM.DD') }}
        </p>
      </div>
    </div>
    <div class="mt-[5px] flex items-center gap-[8px] py-[6px] px-[12px] bg-gradient-to-r from-[#6a4aff] via-[#ff86f7] to-[#ff5402]">
      <img
        class="shrink-0 w-[24px]"
        src="@/assets/images/notice.png"
      >
      <p class="text-[10px]">
        Check in today for <span class="font-bold">{{ data.bridgeAmount }} Gems</span> if there's any bridging!  Earn <span class="font-bold">{{ data.commonAmount }} Gems</span> for each consecutive daily check-in.
      </p>
    </div>
    <CheckInChainModal v-model="showCheckInChainModal" />
  </div>
</template>

<style lang="scss" scoped>

</style>
