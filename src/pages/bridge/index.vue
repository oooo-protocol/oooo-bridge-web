<script setup lang="ts">
import Icon from 'oooo-components/ui/Icon.vue'
import ChainSelect from './components/ChainSelect.vue'
import TokenSelect from './components/TokenSelect.vue'
import Button from 'oooo-components/ui/button/Button.vue'
import Input from 'oooo-components/ui/input/Input.vue'
import { BridgeContainer, BridgeHeader, BridgeContent } from './components/BridgeContainer'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { retrieveTransactionConfig, transfer, retrieveChainConfigs } from '@/request/api/bridge'
import Decimal from 'decimal.js-light'
import { useWallet } from '@/composables/hooks/use-wallet'
import { ENV_VARIABLE, EVM_ADDRESS_REGEXP } from '@/lib/constants'
import LoadingIcon from '@/components/LoadingIcon.vue'
import { useToast } from 'oooo-components/ui/toast/use-toast'
import PageLoading from '@/components/PageLoading.vue'
import { createFuncall } from 'vue-funcall'
import WalletConnectModal from '@/components/wallet-connect/WalletConnectModal.vue'
import { Form, FormField, FormMessage } from 'oooo-components/ui/form'
import NumberInput from './components/NumberInput.vue'
import { type RuleExpression } from 'vee-validate'
import { ResponseError } from '@/request/axios'
import { Network, validate } from 'bitcoin-address-validation'
import { useChainSelect } from './hooks/use-chain-select'
import { WALLET_TYPE } from '@/entities/wallet'
import { NoAlarmException } from '@/lib/exception'
import { CHAIN, NETWORK } from '@/entities/chain'
import { useTimeSpend } from './hooks/use-time-spend'
import { useInvite } from './hooks/use-invite'
import { useChainQuery } from './hooks/use-chain-query'
import TransferProcessingModal from './components/TransferProcessingModal.vue'
import { useChainBalance } from './hooks/use-chain-balance'
import { CexDetailModal } from './components/CexDetail'

const { wallet, getWalletType, sign, transaction, getPublicKey, onLogout } = useWallet()

const router = useRouter()
const { toast } = useToast()

useInvite()

const { isPending: initializing, isError: isConfigInvalid, data: configs } = useQuery({
  queryKey: ['/v1/bridge/chain/list'],
  queryFn: retrieveChainConfigs
})
const { select, fromChainList, fromChainConfig, platformFee, toMaxSat, toChainList, onSelectReset } = useChainSelect(configs)
useChainQuery(fromChainList, select)
const balance = useChainBalance(select)

const form = reactive<{
  token: string
  amount: string
  receiveAddress?: string
}>({
  token: 'BTC',
  amount: '',
  receiveAddress: undefined
})
const BRIDGE_TEXT = useTimeSpend(select, toMaxSat)
watch(() => [wallet.value, fromChainList.value], ([wallet]) => {
  if (!wallet) return
  const type = getWalletType()
  onSelectReset(type)
}, {
  immediate: true
})

watch(() => [select.from], () => {
  if (!wallet.value) return
  if (select.from === CHAIN.BINANCE_CEX) return
  const walletType = getWalletType()
  if (walletType === WALLET_TYPE.BITCOIN && select.from === CHAIN.BTC) return
  if (walletType === WALLET_TYPE.ETHEREUM && select.from !== CHAIN.BTC) return
  void onLogout()
  onConnect()
})

const onConnect = () => {
  createFuncall(WalletConnectModal, {
    modelValue: true,
    chain: select.from
  })
}

/** --------------------- Update receiveAddress field  -------------- */
watch(wallet, (wallet, oldWallet) => {
  /**
   * when wallet change, we will update when trigger follow scenarios
   * 1. wallet disconnect, direct set `undefined`
   * 2. wallet connect Bitcoin / wallet connect Ethereum but select chain contain Bitcoin, set `undefined`
   * 3. wallet change and (receiveAddress not value / receiveAddress value not old wallet address), set `walletAddress`
   */
  if (!wallet) {
    form.receiveAddress = undefined
    return
  }
  const walletType = getWalletType()
  if (walletType === WALLET_TYPE.BITCOIN || [select.from, select.to].includes(CHAIN.BTC)) {
    form.receiveAddress = undefined
    return
  }
  const edited = oldWallet && form.receiveAddress != null && form.receiveAddress !== oldWallet.address
  if (!edited) {
    form.receiveAddress = wallet.address
  }
}, {
  immediate: true
})

watch(() => select.from, (from, oldFrom) => {
  /**
   * when from change, we will update when trigger follow scenarios
   * 1. `from` chain from bitcoin to ethereum, and `to` chain not to bitcoin, set `walletAddress`
   * 2. `from` chain or `to` chain is bitcoin, clear `walletAddress`
   */
  if (oldFrom === CHAIN.BTC && select.to !== CHAIN.BTC) {
    form.receiveAddress = wallet.value?.address
  } else if (from === CHAIN.BTC || select.to === CHAIN.BTC) {
    form.receiveAddress = undefined
  }
})
watch(() => select.to, (to, oldTo) => {
  /**
   * when from change, we will update when trigger follow scenarios
   * 1. `to` chain from bitcoin to ethereum, and `from` chain not to bitcoin, set `walletAddress`
   * 2. `from` chain or `to` chain is bitcoin, clear `walletAddress`
   */
  if (oldTo === CHAIN.BTC && select.from !== CHAIN.BTC) {
    form.receiveAddress = wallet.value?.address
  } else if (to === CHAIN.BTC || select.from === CHAIN.BTC) {
    form.receiveAddress = undefined
  }
})
/** --------------------- End  -------------- */

const loading = ref(false)
const min = computed(() => fromChainConfig.value?.minAmount ?? 0.00001)
const max = computed(() => {
  const maxAmount = fromChainConfig.value?.maxAmount ?? 0.0001
  if (balance.value != null) {
    /**
     * fix decimal >= 7, js will use exponential notation display, it will cause user max input error when balance toString
     *  use `Decimal.greaterThan` instead of `Math.min` to avoid transform to exponential notation
     */
    return new Decimal(balance.value).greaterThan(maxAmount) ? maxAmount : balance.value
  }
  return maxAmount
})

const isInsufficient = computed(() => {
  return Number(balance.value) < Number(form.amount)
})
const estimateAmount = computed(() => {
  const amount = Number(form.amount)
  if (Number.isNaN(amount) || platformFee.value == null) return 0
  const to = new Decimal(amount).minus(platformFee.value)
  return Number(to) < 0 ? 0 : to
})

const serviceFee = computed(() => Number(platformFee.value) === 0 ? 'FREE' : `${platformFee.value} BTC`)

const onSwitch = () => {
  [select.from, select.to] = [select.to, select.from]
}

const rules: Record<string, RuleExpression<any>> = {
  amount: (val: string) => {
    if (isConfigInvalid.value) {
      return 'NO ROUTE AVAILABLE, PLEASE TRY AGAIN LATER.'
    }
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
    const isBTCAddress = select.to === CHAIN.BTC
    if (isBTCAddress) {
      const network = ENV_VARIABLE.VITE_NETWORK === NETWORK.LIVENET ? Network.mainnet : Network.testnet
      if (!validate(val, network)) {
        return 'INVALID WALLET ADDRESS'
      }
    } else {
      // it's assumed to be a EVM address
      if (!EVM_ADDRESS_REGEXP.test(val)) {
        return 'INVALID WALLET ADDRESS'
      }
    }
    return true
  }
}

const checkBalanceIsEnough = (chain: CHAIN, amount: string | number, gasPrice: string | number) => {
  if (balance.value == null) return
  amount = Number(amount)
  gasPrice = Number(gasPrice)

  let estimateGas: number
  const ratio = 1.5

  if (chain === CHAIN.BTC) {
    /**
     * 400 is a normal bytes
     */
    estimateGas = gasPrice * 200 * 1e-8
  } else {
    estimateGas = (gasPrice * 21000) * 1e-18 * ratio
  }
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
  mutationFn: transfer,
  retry: true
})

const createCexTransaction = async (parameter: {
  fromChain: CHAIN
  fromAddress: string
  amount: string
  toChain: CHAIN
  toAddress: string
}) => {
  if (parameter.fromChain !== CHAIN.BINANCE_CEX) throw new Error(`${parameter.fromChain} not support cex transaction`)

  const signContent = JSON.stringify({
    ...parameter,
    timestamp: +new Date()
  })
  const signature = await sign(signContent, parameter.fromAddress)
  const publicKey = await getPublicKey()
  if (publicKey == null) {
    throw new Error('INVALID SIGNATURE, PLEASE TRY AGAIN.')
  }

  /**
   * Not need infinite retries to ensure transfer submitted
   */
  const { fromTxnHash } = await transfer({
    ...parameter,
    signature,
    signContent,
    publicKey: publicKey!
  })

  createFuncall(CexDetailModal, {
    modelValue: true,
    fromChain: parameter.fromChain,
    fromTxnHash,
    fromWalletAddr: parameter.fromAddress
  })
}

const createChainTransaction = async (parameter: {
  fromChain: CHAIN
  fromAddress: string
  amount: string
  toChain: CHAIN
  toAddress: string
}) => {
  const config = await retrieveTransactionConfig({
    fromChain: parameter.fromChain,
    fromAddress: parameter.fromAddress,
    fromAmount: parameter.amount,
    toChain: parameter.toChain,
    toAddress: parameter.toAddress
  })
  /**
   * Estimate transaction fee to avoid balance exceeded
   */
  checkBalanceIsEnough(parameter.fromChain, parameter.amount, config.gasPrice)

  const signContent = JSON.stringify({
    ...parameter,
    timestamp: +new Date()
  })
  const signature = await sign(signContent, parameter.fromAddress)
  const publicKey = await getPublicKey()
  if (publicKey == null) {
    throw new Error('INVALID SIGNATURE, PLEASE TRY AGAIN.')
  }
  const { close } = createFuncall(TransferProcessingModal, {
    modelValue: true,
    fromChain: parameter.fromChain,
    fromAmount: parameter.amount,
    toChain: parameter.toChain,
    toAmount: estimateAmount.value.toString()
  })
  try {
    const hash = await transaction({
      chain: parameter.fromChain,
      from: parameter.fromAddress,
      to: config.platformAddress,
      gas: config.gasPrice,
      value: parameter.amount
    })
    await sendTransfer({
      ...parameter,
      txnHash: hash,
      signature,
      signContent,
      publicKey: publicKey!
    })
    await router.push({
      name: 'transaction-detail',
      params: {
        chain: select.from,
        hash
      }
    })
  } finally {
    await close()
  }
}

const onSubmit = async (values: Record<string, any>) => {
  const address = wallet.value?.address
  if (address == null) {
    onConnect()
    return
  }
  try {
    loading.value = true
    const parameter = {
      fromChain: select.from,
      fromAddress: address,
      toChain: select.to,
      toAddress: values.receiveAddress,
      amount: values.amount
    }
    if (parameter.fromChain === CHAIN.BINANCE_CEX) {
      await createCexTransaction(parameter)
    } else {
      await createChainTransaction(parameter)
    }
  } catch (e) {
    let message = (e as Error).message
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
  if (ENV_VARIABLE.VITE_NETWORK !== NETWORK.LIVENET) return false
  if (select.to === CHAIN.BITLAYER) return 8
  if (select.from === CHAIN.BINANCE_CEX && select.to === CHAIN.MERLIN) return 4
  return false
})
</script>

<template>
  <BridgeContainer class="oooo-bridge">
    <BridgeHeader
      class="flex flex-col md:flex-row-reverse md:items-center md:pt-[40px]"
      :title="ENV_VARIABLE.VITE_TITLE"
    >
      <div class="flex flex-col md:flex-row gap-[8px] md:gap-[20px] mt-[40px] md:mt-0 md:mr-[20px]">
        <div
          class="relative min-w-[219px]"
          v-if="ENV_VARIABLE.VITE_NETWORK === NETWORK.TESTNET"
        >
          <p class="absolute -top-[24px] left-0 text-[13px] text-[#a4a4a4]">
            TEST TOKEN ON DISCORD FAUCET
          </p>
          <Button
            class="cursor-pointer gap-[8px] justify-start h-auto font-normal w-full"
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
        <TokenSelect v-model="form.token" />
      </div>
    </BridgeHeader>
    <PageLoading v-if="initializing" />
    <BridgeContent v-else>
      <Form
        @submit="onSubmit"
        v-slot="{ setFieldValue }"
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
            v-model="select.from"
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
                  :decimal="8"
                />
                <button
                  class="xl:text-[19px] pl-[8px] cursor-pointer text-[#ff5402]"
                  :class="{
                    'cursor-not-allowed': !wallet
                  }"
                  :disabled="!wallet"
                  @click.prevent="setFieldValue('amount', max)"
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
            v-model="select.to"
            :list="toChainList"
          >
            <template #suffix>
              <div class="flex flex-col items-end md:flex-row md:items-center gap-[12px] md:gap-[8px] w-full select-none overflow-hidden">
                <p class="w-full text-[19px] text-right truncate">
                  {{ estimateAmount }}
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
        <p class="oooo-bridge__title">
          SERVICE FEE
          <span v-if="select.from === CHAIN.BINANCE_CEX && select.to === CHAIN.MERLIN">
            FREE
          </span>
        </p>
        <p class="oooo-bridge__description">
          <span v-if="select.from === CHAIN.BINANCE_CEX && select.to === CHAIN.MERLIN">
            GAS
          </span>
          {{ serviceFee }} |
          <span class="underline">
            {{ BRIDGE_TEXT.SAVE_AMOUNT }}
          </span>
        </p>
        <p class="oooo-bridge__title">
          TIME SPEND
        </p>
        <p class="oooo-bridge__description">
          {{ BRIDGE_TEXT.TIME_SPEND }} |
          <span
            class="underline"
            v-if="BRIDGE_TEXT.SAVE_TIME"
          >
            {{ BRIDGE_TEXT.SAVE_TIME }}
          </span>
          <span
            class="text-[#FF5402]"
            v-if="BRIDGE_TEXT.ERROR"
          >
            {{ BRIDGE_TEXT.ERROR }}
          </span>
        </p>
        <Button
          class="mt-[32px] w-full md:w-[240px]"
          :disabled="loading || isInsufficient"
        >
          <LoadingIcon
            v-if="loading"
            class="w-4 h-4 mr-2"
          />
          {{ isInsufficient ? 'INSUFFICIENT FUNDS' : 'TRANSFER' }}
        </Button>
      </Form>
    </BridgeContent>
  </BridgeContainer>
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
    @apply mt-[16px];
  }

  &__description {
    @apply leading-[1] text-[#616161];
  }
}
</style>
