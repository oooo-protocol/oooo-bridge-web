import type { ServerTokenPairConfig, ServerToken, ServerTokenPair, ServerChain } from '@/entities/server'
import { useConfigQuery } from './use-config-query'
import { useConfigWallet } from './use-config-wallet'
import { CHAIN } from '@/entities/chain'
import { useWallet } from '@/composables/hooks/use-wallet'
import { WALLET } from 'oooo-components/oooo-wallet'
import { retreieveBridgePairs, retrieveBridgeConfigs } from '@/request/api/bridge'
import { useQuery } from '@tanstack/vue-query'
import { defineMap } from '@preflower/utils'
import type { Token, Chain } from '@/entities/bridge'

export type PairConfig =
  ServerTokenPairConfig &
  Pick<ServerToken, 'assetType' | 'assetCode' | 'frontDecimal' | 'contractAddress' | 'platformAddress'> &
  {
    fromChainType: ServerChain['type']
    toChainType: ServerChain['type']
  }

interface ToPair extends Chain {
  config: ServerTokenPairConfig
}

export interface Pair extends Chain {
  tos: ToPair[]
}

export const useConfig = () => {
  const { name } = useWallet()
  /**
   * token = tokenName
   */
  const token = ref(import.meta.env.VITE_DEFAULT_SELECT_TOKEN)
  const from = ref(import.meta.env.VITE_DEFAULT_SELECT_FROM)
  const to = ref(import.meta.env.VITE_DEFAULT_SELECT_TO)

  const { data: configs } = useQuery({
    queryKey: ['/v1/bridge/global/configuration'],
    queryFn: retrieveBridgeConfigs
  })
  const enabled = computed(() => configs.value != null && token.value != null)
  const { data: rawPairs } = useQuery({
    queryKey: ['/v1/bridge/global/pairs', token],
    queryFn: async () => {
      const { list } = await retreieveBridgePairs({ assetCode: token.value })
      return list
    },
    enabled
  })

  const initializing = computed(() => configs.value == null || rawPairs.value == null)

  const tokenList = computed(() => {
    if (configs.value == null) return undefined

    const chainMap = defineMap(configs.value.chainList, 'chainName', ['chainConfig', 'showName', 'type'])

    return configs.value.tokenList.map<Chain>(token => {
      const chain = chainMap[token.chainName]
      return {
        ...token,
        ...chain
      }
    })
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

  /**
   * define inner pair map to reduce index cost
   * pairMap: Record<fromChainName, Pair>
   */
  const pairMap = computed(() => {
    if (tokenMap.value == null) return undefined
    if (filterRawPairs.value.length === 0) return undefined

    const _pairMap: Record<string, Pair> = {}
    const _tokenMap = tokenMap.value

    for (const rawPair of filterRawPairs.value) {
      const { fromTokenId, toTokenId, ...config } = rawPair
      const fromToken = _tokenMap[fromTokenId]
      const toToken = _tokenMap[toTokenId]

      let pair = _pairMap[fromToken.chainName]
      if (pair == null) {
        pair = _pairMap[fromToken.chainName] = {
          ...fromToken,
          tos: []
        }
      }
      pair.tos.push({
        ...toToken,
        config
      })
    }

    return _pairMap
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

  useConfigQuery(token, from, to, tokenList, filterRawPairs)

  const fromChainList = computed(() => {
    if (pairMap.value == null) return []
    return Object.values(pairMap.value).map<Chain>(item => {
      const { tos, ...chain } = item
      return chain
    })
  })
  const currentFromPair = computed(() => {
    return pairMap.value?.[from.value]
  })
  const toChainList = computed(() => {
    if (currentFromPair.value == null) return []
    return currentFromPair.value.tos.map<Chain>(item => {
      const { config, ...chain } = item
      return chain
    })
  })
  const config = computed(() => {
    if (currentFromPair.value == null) return null
    const _to = currentFromPair.value.tos.find(pair => pair.chainName === to.value)
    if (_to == null) return null
    return {
      ..._to.config,
      assetType: currentFromPair.value.assetType,
      assetCode: currentFromPair.value.assetCode,
      frontDecimal: currentFromPair.value.frontDecimal,
      contractAddress: currentFromPair.value.contractAddress,
      platformAddress: currentFromPair.value.platformAddress,
      fromChainType: currentFromPair.value.type,
      toChainType: _to.type
    } satisfies PairConfig
  })
  useConfigWallet(from, config)

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
    initializing,
    token,
    from,
    to,
    tokenList: displayTokenList,
    fromChainList,
    toChainList,
    config
  }
}
