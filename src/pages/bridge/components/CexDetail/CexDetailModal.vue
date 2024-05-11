<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from 'oooo-components/ui/dialog'
import { BRIDGE_TEXT_MAP, CHAIN_IMAGE_MAP } from '@/lib/constants'
import Icon from 'oooo-components/ui/Icon.vue'
import { type CHAIN } from '@/entities/chain'
import ClipboardText from './ClipboardText.vue'
import { Button } from 'oooo-components/ui/button'
import TRANSFER_PROCESSING_DARK_IMAGE from '@/assets/images/transfer-loading.dark.gif'
import { useQuery } from '@tanstack/vue-query'
import { retrieveTransactionDetail } from '@/request/api/bridge'
import PageLoading from '@/components/PageLoading.vue'

const open = defineModel<boolean>()

const props = defineProps<{
  fromChain: CHAIN
  fromTxnHash: string
  fromWalletAddr: string
}>()

const parameters = computed(() => ({
  fromChain: props.fromChain,
  fromTxnHash: props.fromTxnHash,
  fromWalletAddr: props.fromWalletAddr
}))
const { data } = useQuery({
  queryKey: ['/v1/bridge/transaction/detail', parameters],
  queryFn: async () => await retrieveTransactionDetail(parameters.value)
})

const isCompleted = ref(false)

const binanceInfo = computed(() => {
  if (!data.value) return []
  return [
    { text: 'SEND TO BINANCE ID', value: data.value.platformAddr!, description: data.value.platformName },
    { text: 'CURRENCY', value: data.value.fromAssetCode },
    { text: 'AMOUNT', value: Number(data.value.fromSwapAmount) },
    { text: 'NOTE', value: data.value.fromTxnHash }
  ]
})

const TIME_SPEND_TEXT = computed(() => {
  const current = new Date().getUTCHours()
  if (current >= 1 && current < 10) {
    return BRIDGE_TEXT_MAP.CEX_TIME_SPEND
  } else {
    return BRIDGE_TEXT_MAP.CEX_BUSY_TIME_SEPND
  }
})

</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent
      @pointer-down-outside.prevent
      @escape-key-down.prevent
    >
      <template #header>
        <DialogHeader>
          <DialogTitle>_ TRANSFER PROCESSING</DialogTitle>
        </DialogHeader>
      </template>
      <template #content>
        <PageLoading v-if="!data" />
        <template v-else-if="!isCompleted">
          <div
            class="px-[16px] py-[24px] md:px-[40px] md:py-[32px] overflow-y-auto"
          >
            <div class="flex flex-col md:flex-row items-start gap-[12px] md:gap-[44px]">
              <div class="w-full">
                <div class="flex items-center gap-[8px] p-[8px] border border-[#5a6960] bg-[#212322] rounded-md">
                  <img
                    :src="CHAIN_IMAGE_MAP[fromChain]"
                    class="w-[32px] h-[32px]"
                  >
                  <p class="text-[21px] md:text-[24px] leading-[1]">
                    {{ Number(data.fromSwapAmount) }} BTC
                  </p>
                </div>
                <div class="mt-[8px] md:mt-[10px] flex items-center gap-[8px] text-[#616161]">
                  <Icon name="time" />
                  <p class="text-[14px] -tracking-tighter">
                    CHECKING TRANSFER…
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
                  {{ Number(data.toSwapAmount) }} BTC
                </p>
              </div>
            </div>
            <div class="mt-[30px]">
              <h2 class="pb-[8px] border-b border-[#404943] md:text-[19px] -tracking-tighter">
                BINANCE TRANSFER INSTRUCTIONS
              </h2>
              <div class="pt-[20px] pb-[4px] space-y-[20px]">
                <div
                  class="flex flex-col md:flex-row md:items-center justify-between"
                  v-for="(item, index) of binanceInfo"
                  :key="index"
                >
                  <p class="text-[#a4a4a4] text-[14px] md:text-base -tracking-tighter">
                    {{ item.text }}
                  </p>
                  <ClipboardText
                    :text="item.value"
                    :description="item.description"
                  />
                </div>
              </div>
            </div>
            <div class="flex gap-[8px] text-[#ff961e]">
              <Icon
                class="shrink-0 my-[2px]"
                name="imp"
              />
              <p class="text-[14px] -tracking-tighter">
                Note must be included for your transfer. Please do not use this note for duplicate transfers.
              </p>
            </div>
          </div>
          <div class="px-[16px] pt-[10px] pb-[24px] md:px-[40px] flex flex-col md:flex-row gap-[10px]">
            <Button
              variant="secondary"
              @click="isCompleted = true"
            >
              I HAVE TRANSFERRED
            </Button>
            <Button
              as="a"
              href="https://www.binance.com/en/my/wallet/account/payment/send"
              target="_blank"
            >
              GO TO BINANCE PAY
            </Button>
          </div>
        </template>
        <template v-else>
          <div
            class="px-[16px] py-[24px] md:px-[40px] md:py-[32px] overflow-y-auto"
          >
            <img
              class="m-auto my-[16px] md:my-[30px] w-[130px] h-[130px] md:w-[180px] md:h-[180px]"
              :src="TRANSFER_PROCESSING_DARK_IMAGE"
            >
            <p class="-tracking-tighter">
              WE WILL CONFIRM YOUR TRANSFER WITHIN {{ TIME_SPEND_TEXT }}
            </p>
          </div>
          <div class="px-[16px] pt-[10px] pb-[24px] md:px-[40px] flex flex-col md:flex-row gap-[10px]">
            <Button
              class="h-auto text-wrap"
              variant="secondary"
              @click="isCompleted = false"
            >
              I HAVEN'T TRANSFERRED
            </Button>
            <Button
              class="w-full md:w-[140px]"
              @click="open = false"
            >
              OK
            </Button>
          </div>
        </template>
      </template>
    </DialogContent>
  </Dialog>
</template>
