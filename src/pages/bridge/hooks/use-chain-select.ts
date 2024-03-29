import { CHAIN, ENV_VARIABLE } from '@/lib/constants'
import { type ChainConfig } from '@/entities/bridge'
import { watchOnce } from '@vueuse/core'
import { getArrayFirst } from '@preflower/utils'
import { WALLET_TYPE } from '@/entities/wallet'

export const useChainSelect = (configs: Ref<ChainConfig[] | undefined>) => {
  const route = useRoute()

  const select = reactive({
    from: ENV_VARIABLE.VITE_DEFAULT_SELECT_FROM as CHAIN,
    to: ENV_VARIABLE.VITE_DEFAULT_SELECT_TO as CHAIN
  })
  const fromConfig = computed(() => configs.value?.find(config => config.chainName === select.from))
  const toChainList = computed(() => fromConfig.value?.toChains ?? [])
  const toConfig = computed(() => fromConfig.value?.toChains.find(config => config.chainName === select.to))
  const platformFee = computed(() => toConfig.value?.platformFee)
  const isNeedToAddress = computed(() => toConfig.value?.wAddress)

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

  watchOnce(configs, (list) => {
    if (!list) return
    const queryToChain = getArrayFirst(route.query.to) as CHAIN
    if (queryToChain == null) return
    for (const fromChain of list) {
      const isIncludeToChain = fromChain.toChains.findIndex(chain => chain.chainName === queryToChain) > -1
      if (isIncludeToChain) {
        select.from = fromChain.chainName
        select.to = queryToChain
        return
      }
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
    toChainList,
    isNeedToAddress,
    onSelectReset
  }
}
