<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import Icon from '@/components/Icon.vue'
import { useVoucher } from '../hooks/use-voucher'
import dayjs from 'dayjs'
import { type EstimateData } from '@/entities/bridge'

const props = defineProps<{
  pairId?: number
  estimateData?: EstimateData
}>()
const open = ref(false)
const selectedId = defineModel<number | undefined>()

const { vouchers } = useVoucher(computed(() => props.pairId))
const selectedVoucher = computed(() => vouchers.value?.find((v) => v.voucherRecordId === selectedId.value))

const isShowVoucherCell = computed(() => props.estimateData != null && vouchers.value != null && vouchers.value.length > 0)

watch(vouchers, (vouchers) => {
  if (!vouchers || vouchers.length === 0) {
    selectedId.value = undefined
    return
  }

  selectedId.value = vouchers[0].voucherRecordId
})

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY/MM/DD HH:mm')
}

const onSelectChange = (id?: number) => {
  if (selectedId.value === id) return
  selectedId.value = id
  open.value = false
}
</script>

<template>
  <div
    class="flex"
    v-if="isShowVoucherCell"
  >
    <Icon
      class="mr-[8px] text-[18px] text-[#616161]"
      name="time"
    />
    <div
      class="flex flex-col md:flex-row md:items-center gap-[8px] text-[14px] leading-[1.2] cursor-pointer"
      @click="open = true"
    >
      <p
        class="text-[#616161]"
      >
        o-VOUCHER
        <template v-if="selectedVoucher">
          -{{ estimateData!.discount }} |
        </template>
      </p>
      <div class="flex items-center gap-[8px]">
        <p
          class="text-[#a4a4a4]"
        >
          <template v-if="!selectedVoucher">
            DON'T USE o-VOUCHER
          </template>
          <template v-else-if="estimateData?.save">
            SAVE ${{ estimateData.save }}
          </template>
        </p>
        <Icon
          class="text-[18px] text-[#616161]"
          name="arrow1"
        />
      </div>
    </div>
    <Dialog v-model:open="open">
      <DialogContent
        @pointer-down-outside.prevent
      >
        <template #header>
          <DialogHeader>
            <DialogTitle>_ CHOOSE o-VOUCHER</DialogTitle>
          </DialogHeader>
        </template>
        <div
          class="voucher-cell-item"
          v-for="voucher of vouchers"
          :key="voucher.voucherRecordId"
          @click="onSelectChange(voucher.voucherRecordId)"
        >
          <img
            class="voucher-cell-item__icon"
            :src="voucher.icon"
          >
          <div>
            <p class="voucher-cell-item__title">
              {{ voucher.discountAmount }} {{ voucher.assetCode }}
            </p>
            <p class="voucher-cell-item__description">
              {{ formatDate(voucher.startTime) }} - {{ formatDate(voucher.endTime) }}
            </p>
          </div>
          <i
            class="ml-auto voucher-cell-item__check"
            :class="{
              'voucher-cell-item__check--actived': selectedId === voucher.voucherRecordId
            }"
          />
        </div>
        <div
          class="voucher-cell-item"
          @click="onSelectChange()"
        >
          <p class="voucher-cell-item__title">
            DON'T USE o-VOUCHER
          </p>
          <i
            class="ml-auto voucher-cell-item__check"
            :class="{
              'voucher-cell-item__check--actived': selectedId === undefined
            }"
          />
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style lang="scss" scoped>
.voucher-cell {
  &-item {
    @apply flex items-center gap-[8px] py-[20px] border-b border-[#494949] cursor-pointer;

    &__icon {
      @apply w-[24px] h-[24px];
    }

    &__title {
      @apply md:text-[18px] -tracking-tighter;
    }

    &__description {
      @apply mt-[2px] w-[136px] md:w-full text-[12px] md:text-[14px] text-[#a4a4a4]
    }

    &__check {
      display: block;
      width: 24px;
      height: 24px;
      background: url('@/assets/images/icon/uncheck.png') no-repeat center / contain;

      &--actived {
        background: url('@/assets/images/icon/checked.png') no-repeat center / contain;
      }
    }
  }
}
</style>
