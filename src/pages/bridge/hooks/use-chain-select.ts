import { ENV_VARIABLE } from '@/lib/constants'
import { type ChainConfig } from '@/entities/bridge'
import { WALLET, WALLET_TYPE } from '@/entities/wallet'
import { CHAIN } from '@/entities/chain'
import { useWallet } from '@/composables/hooks/use-wallet'

export const useChainSelect = (configs: Ref<ChainConfig[] | undefined>) => {
  const { wallet } = useWallet()

  const select = reactive({
    from: ENV_VARIABLE.VITE_DEFAULT_SELECT_FROM as CHAIN,
    to: ENV_VARIABLE.VITE_DEFAULT_SELECT_TO as CHAIN
  })
  const fromChainList = computed(() => {
    const list = configs.value ?? []
    const walletName = wallet.value?.name
    if (walletName === WALLET.BYBIT) {
      return list.filter((chain) => [CHAIN.BEVM, CHAIN.MERLIN].includes(chain.chainName))
    }
    return list
  })
  const fromConfig = computed(() => configs.value?.find(config => config.chainName === select.from))
  const toChainList = computed(() => {
    const list = fromConfig.value?.toChains ?? []
    const walletName = wallet.value?.name
    if (walletName === WALLET.BYBIT) {
      return list.filter((chain) => [CHAIN.BEVM, CHAIN.MERLIN].includes(chain.chainName))
    }
    return list
  })
  const toConfig = computed(() => toChainList.value.find(config => config.chainName === select.to))
  const platformFee = computed(() => toConfig.value?.platformFee)
  const toMaxSat = computed(() => toConfig.value?.toMaxSat)

  watch(() => [fromConfig.value, fromChainList.value], ([config]) => {
    const isValid = fromChainList.value.length > 0
    if (config == null && isValid) {
      select.from = fromChainList.value[0].chainName
    }
  })
  watch(() => [toConfig.value, fromChainList.value], ([config]) => {
    const isValid = toChainList.value.length > 0
    if (config == null && isValid) {
      select.to = toChainList.value[0].chainName
    }
  })

  const onSelectReset = (type: WALLET_TYPE) => {
    if (fromChainList.value.length === 0) return
    if (type === WALLET_TYPE.BITCOIN) {
      select.from = CHAIN.BTC
    } else {
      if (select.from !== CHAIN.BTC) return
      for (const fromChain of fromChainList.value) {
        if (fromChain.chainName !== CHAIN.BTC) {
          select.from = fromChain.chainName
          break
        }
      }
    }
  }

  return {
    select,
    fromChainList,
    fromChainConfig: fromConfig,
    platformFee,
    toMaxSat,
    toChainList,
    onSelectReset
  }
}
