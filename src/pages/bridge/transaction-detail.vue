<script setup lang="ts">
import { BridgeContainer, BridgeHeader, BridgeContent } from './components/BridgeContainer'
import Icon from 'oooo-components/ui/Icon.vue'
import { useQuery } from '@tanstack/vue-query'
import { retrieveTransactionDetail, retrieveTransactionStatus } from '@/request/api/bridge'
import { TRANSACTION_STATUS, type Transaction } from '@/entities/bridge'
import { useWallet } from '@/composables/hooks/use-wallet'
import PageLoading from '@/components/PageLoading.vue'
import { combineURLs } from '@/lib/utils'
import { formatHashWithEllipsis } from 'oooo-components/lib/utils'
import { CHAIN_IMAGE_MAP, TRANSACTION_STATUS_MAP, CHAIN_BLOCK_EXPLORER_URL_MAP } from '@/lib/constants'
import TRANSFER_FAILED_IMAGE from '@/assets/images/transfer-failed.png'
import TRANSFER_SUCCED_IMAGE from '@/assets/images/transfer-success.png'
import TRANSFER_PROCESSING_IMAGE from '@/assets/images/transfer-loading.gif'
import { type CHAIN } from '@/entities/chain'
import { getArrayFirst } from '@preflower/utils'

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
  if (data.fromStatus === TRANSACTION_STATUS.PENDING) {
    return TRANSACTION_DETAIL_STATUS.PENDING
  } else if (data.fromStatus === TRANSACTION_STATUS.FAILED) {
    return TRANSACTION_DETAIL_STATUS.FAILED
  } else if (data.fromStatus === TRANSACTION_STATUS.PROCESSING) {
    return TRANSACTION_DETAIL_STATUS.FROM_WAIT_CONFIRMED
  }
  if (data.toStatus === TRANSACTION_STATUS.PENDING) {
    return TRANSACTION_DETAIL_STATUS.TO_WAIT_DELIVERED
  } else if (data.toStatus === TRANSACTION_STATUS.PROCESSING) {
    return TRANSACTION_DETAIL_STATUS.TO_WAIT_CONFIRMED
  } else if (data.toStatus === TRANSACTION_STATUS.FAILED) {
    return TRANSACTION_DETAIL_STATUS.FAILED
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
  <BridgeContainer>
    <BridgeHeader
      title="_ TRANSFER"
      @close="router.back"
      is-close
    />
    <BridgeContent
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
            <div class="transaction-detail-tx">
              <Icon
                class="transaction-detail-tx__icon"
                :name="TRANSACTION_STATUS_MAP[data.fromStatus].icon"
              />
              <p class="transaction-detail-tx__text">
                TX:
                <a
                  :href="combineURLs(CHAIN_BLOCK_EXPLORER_URL_MAP[data.fromChainName], `/tx/${data.fromTxnHash}`)"
                  target="_blank"
                >
                  {{ formatHashWithEllipsis(data.fromTxnHash) }}
                </a>
              </p>
            </div>
            <p
              class="transaction-detail__error"
              v-if="data.fromStatus === TRANSACTION_STATUS.FAILED"
            >
              TRANSACTION FAILED
            </p>
          </div>
          <Icon
            class="shrink-0 mx-auto text-[24px] text-primary rotate-90 md:rotate-0"
            name="next"
          />
          <div class="w-full">
            <div class="transaction-detail-token">
              <img
                class="transaction-detail-token__image"
                :src="CHAIN_IMAGE_MAP[data.toChainName]"
              >
              <p class="transaction-detail-token__text">
                {{ data.toSwapAmount }} {{ data.toAssetCode }}
              </p>
            </div>
            <div class="transaction-detail-txs">
              <div
                class="transaction-detail-tx"
                v-if="!data.toTxnHash"
              >
                <Icon
                  class="transaction-detail-tx__icon"
                  name="time"
                />
                <p class="transaction-detail-tx__text">
                  WAITING
                </p>
              </div>
              <template
                v-else
              >
                <div class="transaction-detail-tx">
                  <Icon
                    class="transaction-detail-tx__icon"
                    :name="TRANSACTION_STATUS_MAP[data.toStatus].icon"
                  />
                  <p class="transaction-detail-tx__text">
                    TX:
                    <a
                      :href="combineURLs(CHAIN_BLOCK_EXPLORER_URL_MAP[data.toChainName], `/tx/${data.toTxnHash}`)"
                      target="_blank"
                    >
                      {{ formatHashWithEllipsis(data.toTxnHash) }}
                    </a>
                  </p>
                </div>
                <p
                  v-if="data.toStatus === TRANSACTION_STATUS.FAILED"
                  class="transaction-detail__error"
                >
                  TRANSACTION FAILED
                </p>
              </template>
            </div>
          </div>
        </div>
      </template>
    </BridgeContent>
  </BridgeContainer>
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

  &-txs {
    @apply space-y-[4px]
  }

  &-tx {
    @apply flex items-center gap-[4px] mt-[8px] md:mt-[16px];

    &__icon {
      @apply text-[16px];
    }

    &__text {
      @apply text-[14px] md:text-[16px] leading-[1.14] md:leading-[1] tracking-[0.88px] text-[#616161];
    }
  }

  &__error {
    @apply ml-[20px] mt-[2px] text-[14px] font-[300] leading-[1.14] tracking-[0.88px] text-[#ff5402];
  }
}
</style>
