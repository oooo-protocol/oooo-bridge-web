<script setup lang="ts">
import { useInfiniteScroll } from '@vueuse/core'
import { retrieveTransactionList } from '@/request/api/bridge'
import Icon from 'oooo-components/ui/Icon.vue'
import dayjs from 'dayjs'
import { BridgeContainer, BridgeHeader } from './components/BridgeContainer'
import type { Transaction } from '@/entities/bridge'
import { CHAIN_IMAGE_MAP } from '@/lib/constants'
import LoadingIcon from '@/components/LoadingIcon.vue'
import NeedHelp from './components/NeedHelp.vue'
import { CexDetailModal } from './components/CexDetail'
import { createFuncall } from 'vue-funcall'
import { CHAIN } from '@/entities/chain'
import { TRANSACTION_STATUS } from '@/entities/bridge'
import { useWallet } from '@/composables/hooks/use-wallet'
import BinancePayDetailModal from './components/CexDetail/BinancePayDetailModal.vue'
import TransactionStatus from './components/TransactionStatus.vue'

const router = useRouter()
const el = ref<HTMLDivElement>()

const { address } = useWallet()

const history = reactive({
  pageNumber: 1,
  pageSize: 10,
  list: [] as Transaction[],
  isLoading: false,
  isFinished: false
})

const onLoad = async () => {
  if (history.isFinished) return
  if (address.value == null) return
  history.isLoading = true
  const { totalCount, list } = await retrieveTransactionList({
    fromWalletAddr: address.value,
    page: history.pageNumber,
    size: history.pageSize
  })
  history.isLoading = false
  if (list != null) {
    history.list.push(...list)
    history.pageNumber += 1
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

const openDetailModal = (item: Transaction) => {
  const Modal = item.fromChainName === CHAIN.BINANCE_PAY ? BinancePayDetailModal : CexDetailModal
  createFuncall(Modal, {
    modelValue: true,
    assetType: item.fromAssetType,
    assetCode: item.fromAssetCode,
    fromChain: item.fromChainName,
    fromTxnHash: item.fromTxnHash,
    fromWalletAddr: item.fromWalletAddr
  })
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
      class="px-[16px] py-[24px] md:px-[40px] h-[620px] overflow-auto"
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
            <TransactionStatus
              class="ml-[28px] mt-[4px]"
              :status="item.fromStatus"
              :chain-name="item.fromChainName"
              :txn-hash="item.fromTxnHash"
              @checking="openDetailModal(item)"
            />
          </div>
          <Icon
            class="shrink-0 mx-auto text-[24px] text-primary rotate-90 md:rotate-0"
            name="next"
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
            <TransactionStatus
              class="ml-[28px] mt-[4px]"
              v-if="![TRANSACTION_STATUS.CLOSED, TRANSACTION_STATUS.TIMEOUT].includes(item.fromStatus)"
              :status="item.toStatus"
              :chain-name="item.toChainName"
              :txn-hash="item.toTxnHash"
            />
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
    <div class="flex justify-center py-[20px] px-[16px]">
      <NeedHelp />
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
