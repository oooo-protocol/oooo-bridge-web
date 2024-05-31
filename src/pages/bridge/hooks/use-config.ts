import { type ServerTokenPairConfig, type ServerConfigs, type ServerToken } from '@/entities/server'
import { useConfigQuery } from './use-config-query'
import { useConfigWallet } from './use-config-wallet'
import { CHAIN } from '@/entities/chain'
import { useWallet } from '@/composables/hooks/use-wallet'
import { WALLET } from 'oooo-components/oooo-wallet'

export type PairConfig =
  ServerTokenPairConfig &
  Pick<ServerToken, 'assetType' | 'assetCode' | 'frontDecimal' | 'contractAddress' | 'platformAddress'>

interface ToPair {
  chainName: string
  config: PairConfig
}

interface FromPair {
  chainName: string
  tos: ToPair[]
}

export interface Token {
  tokenName: string
  assetCode: string
  icon: string
}

export interface TokenPair extends Token {
  pairs: FromPair[]
}

export const useConfig = (configs: Ref<ServerConfigs | undefined>) => {
  const { name } = useWallet()
  /**
   * token = tokenName
   */
  const token = ref(import.meta.env.VITE_DEFAULT_SELECT_TOKEN)
  const from = ref(import.meta.env.VITE_DEFAULT_SELECT_FROM)
  const to = ref(import.meta.env.VITE_DEFAULT_SELECT_TO)

  const filterTxPairs = computed(() => {
    if (configs.value == null) return []
    const BYBIT_TO_CHAIN: string[] = [CHAIN.BTC, CHAIN.MERLIN, CHAIN.BEVM]
    if (name.value === WALLET.BYBIT) {
      const BYBIT_FROM_CHAIN: string[] = [CHAIN.MERLIN, CHAIN.BEVM]
      return configs.value.txPairList.filter(pair => BYBIT_FROM_CHAIN.includes(pair.fromChainName) && BYBIT_TO_CHAIN.includes(pair.toChainName))
    }
    if (name.value === WALLET.BYBIT_BITCOIN) {
      const BYBIT_FROM_CHAIN: string[] = [CHAIN.BTC]
      return configs.value.txPairList.filter(pair => BYBIT_FROM_CHAIN.includes(pair.fromChainName) && BYBIT_TO_CHAIN.includes(pair.toChainName))
    }
    return configs.value.txPairList
  })
  const serverTokenMap = computed(() => {
    const map: Record<number, ServerToken> = {}
    if (configs.value == null) return map
    for (const token of configs.value.tokenList) {
      map[token.tokenId] = token
    }
    return map
  })

  useConfigQuery(token, from, to, filterTxPairs)
  useConfigWallet(from)

  const tokens = computed<TokenPair[]>(() => {
    /**
     * Record<tokenName, Token & Record<chainName, ToPair[]>>
     */
    const tokenMap: Record<string, Token & {
      chainMap: Record<string, ToPair[]>
    }> = {}

    for (const pair of filterTxPairs.value) {
      const serverToken = serverTokenMap.value[pair.fromTokenId]
      let tokenChainMap = tokenMap[serverToken.tokenName]
      // init Record<chainName, ToPair[]>
      if (tokenChainMap == null) {
        tokenChainMap = tokenMap[serverToken.tokenName] = {
          tokenName: serverToken.tokenName,
          assetCode: serverToken.assetCode,
          icon: serverToken.icon,
          chainMap: {}
        }
      }

      const chainMap = tokenChainMap.chainMap
      let chain = chainMap[pair.fromChainName]
      // init ToPair[]
      if (chain == null) chain = chainMap[pair.fromChainName] = []

      chain.push({
        chainName: pair.toChainName,
        config: {
          pairId: pair.pairId,
          minAmount: pair.minAmount,
          maxAmount: pair.maxAmount,
          feeSaveTips: pair.feeSaveTips,
          timeSpendTips: pair.timeSpendTips,
          timeSaveTips: pair.timeSaveTips,
          toMaxPrice: pair.toMaxPrice,
          frontDecimal: serverToken.frontDecimal,
          contractAddress: serverToken.contractAddress,
          platformAddress: serverToken.platformAddress,
          assetType: serverToken.assetType,
          assetCode: serverToken.assetCode
        }
      })
    }

    const list = Object.entries(tokenMap).map(([_, token]) => {
      return {
        tokenName: token.tokenName,
        assetCode: token.assetCode,
        icon: token.icon,
        pairs: Object.entries(token.chainMap).map(([chainName, toPairs]) => {
          return {
            chainName,
            tos: toPairs
          }
        })
      }
    })

    return list
  })
  const tokenList = computed(() => {
    if (configs.value == null) return []
    return tokens.value.map(item => ({
      tokenName: item.tokenName,
      assetCode: item.assetCode,
      icon: item.icon
    }))
  })
  const pairs = computed(() => {
    const current = tokens.value.find(t => t.tokenName === token.value)
    return current?.pairs
  })
  const fromChainList = computed(() => {
    if (configs.value == null) return []
    const _pairs = pairs.value
    if (_pairs == null) return []
    return configs.value.chainList.filter(chain => {
      return _pairs.some(pair => pair.chainName === chain.chainName)
    })
  })
  const currentFromPair = computed(() => {
    return pairs.value?.find(pair => pair.chainName === from.value)
  })
  const toChainList = computed(() => {
    if (configs.value == null) return []
    if (currentFromPair.value == null) return []
    const toIds = currentFromPair.value.tos.map(pair => pair.chainName)
    return configs.value.chainList.filter(chain => {
      return toIds.some(chainName => chainName === chain.chainName)
    })
  })
  const config = computed(() => {
    if (currentFromPair.value == null) return null
    const _to = currentFromPair.value.tos.find(pair => pair.chainName === to.value)
    if (_to == null) return null
    return _to.config
  })
  watch([from, fromChainList], ([val]) => {
    const isValid = fromChainList.value.some(chain => chain.chainName === val)
    if (!isValid) {
      from.value = fromChainList.value[0]?.chainName
    }
  })

  watch([to, toChainList], ([val]) => {
    const isValid = toChainList.value.some(chain => chain.chainName === val)
    if (!isValid) {
      to.value = toChainList.value[0]?.chainName
    }
  })

  return {
    token,
    from,
    to,
    tokenList,
    fromChainList,
    toChainList,
    config
  }
}
