import { ENV_VARIABLE } from '@/lib/constants'
import { type ChainConfig } from '@/entities/bridge'
import { WALLET_TYPE } from '@/entities/wallet'
import { CHAIN } from '@/entities/chain'

export const useChainSelect = (configs: Ref<ChainConfig[] | undefined>) => {
  const select = reactive({
    from: ENV_VARIABLE.VITE_DEFAULT_SELECT_FROM as CHAIN,
    to: ENV_VARIABLE.VITE_DEFAULT_SELECT_TO as CHAIN
  })
  const fromConfig = computed(() => configs.value?.find(config => config.chainName === select.from))
  const toChainList = computed(() => fromConfig.value?.toChains ?? [])
  const toConfig = computed(() => fromConfig.value?.toChains.find(config => config.chainName === select.to))
  const platformFee = computed(() => toConfig.value?.platformFee)
  const isNeedToAddress = computed(() => toConfig.value?.wAddress)
  const toMaxSat = computed(() => toConfig.value?.toMaxSat)

  watch(() => [fromConfig.value, configs.value], ([config]) => {
    const isValid = configs.value && configs.value.length > 0
    if (config == null && isValid) {
      select.from = configs.value![0].chainName
    }
  })
  watch(() => [toConfig.value, configs.value], ([config]) => {
    const isValid = toChainList.value.length > 0
    if (config == null && isValid) {
      select.to = toChainList.value[0].chainName
    }
  })

  const onSelectReset = (type: WALLET_TYPE) => {
    if (!configs.value) return
    if (type === WALLET_TYPE.BITCOIN) {
      select.from = CHAIN.BTC
    } else {
      if (select.from !== CHAIN.BTC) return
      for (const fromChain of configs.value) {
        if (fromChain.chainName !== CHAIN.BTC) {
          select.from = fromChain.chainName
          break
        }
      }
    }
  }

  return {
    select,
    fromChainConfig: fromConfig,
    platformFee,
    toMaxSat,
    toChainList,
    isNeedToAddress,
    onSelectReset
  }
}
