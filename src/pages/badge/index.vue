<script setup lang="ts">
import Categories from './components/Categories/index.vue'
import FAQ from './components/FAQ/index.vue'
import Quests from './components/Quests.vue'
import useWalletStore from '@/store/wallet'
import { WALLET_TYPE } from '@/composables/oooo-wallet'
import MyBadges from './components/MyBadges.vue'

const { updateWalletType } = useWalletStore()

onBeforeMount(() => {
  updateWalletType(WALLET_TYPE.ETHEREUM)
})
</script>

<template>
  <div class="badge-header h-[520px] flex flex-col justify-center items-center" />
  <div class="flex flex-row items-start gap-[80px] xl:px-[240px]">
    <div class="p-[24px] md:px-[48] md:pt-[80px] xl:p-0 w-full">
      <MyBadges />
      <Categories />
      <FAQ class="mt-[173px]" />
      <Quests class="mt-[89px]" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.badge {
  &-header {
    height: 0;
    width: 100%;
    padding-bottom: 520px;
    background: url('@/assets/images/badge/header-pc.jpg') center / cover no-repeat;

    @media (max-width: 1024px) {
      padding-bottom: 66.7%;
      background-image: url('@/assets/images/badge/header-mob.jpg');
    }
  }
}
</style>
