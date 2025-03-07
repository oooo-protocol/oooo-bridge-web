import { getArrayFirst } from '@preflower/utils'
import { useQuery } from '@tanstack/vue-query'
import { retrieveMatchingPair } from '@/request/api/bridge'
import { type Chain } from '@/entities/bridge'

export const useConfigQuery = (
  token: Ref<string>,
  from: Ref<string>,
  to: Ref<string>,
  tokenList: MaybeRefOrGetter<Chain[] | undefined>
) => {
  const route = useRoute()
  const router = useRouter()
  const initializing = ref(true)

  const { data } = useQuery({
    queryKey: ['/v1/bridge/pairs/match'],
    queryFn: async () => {
      const queryTokenName = getArrayFirst(route.query.token)
      const queryFromChain = getArrayFirst(route.query.from)
      const queryToChain = getArrayFirst(route.query.to)

      // 如果 Query 不存在则跳过这一步
      if (queryTokenName == null && queryFromChain == null && queryToChain == null) return true

      const data = await retrieveMatchingPair({ assetCode: queryTokenName, fromChain: queryFromChain, toChain: queryToChain })
      const list = toValue(tokenList)!
      const fromToken = list.find(token => token.tokenId === data.fromTokenId)
      const toToken = list.find(token => token.tokenId === data.toTokenId)

      if (fromToken) {
        token.value = fromToken.tokenName
        from.value = fromToken.chainName
      }
      if (toToken) {
        to.value = toToken.chainName
      }
      return true
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: computed(() => toValue(tokenList) != null),
    initialData: false
  })

  watch([token, from, to], ([token, from, to]) => {
    if (initializing.value) return
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

  return { isQueryInited: data }
}
