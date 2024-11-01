<script setup lang="ts">
import DailyCheckIn from './DailyCheckIn.vue'
import Quests from './Quests.vue'
import Carousel from './Carousel.vue'
import YourAccount from './YourAccount.vue'
import Icon from 'oooo-components/ui/Icon.vue'
import { Button } from 'oooo-components/ui/button'

const show = ref(window.innerWidth >= 1500)

const isHideRewardsHub = ref(false)

if (import.meta.env.VITE_MODE === 'testnet') {
  isHideRewardsHub.value = true
}
</script>

<template>
  <template v-if="!isHideRewardsHub">
    <div
      class="fixed top-[80px] right-[12px] md:right-[20px] p-[4px] md:p-[8px] rounded-[8px] md:rounded-[15px] bg-[#000]/35 cursor-pointer"
      @click="show = !show"
    >
      <div class="p-[3px] md:p-[6px] bg-[#fff] rounded-[6px] md:rounded-[11px]">
        <img
          class="w-[16px] h-[16px] md:w-[34px] md:h-[34px]"
          src="@/assets/images/menu.png"
        >
      </div>
    </div>
    <Transition name="rewards-hub">
      <div
        v-show="show"
        class="z-[10] fixed flex flex-col top-[80px] left-[12px] right-[12px] md:left-auto md:right-[20px] bottom-[42px] md:bottom-auto md:w-[430px] md:h-[85%] max-h-[824px] rounded-[2px] bg-[#1c1c1c]"
      >
        <div class="py-[16px] px-[24px] border-b border-[#5a6960]">
          <p>_ REWARDS HUB</p>
          <YourAccount class="mt-[4px]" />
          <Button
            class="absolute right-[12px] md:right-[24px] top-[10px] md:top-[14px] text-[#a4a4a4]"
            variant="ghost"
            size="icon"
            @click="show = false"
          >
            <Icon name="close2" />
          </Button>
        </div>
        <div class="flex-1 p-[16px] overflow-y-auto">
          <DailyCheckIn />
          <Quests class="mt-[24px]" />
        </div>
        <Carousel />
      </div>
    </Transition>
  </template>
</template>

<style lang="scss" scoped>
.rewards-hub-enter-active,
.rewards-hub-leave-active {
  transform-origin: top right;
  transition: scale 0.4s ease-in-out;
}

.rewards-hub-enter-from,
.rewards-hub-leave-to {
  scale: 0.1;
}
</style>
