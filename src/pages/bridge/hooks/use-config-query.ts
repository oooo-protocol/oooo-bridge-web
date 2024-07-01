import { getArrayFirst } from '@preflower/utils'
import { type ServerTokenPair } from '@/entities/server'

export const useConfigQuery = (
  token: Ref<string>,
  from: Ref<string>,
  to: Ref<string>,
  txPairs: ComputedRef<ServerTokenPair[]>
) => {
  const isQueryInited = ref(false)
  const route = useRoute()
  const router = useRouter()

  const stop = watch(txPairs, (pairs) => {
    if (isQueryInited.value || pairs.length === 0) return

    try {
      const queryFromChain = getArrayFirst(route.query.from)
      const queryToChain = getArrayFirst(route.query.to)
      const queryToken = getArrayFirst(route.query.token)

      const supportTokenPairs = pairs.filter(pair => pair.fromAssetCode === queryToken)

      if (supportTokenPairs.length > 0) {
        const supportFromPairs = supportTokenPairs.filter(pair => pair.fromChainName === queryFromChain)

        /**
         * token and fromChain match query scenario
         */
        if (supportFromPairs.length > 0) {
          const supportPair = supportFromPairs.find(pair => pair.toChainName === queryToChain) ?? supportFromPairs[0]

          token.value = supportPair.fromAssetCode
          from.value = supportPair.fromChainName
          to.value = supportPair.toChainName
        } else {
          /**
           * token match, but fromChain mismatch query scenario
           */
          const supportToChainPair = supportTokenPairs.find(pair => pair.toChainName === queryToChain) ?? supportTokenPairs[0]

          token.value = supportToChainPair.fromAssetCode
          from.value = supportToChainPair.fromChainName
          to.value = supportToChainPair.toChainName
        }
      } else {
        const supportFromPairs = pairs.filter(pair => pair.fromChainName === queryFromChain)

        /**
         * token mismatch, but fromChain match query scenario
         */
        if (supportFromPairs.length > 0) {
          from.value = queryFromChain!

          const supportPair = supportFromPairs.find(pair => pair.toChainName === queryToChain) ?? supportFromPairs[0]

          token.value = supportPair.fromAssetCode
          to.value = supportPair.toChainName
        } else {
          /**
           * token and fromChain mismatch query scenario
           */
          const supportToChainPair = pairs.find(pair => pair.toChainName === queryToChain) ?? pairs[0]

          token.value = supportToChainPair.fromAssetCode
          from.value = supportToChainPair.fromChainName
          to.value = supportToChainPair.toChainName
        }
      }
    } finally {
      isQueryInited.value = true
    }
  }, {
    immediate: true
  })

  watch(isQueryInited, (inited) => {
    if (inited) {
      stop()
    }
  })

  watch([token, from, to], ([token, from, to]) => {
    if (!isQueryInited.value) return

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

  return {
    isQueryInited
  }
}
