<script setup lang="ts">
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from 'oooo-components/ui/popover'
import { CHAIN_IMAGE_MAP } from '@/lib/constants'
import { TRANSACTION_STATUS } from '@/entities/bridge'

import Icon from 'oooo-components/ui/Icon.vue'
import { type CHAIN } from '@/entities/chain'
import { Button } from 'oooo-components/ui/button'
import { useQuery } from '@tanstack/vue-query'
import { retrieveTransactionDetail } from '@/request/api/bridge'
import PageLoading from '@/components/PageLoading.vue'
import { usePreventUnload } from '../../hooks/use-before-unload'
import CountDown from './CountDown.vue'
import copy from 'copy-text-to-clipboard'
import { useToast } from 'oooo-components/ui/toast'
import { createFuncall } from 'vue-funcall'
import AlertPro from '@/components/AlertPro.vue'

const { toast } = useToast()

const props = defineProps<{
  isSharing?: boolean
  fromChain: CHAIN
  fromTxnHash: string
  fromWalletAddr: string
}>()

usePreventUnload()

const router = useRouter()

const parameters = computed(() => ({
  fromChain: props.fromChain,
  fromTxnHash: props.fromTxnHash,
  fromWalletAddr: props.fromWalletAddr
}))
const { isFetching: loading, data, refetch } = useQuery({
  queryKey: ['/v1/bridge/transaction/detail', parameters],
  queryFn: async () => await retrieveTransactionDetail(parameters.value),
  refetchInterval: (query) => {
    const transaction = query.state.data
    if (transaction == null || transaction.fromStatus === TRANSACTION_STATUS.PROCESSING || transaction.fromStatus === TRANSACTION_STATUS.PENDING) {
      return 3000
    }
    if (transaction.fromStatus === TRANSACTION_STATUS.SUCCEED) {
      void onSucceed()
    }
    return false
  },
  refetchOnWindowFocus: false
})
const binancePayOrder = computed(() => data.value?.binancePayOrder)

enum STATUS {
  PENDING,
  UNABLE,
  SUCCEED
}

const currentStatus = ref(STATUS.PENDING)

const onSucceed = async () => {
  if (props.isSharing) {
    currentStatus.value = STATUS.SUCCEED
  } else {
    await router.push({
      name: 'transaction-detail',
      params: {
        chain: props.fromTxnHash,
        hash: props.fromTxnHash
      },
      query: {
        fromAssetCode: data.value?.fromAssetCode,
        fromAssetType: data.value?.fromAssetType
      }
    })
  }
}

const container = ref<HTMLDivElement | null>(null)

const onClickUnable = () => {
  currentStatus.value = STATUS.UNABLE
  onCopyPaymentLink()
}

const onCopyPaymentLink = () => {
  const success = copy(`${location.origin}/binance-pay?fromChain=${props.fromChain}&fromTxnHash=${props.fromTxnHash}&fromWalletAddr=${props.fromWalletAddr}`, {
    target: container.value!
  })
  if (success) {
    toast({
      description: '💌 Copied to clipboard!'
    })
  }
}

const onClickPaid = async () => {
  const { data } = await refetch()
  if (!data || data.fromStatus !== TRANSACTION_STATUS.SUCCEED) {
    toast({
      description: 'The payment result has not been found yet. If you have completed the payment, please wait for the order to be processed later.'
    })
  }
}

const onTimeEnd = () => {
  createFuncall(AlertPro, {
    modelValue: true,
    description: 'The order has expired, please place a new order.',
    onConfirm: () => {
      void router.replace('bridge')
    }
  })
}
</script>

<template>
  <div
    ref="container"
    class="px-[16px] py-[24px] md:px-[40px] md:py-[32px]"
  >
    <PageLoading v-if="!data || !binancePayOrder" />
    <div v-else-if="currentStatus === STATUS.PENDING">
      <div class="flex flex-col md:flex-row items-start gap-[12px] md:gap-[44px]">
        <div class="w-full">
          <div class="flex items-center gap-[8px] p-[8px] border border-[#5a6960] bg-[#212322] rounded-md">
            <img
              :src="CHAIN_IMAGE_MAP[fromChain as CHAIN]"
              class="w-[32px] h-[32px]"
            >
            <p class="text-[21px] md:text-[24px] leading-[1]">
              {{ Number(data.fromSwapAmount) }} {{ data.fromAssetCode }}
            </p>
          </div>
          <div class="mt-[8px] md:mt-[10px] flex items-center gap-[8px] text-[#616161]">
            <Icon name="time" />
            <p class="text-[14px] -tracking-tighter">
              TRACKING TRANSFER
            </p>
          </div>
        </div>
        <Icon
          class="shrink-0 mx-auto h-[50px] text-[24px] text-primary rotate-90 md:rotate-0"
          name="next"
        />
        <div class="flex items-center gap-[8px] p-[8px] border border-[#5a6960] bg-[#212322] rounded-md w-full">
          <img
            :src="CHAIN_IMAGE_MAP[data.toChainName]"
            class="w-[32px] h-[32px]"
          >
          <p class="text-[21px] md:text-[24px] leading-[1]">
            {{ Number(data.toSwapAmount) }} {{ data.toAssetCode }}
          </p>
        </div>
      </div>
      <div class="mt-[16px] mb-[24px] md:my-[32px] px-[16px] pt-[14px] border border-[#5a6960] bg-[#212322]">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <img
            src="@/assets/images/binance-pay.png"
            class="h-[24px]"
          >
          <p class="text-[12px] text-[#a4a4a4]">
            PAYMENT PAGE EXPIRES IN
            <CountDown
              class="text-[#fccc0a]"
              :time="binancePayOrder.expireTime - Date.now()"
              @finish="onTimeEnd"
            />
          </p>
        </div>
        <div class="py-[16px] mx-auto max-w-[265px] flex flex-col items-center">
          <img
            class="mx-auto h-[170px] w-[170px]"
            :src="binancePayOrder.qrcodeLink"
          >
          <Popover>
            <PopoverTrigger as-child>
              <div class="mt-[8px] flex items-center gap-[4px] text-[12px] text-[#a4a4a4] cursor-pointer">
                SCAN TO PAY WITH BINANCE APP
                <Icon
                  class="text-[14px]"
                  name="issue"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent class="p-0 w-[var(--radix-popover-trigger-width)]">
              <img
                class="w-full"
                src="@/assets/images/binance-scan-hint.png"
              >
              <p class="p-[8px] text-[12px]">
                Please scan this QR code with the Binance App, and conntinue to complete the payment.
              </p>
            </PopoverContent>
          </Popover>
          <p class="my-[16px] binance-pay__divider text-[#616161] text-[12px]">
            OR
          </p>
          <Button
            class="w-full bg-[#fccc0a]"
            as="a"
            :href="binancePayOrder.deeplink"
            target="_blank"
          >
            CONTINUE ON BINANCE APP
          </Button>
          <Button
            class="mt-[10px] w-full bg-[#fccc0a]"
            as="a"
            :href="`https://pay.binance.com/checkout/confirm?prepayOrderId=${binancePayOrder.prepayId}`"
            target="_blank"
          >
            CONTINUE ON BROWSER
          </Button>
          <p
            v-if="!isSharing"
            class="mt-[8px] text-[12px] text-[#a4a4a4] cursor-pointer underline"
            @click="onClickUnable"
          >
            UNABLE TO COMPLETE PAYMENT?
          </p>
        </div>
      </div>
      <Button
        class="w-full md:w-[204px]"
        :loading="loading"
        @click="onClickPaid"
      >
        I HAVE PAID
      </Button>
    </div>
    <!-- UNABLE TO COMPLETE PAYMENT? -->
    <div v-else-if="currentStatus === STATUS.UNABLE">
      <p class="py-[8px] border-b border-[#404943] text-[19px]">
        BINANCE TRANSFER INSTRUCTIONS
      </p>
      <p class="my-[24px] -tracking-tighter text-[#a4a4a4]">
        The payment link has copied, you can enter the browser and paste the link to complete the payment.
      </p>
      <div class="pt-[19px] bg-[#212322] rounded-md border border-[#5a6960]">
        <img
          class="mx-auto h-[156px]"
          src="@/assets/images/binance-url-hint.png"
        >
      </div>
      <div class="mt-[32px] flex flex-col-reverse md:flex-row gap-[10px]">
        <Button
          class="w-full md:w-[204px]"
          variant="secondary"
          @click="currentStatus = STATUS.PENDING"
        >
          BACK
        </Button>
        <Button
          class="w-full md:w-[204px]"
          @click="onCopyPaymentLink"
        >
          COPY PAYMENT LINK
        </Button>
      </div>
    </div>
    <!-- COMPLETED -->
    <div v-else>
      <img
        class="my-[24px] md:mt-[40px] mx-auto h-[180px]"
        src="@/assets/images/transfer-success.png"
      >
      <p class="-tracking-tighter text-[#a4a4a4]">
        You have completed the payment, please return to the previous page to check the other status.
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.binance-pay {
  &__divider {
    @apply flex items-center gap-[14px] w-full;

    &::before, &::after {
      flex: 1;
      content: '';
      height: 1px;
      background-color: #616161;
    }
  }
}
</style>
