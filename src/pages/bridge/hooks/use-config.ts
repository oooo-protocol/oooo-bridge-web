import type { ServerTokenPairConfig, ServerToken, ServerTokenPair } from '@/entities/server'
import { useConfigQuery } from './use-config-query'
import { useConfigWallet } from './use-config-wallet'
import { CHAIN } from '@/entities/chain'
import { useWallet } from '@/composables/hooks/use-wallet'
import { WALLET } from '@/composables/oooo-wallet'
import { retreieveBridgePairs, retrieveBridgeConfigs, retrieveSupportChainsFromToken } from '@/request/api/bridge'
import { useQuery } from '@tanstack/vue-query'
import { defineMap } from '@preflower/utils'
import type { Token, Chain } from '@/entities/bridge'

export type PairConfig =
  ServerTokenPairConfig &
  ServerToken

type ToPair = Chain & {
  config: ServerTokenPairConfig
}

export type Pair = Chain & {
  tos: ToPair[]
}

export const useTokenConfig = () => {
  const { data: configs } = useQuery({
    queryKey: ['/v1/bridge/global/configuration'],
    queryFn: retrieveBridgeConfigs
  })

  const tokenList = computed(() => {
    if (configs.value == null) return undefined

    const chainMap = defineMap(configs.value.chainList, 'chainName', ['showName', 'type'])

    return configs.value.tokenList.map<Chain>(token => {
      const chain = chainMap[token.chainName]
      return {
        ...token,
        ...chain
      }
    })
  })
  /**
 * List of tokens to be displayed to user, so we will eliminate same tokenName item.
 */
  const displayTokenList = computed(() => {
    if (tokenList.value == null) return []
    const _tokenMap: Record<string, Token> = {}
    for (const token of tokenList.value) {
      if (_tokenMap[token.tokenName] == null) {
        _tokenMap[token.tokenName] = {
          tokenName: token.tokenName,
          assetCode: token.assetCode,
          assetType: token.assetType,
          icon: token.icon
        }
      }
    }
    return Object.values(_tokenMap)
  })

  return { tokenList, displayTokenList }
}

export const useConfig = () => {
  const { name } = useWallet()
  /**
   * token = tokenName
   * from / to = chainName
   */
  const token = ref(import.meta.env.VITE_DEFAULT_SELECT_TOKEN)
  const from = ref(import.meta.env.VITE_DEFAULT_SELECT_FROM)
  const to = ref(import.meta.env.VITE_DEFAULT_SELECT_TO)

  const { tokenList, displayTokenList } = useTokenConfig()

  const { isQueryInited } = useConfigQuery(token, from, to, tokenList)

  const { isPending: initializing, data: fromTokenIdList } = useQuery({
    queryKey: ['/v1/bridge/chains/from', token],
    queryFn: async () => {
      const data = await retrieveSupportChainsFromToken({ assetCode: token.value })
      return data
    },
    enabled: isQueryInited,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })
  const fromChainList = computed<Chain[]>(() => {
    if (fromTokenIdList.value == null || tokenList.value == null) return []
    return fromTokenIdList.value.map(tokenId => {
      return tokenList.value!.find(item => item.tokenId === tokenId)
    }).filter(chain => chain != null)
  })
  const { isPending: isLoadingTo, data: rawPairs } = useQuery({
    queryKey: ['/v1/bridge/pairs/by-chain', token, from],
    queryFn: async () => {
      const data = await retreieveBridgePairs({ assetCode: token.value, fromChain: from.value })
      return data
    },
    enabled: isQueryInited,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })
  const tokenMap = computed(() => {
    if (tokenList.value == null) return undefined
    return Object.fromEntries(tokenList.value.map(token => [token.tokenId, token]))
  })

  const filterRawPairs = computed<ServerTokenPair[]>(() => {
    if (rawPairs.value == null) return []
    if (tokenMap.value == null) return []
    const _tokenMap = tokenMap.value
    const BYBIT_TO_CHAIN: string[] = [CHAIN.BTC, CHAIN.MERLIN, CHAIN.BEVM]
    if (name.value === WALLET.BYBIT) {
      const BYBIT_FROM_CHAIN: string[] = [CHAIN.MERLIN, CHAIN.BEVM]
      return rawPairs.value.filter(pair => {
        const fromChainName = _tokenMap[pair.fromTokenId].chainName
        const toChainName = _tokenMap[pair.toTokenId].chainName
        return BYBIT_FROM_CHAIN.includes(fromChainName) && BYBIT_TO_CHAIN.includes(toChainName)
      })
    }
    if (name.value === WALLET.BYBIT_BITCOIN) {
      const BYBIT_FROM_CHAIN: string[] = [CHAIN.BTC]
      return rawPairs.value.filter(pair => {
        const fromChainName = _tokenMap[pair.fromTokenId].chainName
        const toChainName = _tokenMap[pair.toTokenId].chainName
        return BYBIT_FROM_CHAIN.includes(fromChainName) && BYBIT_TO_CHAIN.includes(toChainName)
      })
    }
    return rawPairs.value
  })
  const toChainList = computed(() => {
    if (filterRawPairs.value == null) return []
    return filterRawPairs.value.map(pair => {
      return tokenList.value!.find(token => token.tokenId === pair.toTokenId)
    }).filter(chain => chain != null)
  })
  const config = computed(() => {
    if (filterRawPairs.value == null) return null
    const toChain = toChainList.value.find(chain => chain.chainName === to.value)
    const fromChain = fromChainList.value.find(chain => chain.chainName === from.value)
    const pair = filterRawPairs.value.find(pair => pair.toTokenId === toChain?.tokenId)
    if (fromChain == null || pair == null) return null
    const { fromTokenId, toTokenId, ...config } = pair
    return {
      ...fromChain,
      ...config
    } satisfies PairConfig
  })

  useConfigWallet(from)

  watch([from, fromChainList], ([val]) => {
    if (fromChainList.value.length === 0) return
    const isValid = fromChainList.value.some(chain => chain.chainName === val)
    if (!isValid) {
      from.value = fromChainList.value[0]?.chainName
    }
  })

  watch([to, toChainList], ([val]) => {
    if (toChainList.value.length === 0) return
    const isValid = toChainList.value.some(chain => chain.chainName === val)
    if (!isValid) {
      to.value = toChainList.value[0]?.chainName
    }
  })

  return {
    initializing,
    token,
    from,
    to,
    tokenList: displayTokenList,
    fromChainList,
    toChainList,
    config,
    isLoadingTo
  }
}
