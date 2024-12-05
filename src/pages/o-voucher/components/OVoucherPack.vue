<script setup lang="ts">
import { type VoucherPack } from '@/entities/voucher'
import dayjs from 'dayjs'
import { createFuncall } from 'vue-funcall'
import OVoucherPackDescriptionModal from './OVoucherPackDescriptionModal.vue'
import Icon from '@/components/Icon.vue'

defineProps<{
  pack: VoucherPack
  active?: boolean
}>()

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY/MM/DD HH:mm')
}

const onClickDescription = (description: string) => {
  createFuncall(OVoucherPackDescriptionModal, {
    modelValue: true,
    description
  })
}
</script>

<template>
  <div
    class="o-voucher-pack flex flex-col"
    :class="{
      'o-voucher-pack--active': active
    }"
  >
    <p class="text-[28px] md:text-[32px] font-[500] -tracking-tighter">
      {{ pack.title }}
    </p>
    <p class="text-[14px] md:text-[16px] font-[500] -tracking-tighter">
      o-VOUCHER PACK
    </p>
    <div class="mt-[16px] md:mt-[42px] flex justify-between items-end text-[10px]">
      <div>
        <p>CLAIM DURING</p>
        <p class="w-[160px] md:w-full">
          {{ formatDate(pack.startTime) }} - {{ formatDate(pack.endTime) }}
        </p>
      </div>
      <Icon
        class="text-[18px] text-[#616161]"
        name="issue"
        @click="onClickDescription(pack.description)"
      />
    </div>
  </div>
</template>

<style lang="scss">
.o-voucher-pack {
  @apply mt-[8px] w-[220px] md:w-[310px] p-[16px] pr-[10px] bg-[#e4e7e5] rounded-md text-[#000000]/[0.85] cursor-pointer;
  box-shadow: 0 -16px 0 -8px #8b8b8b;
  transition: all 0.2s ease-in-out;

  &--active {
    @apply bg-[#bce4cd];
    box-shadow: 0 -16px 0 -8px #677d70;
  }
}
</style>
