<script setup lang="ts">
import YourAccount from './components/YourAccount/index.vue'
import EarnPoints from './components/EarnPoints/index.vue'
import Top50Accounts from './components/Top50Accounts/index.vue'
import { ScrollNavProvider, ScrollNavItem, ScrollNavContent } from './components/ScrollNav'
import { WALLET_TYPE } from 'oooo-components/oooo-wallet'
import useWalletStore from '@/store/wallet'
import { useSignatureCheck } from '@/composables/hooks/use-signature-check'
import { useInvite } from './hooks/use-invite'

const { updateWalletType } = useWalletStore()

onBeforeMount(() => {
  updateWalletType(WALLET_TYPE.ETHEREUM)
})

useSignatureCheck()
useInvite()

const navs = [
  {
    name: 'your-account',
    title: 'YOUR ACCOUNT'
  }, {
    name: 'earn-points',
    title: 'EARN POINTS'
  },
  {
    name: 'top-50-accounts',
    title: 'LEADERBOARD'
  }
]
</script>

<template>
  <header class="goooo-header relative shrink-0 flex flex-col justify-center items-center px-[30px] h-[250px] xl:h-[520px] text-center">
    <p class="text-[24px] xl:text-[50px] font-medium tracking-[1.2px] leading-[1.17]">
      BRIDGER TO EARN Goooo! LET'S Goooo!
    </p>
    <p class="mt-[12px] text-[13px] xl:text-[24px] tracking-[1.2px]">
      READY TO EARN YOUR Goooo?
    </p>
  </header>
  <ScrollNavProvider
    target="#app"
    default-value="your-account"
    v-slot="{ current }"
  >
    <div class="flex flex-row items-start gap-[80px] xl:pl-[120px] xl:pr-[240px]">
      <ul class="shrink-0 sticky top-[0] py-[80px] space-y-[40px] hidden xl:block">
        <ScrollNavItem
          class="cursor-pointer"
          :class="{
            'text-[#787878]': item.name !== current
          }"
          v-for="item of navs"
          :key="item.name"
          :name="item.name"
        >
          {{ item.title }}
        </ScrollNavItem>
      </ul>
      <div class="w-full px-[24px] xl:px-0">
        <ScrollNavContent
          class="pt-[24px] xl:pt-[70px]"
          name="your-account"
        >
          <YourAccount />
        </ScrollNavContent>
        <ScrollNavContent
          class="pt-[60px] xl:pt-[70px]"
          name="earn-points"
        >
          <EarnPoints />
        </ScrollNavContent>
        <ScrollNavContent
          class="pt-[60px] xl:pt-[70px]"
          name="top-50-accounts"
        >
          <Top50Accounts />
        </ScrollNavContent>
      </div>
    </div>
  </ScrollNavProvider>
</template>

<style lang="scss" scoped>
.goooo {
  &-header {
    background: url('@/assets/images/goooo-points/banner.png') no-repeat center / cover;
  }
}
</style>
