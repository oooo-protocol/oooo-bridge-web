<script setup lang="ts">
import { OContainer, OHeader, OContent } from '@/components/OContainer'
import Icon from 'oooo-components/ui/Icon.vue'
import { useQuery } from '@tanstack/vue-query'
import { retrieveTransactionDetail, retrieveTransactionStatus } from '@/request/api/bridge'
import { TRANSACTION_STATUS, type Transaction } from '@/entities/bridge'
import { useWallet } from '@/composables/hooks/use-wallet'
import PageLoading from '@/components/PageLoading.vue'
import { CHAIN_IMAGE_MAP } from '@/lib/constants'
import TRANSFER_FAILED_IMAGE from '@/assets/images/transfer-failed.png'
import TRANSFER_SUCCED_IMAGE from '@/assets/images/transfer-success.png'
import TRANSFER_PROCESSING_IMAGE from '@/assets/images/transfer-loading.gif'
import { type CHAIN } from '@/entities/chain'
import { getArrayFirst } from '@preflower/utils'
import TransactionStatus from './components/TransactionStatus.vue'
import QuestCarousel from './components/QuestCarousel.vue'
import PointTag from './components/PointTag.vue'

enum TRANSACTION_DETAIL_STATUS {
  PENDING,
  FROM_WAIT_CONFIRMED,
  FROM_CONFIRMED_ON_CHAIN,
  TO_WAIT_DELIVERED,
  TO_WAIT_CONFIRMED,
  TO_CONFIRMED_ON_CHAIN,
  FAILED,
  SUCCEED
}

const TRANSACTION_DETAIL_STATUS_IMAGE_MAP = {
  [TRANSACTION_DETAIL_STATUS.PENDING]: TRANSFER_PROCESSING_IMAGE,
  [TRANSACTION_DETAIL_STATUS.FROM_WAIT_CONFIRMED]: TRANSFER_PROCESSING_IMAGE,
  [TRANSACTION_DETAIL_STATUS.FROM_CONFIRMED_ON_CHAIN]: TRANSFER_PROCESSING_IMAGE,
  [TRANSACTION_DETAIL_STATUS.TO_WAIT_DELIVERED]: TRANSFER_PROCESSING_IMAGE,
  [TRANSACTION_DETAIL_STATUS.TO_WAIT_CONFIRMED]: TRANSFER_PROCESSING_IMAGE,
  [TRANSACTION_DETAIL_STATUS.TO_CONFIRMED_ON_CHAIN]: TRANSFER_PROCESSING_IMAGE,
  [TRANSACTION_DETAIL_STATUS.FAILED]: TRANSFER_FAILED_IMAGE,
  [TRANSACTION_DETAIL_STATUS.SUCCEED]: TRANSFER_SUCCED_IMAGE
}

const route = useRoute()
const router = useRouter()
const props = defineProps<{
  chain: CHAIN
  hash: string
}>()

const { address } = useWallet()

const transactionDetailStatus = ref(TRANSACTION_DETAIL_STATUS.PENDING)
const getTransactionDetailStatus = (data?: Transaction) => {
  if (data == null) return TRANSACTION_DETAIL_STATUS.PENDING
  switch (data.fromStatus) {
    case TRANSACTION_STATUS.PENDING:
      return TRANSACTION_DETAIL_STATUS.PENDING
    case TRANSACTION_STATUS.FAILED:
    case TRANSACTION_STATUS.CLOSED:
    case TRANSACTION_STATUS.REFUNDED:
    case TRANSACTION_STATUS.TIMEOUT:
      return TRANSACTION_DETAIL_STATUS.FAILED
    case TRANSACTION_STATUS.PROCESSING:
      return TRANSACTION_DETAIL_STATUS.FROM_WAIT_CONFIRMED
  }
  switch (data.toStatus) {
    case TRANSACTION_STATUS.PENDING:
      return TRANSACTION_DETAIL_STATUS.TO_WAIT_DELIVERED
    case TRANSACTION_STATUS.FAILED:
    case TRANSACTION_STATUS.CLOSED:
    case TRANSACTION_STATUS.REFUNDED:
    case TRANSACTION_STATUS.TIMEOUT:
      return TRANSACTION_DETAIL_STATUS.FAILED
    case TRANSACTION_STATUS.PROCESSING:
      return TRANSACTION_DETAIL_STATUS.TO_WAIT_CONFIRMED
  }
  return TRANSACTION_DETAIL_STATUS.SUCCEED
}
const enabled = computed(() => address.value != null)
const { data, refetch } = useQuery({
  queryKey: ['/v1/bridge/transaction/detail', props.hash],
  queryFn: async () => await retrieveTransactionDetail({
    fromChain: props.chain,
    fromTxnHash: props.hash,
    fromWalletAddr: address.value!,
    fromAssetType: getArrayFirst(route.query.fromAssetType) ?? undefined,
    fromAssetCode: getArrayFirst(route.query.fromAssetCode) ?? undefined
  }),
  refetchInterval: (query) => {
    const transaction = query.state.data
    const status = getTransactionDetailStatus(transaction)
    /**
     * No change if server status later than local status
     */
    if (status > transactionDetailStatus.value) {
      transactionDetailStatus.value = status
    }
    /**
     * FROM_CONFIRMED_ON_CHAIN, TO_WAIT_DELIVERED, TO_CONFIRMED_ON_CHAIN
     * Polling be trigger if server return above status
     */
    if (
      transactionDetailStatus.value === TRANSACTION_DETAIL_STATUS.FROM_CONFIRMED_ON_CHAIN ||
      transactionDetailStatus.value === TRANSACTION_DETAIL_STATUS.TO_WAIT_DELIVERED ||
      transactionDetailStatus.value === TRANSACTION_DETAIL_STATUS.TO_CONFIRMED_ON_CHAIN
    ) {
      return 3000
    }
    return false
  },
  refetchOnWindowFocus: false,
  enabled
})
const toBeCheckedHash = computed(() => {
  if (data.value == null) return
  if (
    data.value.fromStatus === TRANSACTION_STATUS.PENDING ||
    data.value.fromStatus === TRANSACTION_STATUS.PROCESSING
  ) {
    return {
      source: 'from',
      chain: data.value.fromChainName,
      hash: data.value.fromTxnHash
    }
  }
  if (data.value.toStatus === TRANSACTION_STATUS.PROCESSING) {
    return {
      source: 'to',
      chain: data.value.toChainName,
      hash: data.value.toTxnHash!
    }
  }
  return undefined
})
const enableCheckHash = computed(() => toBeCheckedHash.value != null)
useQuery({
  queryKey: ['retrieveTransactionStatus', toBeCheckedHash],
  queryFn: async () => await retrieveTransactionStatus(
    toBeCheckedHash.value!.chain,
    toBeCheckedHash.value!.hash
  ),
  refetchInterval: (query) => {
    if (
      query.state.data === TRANSACTION_STATUS.FAILED ||
      query.state.data === TRANSACTION_STATUS.SUCCEED
    ) {
      /**
       * Update transaction status
       */
      if (toBeCheckedHash.value!.source === 'from') {
        transactionDetailStatus.value = TRANSACTION_DETAIL_STATUS.FROM_CONFIRMED_ON_CHAIN
      } else if (toBeCheckedHash.value!.source === 'to') {
        transactionDetailStatus.value = TRANSACTION_DETAIL_STATUS.TO_CONFIRMED_ON_CHAIN
      }
      void refetch()
      return false
    } else {
      return 2000
    }
  },
  refetchOnWindowFocus: false,
  enabled: enableCheckHash
})
</script>

<template>
  <OContainer>
    <OHeader
      title="_ TRANSFER"
      @close="router.back"
      is-close
    />
    <OContent
      class="md:pt-[70px] md:pb-[56px] xl:pt-[64px]"
    >
      <PageLoading v-if="!data" />
      <template v-else>
        <img
          class="m-auto w-[130px] h-[130px] md:w-[180px] md:h-[180px]"
          :src="TRANSACTION_DETAIL_STATUS_IMAGE_MAP[transactionDetailStatus]"
        >
        <div class="flex flex-col md:flex-row gap-[12px] md:gap-[44px] mt-[24px] md:mt-[58px] xl:mt-[64px]">
          <div class="w-full">
            <div class="transaction-detail-token">
              <img
                class="transaction-detail-token__image"
                :src="CHAIN_IMAGE_MAP[data.fromChainName]"
              >
              <p class="transaction-detail-token__text">
                {{ data.fromSwapAmount }} {{ data.fromAssetCode }}
              </p>
            </div>
            <TransactionStatus
              class="mt-[8px] md:mt-[16px]"
              :status="data.fromStatus"
              :chain-name="data.fromChainName"
              :txn-hash="data.fromTxnHash"
            />
          </div>
          <Icon
            class="shrink-0 mx-auto mt-[13px] text-[24px] text-primary rotate-90 md:rotate-0"
            name="next"
          />
          <div class="relative w-full">
            <div class="transaction-detail-token">
              <img
                class="transaction-detail-token__image"
                :src="CHAIN_IMAGE_MAP[data.toChainName]"
              >
              <p class="transaction-detail-token__text">
                {{ data.toSwapAmount }} {{ data.toAssetCode }}
              </p>
            </div>
            <TransactionStatus
              class="mt-[8px] md:mt-[16px]"
              v-if="![TRANSACTION_STATUS.CLOSED, TRANSACTION_STATUS.TIMEOUT].includes(data.fromStatus)"
              :status="data.toStatus"
              :chain-name="data.toChainName"
              :txn-hash="data.toTxnHash"
            />
            <PointTag
              v-if="data.point"
              class="absolute right-0 -top-[40px]"
              type="goooo"
            >
              +{{ data.point }}
            </PointTag>
          </div>
        </div>
      </template>
      <div class="mt-[40px] md:mt-[50px] md:px-[44px]">
        <QuestCarousel />
      </div>
    </OContent>
  </OContainer>
</template>

<style lang="scss" scoped>
.transaction-detail {
  &-token {
    @apply flex items-center gap-[8px] p-[8px] rounded-[2px] border border-[#5a6960] bg-[#212322];

    &__image {
      @apply w-[32px] h-[32px];
    }

    &__text {
      @apply text-[21px] md:text-[24px] leading-[1.14] tracking-[0.88px];
    }
  }
}
</style>
