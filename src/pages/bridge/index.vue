<script setup lang="ts">
import Icon from 'oooo-components/ui/Icon.vue'
import ChainSelect from './components/ChainSelect.vue'
import TokenSelect from './components/TokenSelect.vue'
import Button from 'oooo-components/ui/button/Button.vue'
import Input from 'oooo-components/ui/input/Input.vue'
import { OContainer, OHeader, OContent } from '@/components/OContainer'
import { useMutation } from '@tanstack/vue-query'
import { retrieveTransactionConfig, createTransaction } from '@/request/api/bridge'
import Decimal from 'decimal.js-light'
import { useWallet } from '@/composables/hooks/use-wallet'
import { EVM_ADDRESS_REGEXP } from '@/lib/constants'
import { useToast } from 'oooo-components/ui/toast/use-toast'
import PageLoading from '@/components/PageLoading.vue'
import { createFuncall } from 'vue-funcall'
import { Form, FormField, FormMessage } from 'oooo-components/ui/form'
import NumberInput from './components/NumberInput.vue'
import { type RuleExpression } from 'vee-validate'
import { ResponseError } from '@/request/axios'
import { Network, validate } from 'bitcoin-address-validation'
import { NoAlarmException } from 'oooo-components/lib/exception'
import { CHAIN, NETWORK } from '@/entities/chain'
import TransferProcessingModal from './components/TransferProcessingModal.vue'
import { useBalance } from './hooks/use-balance'
import { CexDetailModal, BinancePayDetailModal } from './components/CexDetail'
import { useConfig } from './hooks/use-config'
import { useEstimateData } from './hooks/use-estimate-data'
import { useTimeSpend } from './hooks/use-time-spend'
import { SERVER_ASSET } from '@/entities/server'
import TooltipPro from 'oooo-components/ui/TooltipPro.vue'
import { useInvite } from './hooks/use-invite'
import VoucherCell from './components/VoucherCell.vue'
import { formatEtherError } from '@/lib/utils'
import { type EthersError } from 'ethers'

const { address, transfer, sign, getPublicKey, onConnect, calcEstimateGas } = useWallet()

const router = useRouter()
const { toast } = useToast()

useInvite()

const {
  initializing,
  token,
  from,
  to,
  tokenList,
  fromChainList,
  toChainList,
  config
} = useConfig()
const pairId = computed(() => {
  return config.value?.pairId
})
const form = reactive<{
  amount: string
  receiveAddress?: string
  voucherRecordId?: number
}>({
  amount: '',
  receiveAddress: undefined,
  voucherRecordId: undefined
})
const balance = useBalance(from, config)
const title = import.meta.env.VITE_TITLE
const isTestnetNetwork = import.meta.env.VITE_NETWORK === NETWORK.TESTNET
const { estimating, estimateData } = useEstimateData(
  computed(() => form.amount),
  pairId,
  computed(() => form.voucherRecordId)
)
const toAmount = computed(() => estimateData.value?.toAmount ?? '0')
const serviceFee = computed(() => {
  if (estimateData.value == null) return
  return Number(estimateData.value.actualPlatformFee) === 0 ? 'FREE' : `${estimateData.value.actualPlatformFee} ${token.value}`
})
const SPEND_TEXT = useTimeSpend(to, config)
/** --------------------- Update receiveAddress field  -------------- */
const checkAddress = (address: string, chain: string) => {
  const isBTCAddress = chain === CHAIN.BTC
  if (isBTCAddress) {
    const network = import.meta.env.VITE_NETWORK === NETWORK.LIVENET ? Network.mainnet : Network.testnet
    return validate(address, network)
  } else {
    // it's assumed to be a EVM address
    return EVM_ADDRESS_REGEXP.test(address)
  }
}

watch([to, address], ([to, address]) => {
  if (form.receiveAddress != null) {
    const isValid = checkAddress(form.receiveAddress, to)
    if (isValid) return
  }
  if (address != null) {
    const isValid = checkAddress(address, to)
    if (isValid) {
      form.receiveAddress = address
      return
    }
  }
  form.receiveAddress = undefined
}, {
  immediate: true
})
/** --------------------- End  -------------- */

const loading = ref(false)
const min = computed(() => config.value?.minAmount ?? 0.00001)
const max = computed(() => config.value?.maxAmount ?? 0.0001)
const isInsufficient = computed(() => {
  return Number(balance.value) < Number(form.amount)
})

const onSwitch = () => {
  [from.value, to.value] = [to.value, from.value]
}

const onClickMax = () => {
  const maxAmount = max.value
  if (balance.value != null) {
    /**
     * fix decimal >= 7, js will use exponential notation display, it will cause user max input error when balance toString
     *  use `Decimal.greaterThan` instead of `Math.min` to avoid transform to exponential notation
     */
    form.amount = new Decimal(balance.value).greaterThan(maxAmount) ? String(maxAmount) : balance.value
  } else {
    form.amount = String(maxAmount)
  }
}

const rules: Record<string, RuleExpression<any>> = {
  amount: (val: string) => {
    const amount = Number(val)
    if (Number.isNaN(amount) || amount < min.value) {
      return `THE MINIMUM AMOUNT IS ${min.value}`
    }
    if (amount > Number(max.value)) {
      return `THE MAXIMUM AMOUNT IS ${max.value}`
    }
    return true
  },
  receiveAddress: (val: string) => {
    const isValid = checkAddress(val, to.value)
    if (!isValid) {
      return 'INVALID WALLET ADDRESS'
    }
    return true
  }
}

const checkBalanceIsEnough = (amount: string | number, estimateGas: string | number) => {
  if (balance.value == null) return
  amount = Number(amount)
  estimateGas = Number(estimateGas)

  const estimateCost = amount + estimateGas
  if (estimateCost > Number(balance.value)) {
    const remain = amount - estimateGas
    if (remain > min.value) {
      form.amount = remain.toString()
    } else {
      form.amount = min.value.toString()
    }
    throw new NoAlarmException('NOT ENOUGH BALANCE FOR GAS FEES. BRIDGE AMOUNT WAS AUTOMATICALLY DECREASED.')
  }
}

const { mutateAsync: sendTransfer } = useMutation({
  mutationFn: createTransaction,
  retry: true
})

const createCexTransaction = async (parameter: {
  pairId: number
  tokenName: string
  fromChain: string
  fromAddress: string
  amount: string
  toChain: string
  toAddress: string
  voucherRecordId?: number
}) => {
  if (![CHAIN.BINANCE_CEX, CHAIN.BINANCE_PAY].includes(parameter.fromChain as CHAIN)) throw new Error(`${parameter.fromChain} NOT SUPPORT CEX TRANSACTION`)

  const signContent = JSON.stringify({
    ...parameter,
    timestamp: +new Date()
  })
  const signature = await sign(signContent)
  const publicKey = await getPublicKey()
  if (publicKey == null) {
    throw new Error('INVALID SIGNATURE, PLEASE TRY AGAIN.')
  }

  /**
   * Not need infinite retries to ensure transfer submitted
   */
  const { fromTxnHash } = await sendTransfer({
    ...parameter,
    signature,
    signContent,
    publicKey
  })

  const { assetType, assetCode } = config.value!

  const Modal = parameter.fromChain === CHAIN.BINANCE_CEX ? CexDetailModal : BinancePayDetailModal

  createFuncall(Modal, {
    modelValue: true,
    assetType,
    assetCode,
    fromChain: parameter.fromChain,
    fromTxnHash,
    fromWalletAddr: parameter.fromAddress
  })
}

const createChainTransaction = async (parameter: {
  pairId: number
  tokenName: string
  fromChain: string
  fromAddress: string
  amount: string
  toChain: string
  toAddress: string
  voucherRecordId?: number
}) => {
  const { gasPrice, platformAddress } = await retrieveTransactionConfig({
    pairId: parameter.pairId,
    fromChain: parameter.fromChain,
    fromAddress: parameter.fromAddress,
    fromAmount: parameter.amount,
    toChain: parameter.toChain,
    toAddress: parameter.toAddress
  })

  const { assetType, assetCode, contractAddress } = config.value!

  const transferParameter = {
    from: parameter.fromAddress,
    to: platformAddress,
    gas: gasPrice,
    value: parameter.amount
  }
  if (assetType === SERVER_ASSET.COIN) {
    const estimateGas = await calcEstimateGas(transferParameter, parameter.fromChain)
    /**
     * Estimate transaction fee to avoid balance exceeded
     */
    checkBalanceIsEnough(parameter.amount, estimateGas)
  }
  const signContent = JSON.stringify({
    ...parameter,
    timestamp: +new Date()
  })
  const signature = await sign(signContent)
  const publicKey = await getPublicKey()
  if (publicKey == null) {
    throw new Error('INVALID SIGNATURE, PLEASE TRY AGAIN.')
  }
  const { close } = createFuncall(TransferProcessingModal, {
    modelValue: true,
    tokenName: parameter.tokenName,
    fromChain: parameter.fromChain,
    fromAmount: parameter.amount,
    toChain: parameter.toChain,
    toAmount: toAmount.value
  })
  try {
    let hash: string
    if (parameter.fromChain === CHAIN.BTC) {
      hash = await transfer(transferParameter)
    } else if (assetType === SERVER_ASSET.TOKEN) {
      hash = await transfer(transferParameter, parameter.fromChain, contractAddress)
    } else {
      hash = await transfer(transferParameter, parameter.fromChain)
    }
    await sendTransfer({
      ...parameter,
      txnHash: hash,
      signature,
      signContent,
      publicKey
    })
    await router.push({
      name: 'transaction-detail',
      params: {
        chain: from.value,
        hash
      },
      query: {
        fromAssetCode: assetCode,
        fromAssetType: assetType
      }
    })
  } finally {
    await close()
  }
}

const onSubmit = async (values: Record<string, any>) => {
  if (address.value == null) {
    onConnect()
    return
  }
  try {
    loading.value = true
    const parameter = {
      pairId: config.value!.pairId,
      tokenName: token.value,
      fromChain: from.value,
      fromAddress: address.value,
      toChain: to.value,
      toAddress: values.receiveAddress,
      amount: values.amount,
      voucherRecordId: form.voucherRecordId
    }
    if ([CHAIN.BINANCE_CEX, CHAIN.BINANCE_PAY].includes(parameter.fromChain as CHAIN)) {
      await createCexTransaction(parameter)
    } else {
      await createChainTransaction(parameter)
    }
  } catch (e) {
    let message = formatEtherError(e as EthersError).message
    if (e instanceof ResponseError) {
      if (e.code === 53006) {
        message = 'INVALID RECEVING WALLET ADDRESS'
      }
    }
    toast({
      description: message
    })
    throw e
  } finally {
    loading.value = false
  }
}

const availableGooooPoints = computed(() => {
  if (import.meta.env.VITE_NETWORK !== NETWORK.LIVENET) return false
  return false
})
</script>

<template>
  <OContainer class="oooo-bridge">
    <OHeader
      class="flex flex-col md:flex-row-reverse md:items-center md:pt-[40px]"
      :title="title"
    >
      <div class="flex flex-col md:flex-row md:items-center mt-[20px] md:mt-0 md:mr-auto">
        <p class="mr-[8px] text-[14px] md:text-base text-[#a4a4a4] -tracking-tighter">
          TOKEN
        </p>
        <TokenSelect
          v-model="token"
          :list="tokenList"
        />
        <div
          class="mt-[28px] md:mt-[0] md:ml-[20px] relative min-w-[219px]"
          v-if="isTestnetNetwork"
        >
          <p class="absolute -top-[24px] left-0 text-[14px] md:text-[12px] text-[#a4a4a4] -tracking-tighter">
            TEST TOKEN ON DISCORD FAUCET
          </p>
          <Button
            class="flex cursor-pointer gap-[8px] justify-start h-auto py-[4px] font-normal w-full"
            as="a"
            variant="outline"
            href="https://discord.gg/ooooprotocol"
            target="_blank"
          >
            <Icon
              class="text-[24px]"
              name="a-btcfaucet"
            />
            BTC FAUCET
          </Button>
        </div>
      </div>
    </OHeader>
    <PageLoading v-if="initializing" />
    <OContent v-else>
      <Form
        @submit="onSubmit"
      >
        <div
          class="oooo-bridge__title flex justify-between"
        >
          <p>FROM</p>
          <p v-if="balance != null">
            BALANCE: {{ balance }}
          </p>
        </div>
        <FormField
          v-model="form.amount"
          v-slot="{ componentField }"
          name="amount"
          :rules="rules.amount"
        >
          <ChainSelect
            v-model="from"
            :list="fromChainList"
          >
            <template #suffix>
              <div
                class="ml-auto w-full flex justify-end items-center"
                @click.stop
                @pointerdown.stop
                @pointerup.stop
              >
                <NumberInput
                  class="p-0 bg-transparent border-none text-right"
                  :placeholder="`${min}~${max}`"
                  v-bind="componentField"
                  :decimal="config?.frontDecimal ?? 8"
                />
                <button
                  class="xl:text-[19px] pl-[8px] cursor-pointer text-[#ff5402]"
                  :class="{
                    'cursor-not-allowed': !address
                  }"
                  :disabled="!address"
                  @click.prevent="onClickMax"
                >
                  MAX
                </button>
              </div>
            </template>
          </ChainSelect>
          <Icon
            class="mx-auto my-[16px] md:mt-[20px] xl:mt-[24px] text-[24px] cursor-pointer select-none"
            name="exchage"
            @click="onSwitch"
          />
          <div class="oooo-bridge__title">
            <p>TO</p>
          </div>
          <ChainSelect
            class="items-start"
            v-model="to"
            :list="toChainList"
          >
            <template #suffix>
              <div class="flex flex-col items-end md:flex-row md:items-center gap-[12px] md:gap-[8px] w-full select-none overflow-hidden">
                <p class="w-full text-[19px] text-right truncate">
                  {{ toAmount }}
                </p>
                <p
                  v-if="availableGooooPoints"
                  class="shrink-0 px-[4px] rounded-md bg-[#4d4f4e]"
                >
                  +{{ availableGooooPoints }} Goooo
                </p>
              </div>
            </template>
          </ChainSelect>
          <FormMessage
            class="oooo-bridge__error"
            name="amount"
          />
        </FormField>
        <FormField
          v-model="form.receiveAddress"
          v-slot="{ componentField }"
          name="receiveAddress"
          :rules="rules.receiveAddress"
        >
          <p class="oooo-bridge__title">
            RECEIVING ADDRESS
          </p>
          <Input
            placeholder="PLEASE ENTER THE RECEIVING ADDRESS"
            v-bind="componentField"
          />
          <FormMessage
            class="oooo-bridge__error"
            name="receiveAddress"
          />
        </FormField>
        <Button
          class="mt-[32px] w-full md:w-[240px]"
          :disabled="isInsufficient || estimateData == null"
          :loading="loading || estimating"
        >
          {{ isInsufficient ? 'INSUFFICIENT FUNDS' : 'TRANSFER' }}
        </Button>
      </Form>
      <template v-if="SPEND_TEXT">
        <div class="mt-[16px] flex">
          <Icon
            class="mr-[8px] text-[18px] text-[#616161]"
            name="fee"
          />
          <div class="flex flex-col md:flex-row gap-[8px] text-[14px] leading-[1.2]">
            <p
              class="text-[#616161]"
              v-if="estimateData"
            >
              SERVICE FEE
              <del v-if="Number(estimateData.discount) > 0">{{ estimateData.platformFee }}</del>
              {{ serviceFee }} |
            </p>
            <div class="flex gap-[8px]">
              <p class="text-[#a4a4a4]">
                {{ SPEND_TEXT.SAVE_AMOUNT }}
              </p>
              <TooltipPro message="Fees saved compared to the native bridge fees">
                <Icon
                  class="text-[18px] text-[#616161]"
                  name="issue"
                />
              </TooltipPro>
            </div>
          </div>
        </div>
        <VoucherCell
          class="mt-[8px]"
          :pair-id="pairId"
          v-model="form.voucherRecordId"
          :estimate-data="estimateData"
        />
        <div class="mt-[8px] flex">
          <Icon
            class="mr-[8px] text-[18px] text-[#616161]"
            name="time"
          />
          <div class="flex flex-col md:flex-row gap-[8px] text-[14px] leading-[1.2]">
            <p
              class="text-[#616161]"
            >
              TIME SPEND {{ SPEND_TEXT.TIME_SPEND }} |
            </p>
            <div class="flex gap-[8px]">
              <p class="text-[#a4a4a4]">
                {{ SPEND_TEXT.SAVE_TIME }}
              </p>
              <TooltipPro message="Compared to using the native bridge, the estimated time savings with our service.">
                <Icon
                  class="text-[18px] text-[#616161]"
                  name="issue"
                />
              </TooltipPro>
            </div>
          </div>
        </div>
      </template>
    </OContent>
  </OContainer>
</template>

<style lang="scss" scoped>
.oooo-bridge {
  &__title {
    @apply mb-[8px] text-[#a4a4a4] text-[14px] md:text-[16px];
    &:not(:first-child) {
      @apply mt-[16px];
    }
  }

  &__error {
    @apply mt-[8px];
  }

  &__description {
    @apply leading-[1] text-[#616161];
  }
}
</style>
