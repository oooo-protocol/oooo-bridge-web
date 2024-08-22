import { defineMap, getArrayFirst } from '@preflower/utils'
import { type Chain } from '@/entities/bridge'
import { type ServerTokenPair } from '@/entities/server'

export const useConfigQuery = (
  token: Ref<string>,
  from: Ref<string>,
  to: Ref<string>,
  tokenList: ComputedRef<Chain[] | undefined>,
  pairList: ComputedRef<ServerTokenPair[]>
) => {
  const route = useRoute()
  const router = useRouter()

  const stopWatchToken = watch(tokenList, (tokenList) => {
    if (tokenList == null) return

    const queryTokenName = getArrayFirst(route.query.token)

    const hasQueryToken = queryTokenName != null ? tokenList.some(token => token.tokenName === queryTokenName) : false
    if (hasQueryToken) {
      token.value = queryTokenName!
    } else {
      token.value = tokenList[0].tokenName
    }

    void nextTick(() => {
      stopWatchToken()
    })
  }, {
    immediate: true
  })

  const stopWatchPair = watch(pairList, (pairList) => {
    if (tokenList.value == null) return
    if (pairList == null || pairList.length === 0) return

    const queryFromChain = getArrayFirst(route.query.from)
    const queryToChain = getArrayFirst(route.query.to)

    const tokenMap = defineMap(tokenList.value, 'tokenId', 'chainName')

    let suitablePair: ServerTokenPair | undefined
    for (const pair of pairList) {
      const fromChainName = tokenMap[pair.fromTokenId]
      const toChainName = tokenMap[pair.toTokenId]
      if (fromChainName === queryFromChain) {
        if (suitablePair == null) {
          suitablePair = pair
        }
        if (toChainName === queryToChain) {
          suitablePair = pair
        }
      }
    }
    if (suitablePair == null) {
      suitablePair = pairList[0]
    }

    from.value = tokenMap[suitablePair.fromTokenId]
    to.value = tokenMap[suitablePair.toTokenId]

    void nextTick(() => {
      stopWatchPair()
    })
  }, {
    immediate: true
  })

  watch([token, from, to], ([token, from, to]) => {
    void router.push({
      name: 'bridge',
      query: {
        // Keep other query unchanged
        ...route.query,
        token,
        from,
        to
      },
      replace: true
    })
  })
}
