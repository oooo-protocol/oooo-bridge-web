<script setup lang="ts">
import Icon from '@/components/Icon.vue'
import { useEVMWallet } from '@/composables/oooo-wallet'

defineProps<{
  icon: string
  title: string
  status?: boolean
}>()

const { address } = useEVMWallet()
</script>

<template>
  <div class="flex items-center gap-[8px] px-[8px] py-[10px] border boreder-[#5a6960] rounded-[2px]">
    <img
      class="w-[32px] h-[32px]"
      :src="icon"
    >
    <p
      class="text-[14px]"
      v-html="title"
    />
    <div
      class="ml-auto"
      v-if="address"
    >
      <Icon
        name="Finish"
        class="text-[22px] text-[#abeec4]"
        v-if="status"
      />
      <div
        class="px-[6px] py-[3px] rounded-[2px] bg-[#787878] text-[14px] font-[500] text-[#000]"
        v-else-if="status === false"
      >
        NOT ELIGIBLE
      </div>
      <slot v-else />
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
