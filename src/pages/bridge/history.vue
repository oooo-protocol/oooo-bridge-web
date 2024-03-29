<script setup lang="ts">
import { useWindowSize, useInfiniteScroll } from '@vueuse/core'
import { retrieveTransactionList } from '@/request/api/bridge'
import Icon from '@/components/Icon.vue'
import dayjs from 'dayjs'
import { BridgeContainer, BridgeHeader } from './components/BridgeContainer'
import { useWallet } from '@/composables/hooks/use-wallet'
import { combineURLs, formatHashWithEllipsis } from '@/lib/utils'
import type { TransactionListItem } from '@/entities/bridge'
import { CHAIN_IMAGE_MAP, TRANSACTION_STATUS_MAP, CHAIN_BLOCK_EXPLORER_URL_MAP } from '@/lib/constants'
import LoadingIcon from '@/components/LoadingIcon.vue'

const { width } = useWindowSize()
const router = useRouter()
const { wallet } = useWallet()
const el = ref<HTMLDivElement>()

const history = reactive({
  pageNumber: 1,
  pageSize: 10,
  list: [] as TransactionListItem[],
  isLoading: false,
  isFinished: false
})

const onLoad = async () => {
  if (history.isFinished || !wallet.value) return
  history.isLoading = true
  const { totalCount, list } = await retrieveTransactionList({
    fromWalletAddr: wallet.value.address,
    page: history.pageNumber,
    size: history.pageSize
  })
  history.isLoading = false
  if (list != null) {
    history.list.push(...list)
  }
  if (history.list.length === totalCount) {
    history.isFinished = true
  }
}

useInfiniteScroll(
  el,
  async () => {
    await onLoad()
  },
  { distance: 10, canLoadMore: () => !history.isFinished && !history.isLoading }
)

const formatDate = (date: string) => {
  return dayjs(date).format('MM-DD HH:mm:ss')
}
</script>

<template>
  <BridgeContainer>
    <BridgeHeader
      title="_ HISTORY"
      @close="router.back"
      is-close
    />
    <div
      ref="el"
      class="px-[16px] py-[24px] md:px-[40px] h-[480px] overflow-auto"
    >
      <div class="space-y-[24px] xl:space-y-[40px]">
        <div
          class="oooo-bridge-history__item grid items-start md:grid-cols-3 gap-y-[12px] pb-[24px] xl:pb-[40px]"
          v-for="item of history.list"
          :key="item.fromTxnHash"
        >
          <div class="md:col-span-3 flex items-center gap-[4px] text-[#a4a4a4]">
            <Icon
              class="text-[24px]"
              name="time"
            />
            <p class="md:text-[18px] leading-[24px] tracking-[0.67px]">
              {{ formatDate(item.createTime) }}
            </p>
          </div>
          <div>
            <div class="flex items-center gap-[4px]">
              <img
                class="w-[24px] h-[24px]"
                :src="CHAIN_IMAGE_MAP[item.fromChainName]"
              >
              <p class="leading-[24px]">
                {{ item.fromSwapAmount }} {{ item.fromAssetCode }}
              </p>
            </div>
            <div class="flex items-center gap-[4px] ml-[28px] mt-[4px]">
              <Icon :name="TRANSACTION_STATUS_MAP[item.fromStatus].icon" />
              <p class="text-[14px] md:text-[16px] text-[#616161] leading-none">
                Tx:
                <a
                  :href="combineURLs(CHAIN_BLOCK_EXPLORER_URL_MAP[item.fromChainName], `/tx/${item.fromTxnHash}`)"
                  target="_blank"
                >
                  {{ formatHashWithEllipsis(item.fromTxnHash) }}
                </a>
              </p>
            </div>
          </div>
          <Icon
            class="self-center md:justify-self-center text-[24px]"
            :name="width < 768 ? 'a-transferdownside' : 'a-transferleftside'"
          />
          <div>
            <div class="flex items-center gap-[4px]">
              <img
                class="w-[24px] h-[24px]"
                :src="CHAIN_IMAGE_MAP[item.toChainName]"
              >
              <p class="leading-[24px]">
                {{ item.toSwapAmount }} {{ item.toAssetCode }}
              </p>
            </div>
            <div class="flex items-center gap-[4px] ml-[28px] mt-[4px]">
              <Icon :name="TRANSACTION_STATUS_MAP[item.toStatus].icon" />
              <p class="text-[14px] md:text-[16px] text-[#616161] leading-none">
                <template v-if="item.toTxnHash">
                  Tx:
                  <a
                    :href="combineURLs(CHAIN_BLOCK_EXPLORER_URL_MAP[item.toChainName], `/tx/${item.toTxnHash}`)"
                    target="_blank"
                  >
                    {{ formatHashWithEllipsis(item.toTxnHash) }}
                  </a>
                </template>
                <template v-else>
                  Waiting
                </template>
              </p>
            </div>
          </div>
        </div>
      </div>
      <p
        class="oooo-bridge-history__status"
        v-if="history.isFinished"
      >
        {{ history.list.length > 0 ? 'NO MORE' : 'NO HISTORY RECORD' }}
      </p>
      <p
        class="oooo-bridge-history__status"
        v-if="history.isLoading"
      >
        <LoadingIcon />
      </p>
    </div>
  </BridgeContainer>
</template>

<style lang="scss" scoped>
.oooo-bridge-history {
  &__item {
    @apply border-b border-[#616161];
  }

  &__status {
    @apply flex justify-center py-[16px] text-[12px] text-[#a4a4a4];
  }
}
</style>
