<script setup lang="ts">
import DailyCheckIn from './DailyCheckIn.vue'
import Quests from './Quests.vue'
import Carousel from './Carousel.vue'
import YourAccount from './YourAccount.vue'
import Icon from '@/components/Icon.vue'
import { Button } from '@/components/ui/button'

const show = ref(true)

const isHideRewardsHub = ref(false)

if (import.meta.env.VITE_MODE === 'testnet') {
  isHideRewardsHub.value = true
}

const initedMap: Record<string, boolean> = {
  DailyCheckIn: false,
  Quests: false
}

const onInited = (name: string) => {
  initedMap[name] = true
  const isAllInited = Object.values(initedMap).every(item => item)
  if (isAllInited && window.innerWidth < 1500) {
    show.value = false
  }
}
</script>

<template>
  <template v-if="!isHideRewardsHub">
    <Transition name="rewards-hub__widget">
      <div
        class="fixed top-[80px] right-[12px] md:right-[20px] p-[4px] md:p-[8px] rounded-[8px] md:rounded-[15px] bg-[#000]/35 cursor-pointer"
        @click="show = !show"
        v-show="!show"
      >
        <div class="p-[3px] md:p-[6px] bg-[#fff] rounded-[6px] md:rounded-[11px]">
          <img
            class="w-[16px] h-[16px] md:w-[34px] md:h-[34px]"
            src="@/assets/images/menu.png"
          >
        </div>
      </div>
    </Transition>
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
          <DailyCheckIn @inited="onInited('DailyCheckIn')" />
          <Quests
            class="mt-[24px]"
            @inited="onInited('Quests')"
          />
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
  scale: 0;
}

.rewards-hub__widget-enter-active,
.rewards-hub__widget-enter-active {
  transition: opacity 0.4s ease-in-out;
  transition-delay: 0.4s;
}

.rewards-hub__widget-enter-from,
.rewards-hub__widget-leave-to {
  opacity: 0;
}
</style>
