<script setup lang="ts">
import PaginationPro from '@/components/PaginationPro.vue'
import useSignatureStore from '@/store/signature'
import PageLoading from '@/components/PageLoading.vue'
import { retrieveVouchers } from '@/request/api/voucher'
import { useQuery } from '@tanstack/vue-query'
import { VOUCHER_STATUS, type VoucherPariConfig } from '@/entities/voucher'
import Icon from 'oooo-components/ui/Icon.vue'
import { defineMap } from '@preflower/utils'
import dayjs from 'dayjs'
import OVoucherPairModal from './OVoucherPairModal.vue'
import { createFuncall } from 'vue-funcall'

const signature = useSignatureStore()

const VOUCHER_ALL_STATUS = 'all'

const CATEGORYS = [
  {
    label: 'ALL',
    value: VOUCHER_ALL_STATUS
  }, {
    label: 'AVAILABLE',
    value: VOUCHER_STATUS.AVAILABLE
  }, {
    label: 'USED',
    value: VOUCHER_STATUS.USED
  }, {
    label: 'EXPIRED',
    value: VOUCHER_STATUS.EXPIRED
  }
]
const CATEGORY_LABEL_MAP = defineMap(CATEGORYS, 'value', 'label')

const currentCategory = ref<VOUCHER_STATUS | string>(VOUCHER_ALL_STATUS)
const pageSize = 6
const pageNumber = ref(1)
const isPending = ref(false)

const { isPending: loading, data } = useQuery({
  queryKey: ['/voucher/record/list', pageSize, pageNumber, currentCategory],
  queryFn: async () => {
    const status = currentCategory.value === VOUCHER_ALL_STATUS ? undefined : currentCategory.value as VOUCHER_STATUS
    return await retrieveVouchers({
      ...signature.signInfo!,
      page: pageNumber.value,
      pagesize: pageSize,
      status
    })
  }
})

const onClickCategory = (category: VOUCHER_STATUS | string) => {
  currentCategory.value = category
  pageNumber.value = 1
}

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY/MM/DD HH:mm')
}

const formatPariConfigs = (configs: VoucherPariConfig[]) => {
  return configs.slice(0, 2).map(config => config.desc).join(', ')
}

const onClickMorePairs = (configs: VoucherPariConfig[]) => {
  createFuncall(OVoucherPairModal, {
    modelValue: true,
    configs
  })
}
</script>

<template>
  <template v-if="signature.signInfo">
    <h3 class="mt-[76px] -tracking-tighter">
      MY o-VOUCHER
    </h3>
    <div class="mt-[22px] flex border-b border-[#bce4cd]/[0.6]">
      <p
        class="px-[10px] py-[8px] text-[#616161] text-[14px] md:text-[16px] cursor-pointer select-none"
        :class="{
          'text-[#bce4cd]': currentCategory === category.value
        }"
        v-for="category of CATEGORYS"
        :key="category.value"
        @click="onClickCategory(category.value)"
      >
        {{ category.label }}
      </p>
    </div>
    <template v-if="data && data.list.length > 0">
      <div class="grid md:grid-cols-2 gap-[16px] md:gap-[20px] py-[30px] md:px-[30px]">
        <div
          class="o-voucher"
          :class="{
            'o-voucher--disabled': voucher.status !== VOUCHER_STATUS.AVAILABLE
          }"
          v-for="voucher of data.list"
          :key="voucher.voucherRecordId"
        >
          <div class="relative z-[1] p-[12px] md:p-[16px]">
            <img
              class="w-[40px] h-[40px] md:w-[44px] md:h-[44px]"
              :src="voucher.icon"
            >
            <p class="mt-[4px] text-[28px] md:text-[32px] font-[500] -tracking-tighter leading-[1.25]">
              {{ voucher.discountAmount }} {{ voucher.assetCode }}
            </p>
            <div class="mt-[12px] md:mt-[16px] text-[12px] text-[#a4a4a4]/[0.85] leading-[1.25]">
              <p v-if="voucher.pairConfigs == null || voucher.pairConfigs.length === 0">
                AVAILABLE FOR {{ voucher.assetCode }} BRIDGE PAIRS
              </p>
              <p v-else>
                <span>{{ formatPariConfigs(voucher.pairConfigs) }}</span>
                <span
                  class="underline cursor-pointer"
                  v-if="voucher.pairConfigs.length > 2"
                  @click="onClickMorePairs(voucher.pairConfigs)"
                >
                  MORE PAIRS >
                </span>
              </p>
              <p>
                {{ formatDate(voucher.startTime) }} - {{ formatDate(voucher.endTime) }}
              </p>
            </div>
          </div>
          <p
            class="o-voucher-category"
            :class="`o-voucher-category--${currentCategory}`"
            v-if="voucher.status !== VOUCHER_STATUS.AVAILABLE"
          >
            {{ CATEGORY_LABEL_MAP[currentCategory] }}
          </p>
        </div>
      </div>
      <PaginationPro
        v-model:page="pageNumber"
        :total="data.totalCount"
        :disabled="isPending"
        :items-per-page="pageSize"
        show-edges
      />
    </template>
    <PageLoading v-else-if="loading" />
    <div
      class="flex flex-col justify-center items-center min-h-[300px]"
      v-else
    >
      <p class="text-[#abeec4] font-[500] -tracking-tighter">
        NO o-VOUCHER AVAILABLE
      </p>
      <p class="mt-[16px] text-[#a4a4a4] text-[12px] text-center">
        FOLLOW
        <Icon
          class="inline text-[16px]"
          name="issue1"
        />
        <Icon
          class="ml-[8px] inline text-[16px]"
          name="issuebeifen"
        />
        AND PARTICIPATE IN EVENTS TO GET
      </p>
    </div>
  </template>
</template>

<style lang="scss" scoped>
.o-voucher {
  @apply relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
      radial-gradient(circle at right top, transparent 8px, #212322 0) 0 0 / 26% 50% no-repeat,
      radial-gradient(circle at right bottom, transparent 8px, #212322 0) 0 100% / 26% 50% no-repeat,
      radial-gradient(circle at left top, transparent 8px, #212322 0) 100% 0 / 74.5% 50.5% no-repeat,
      radial-gradient(circle at left bottom, transparent 8px, #212322 0) 100% 100% / 74.5% 50.5% no-repeat;
    filter: drop-shadow(0 0 1px #5a6960) drop-shadow(0 0 1px #5a6960);
    border-radius: 4px;
  }

  &--disabled {
    &::before {
      filter: drop-shadow(0 0 1px #5a6960) drop-shadow(0 0 1px #5a6960) grayscale(1);
    }
  }

  &-category {
    @apply absolute top-[16px] right-[16px] px-[4px] py-[2px] text-[12px] text-[#000] rounded-md;

    &--1 {
      @apply bg-[#b6d3c1];
    }

    &--2 {
      @apply bg-[#eb7241];
    }
  }
}
</style>
