import { type ChainConfig } from '@/entities/bridge'
import { type CHAIN } from '@/entities/chain'
import { getArrayFirst } from '@preflower/utils'

export const useChainQuery = (configs: Ref<ChainConfig[]>, select: {
  from: CHAIN
  to: CHAIN
}) => {
  const isQueryInited = ref(false)
  const route = useRoute()
  const router = useRouter()

  watch(configs, (list) => {
    if (isQueryInited.value || list.length === 0) return
    try {
      const queryFromChain = getArrayFirst(route.query.from) as CHAIN
      const queryToChain = getArrayFirst(route.query.to) as CHAIN

      const fromChain = list.find((fromChain => fromChain.chainName === queryFromChain))
      if (fromChain != null) {
        select.from = fromChain.chainName
        const toChain = fromChain.toChains.find((toChain) => toChain.chainName === queryToChain)
        select.to = toChain ? toChain.chainName : fromChain.toChains[0].chainName
      } else if (queryToChain != null) {
        for (const fromChain of list) {
          const isIncludeToChain = fromChain.toChains.findIndex(chain => chain.chainName === queryToChain) > -1
          if (isIncludeToChain) {
            select.from = fromChain.chainName
            select.to = queryToChain
            return
          }
        }
      }
    } finally {
      isQueryInited.value = true
    }
  }, {
    immediate: true
  })

  watch(select, ({ from, to }) => {
    if (!isQueryInited.value) return
    void router.push({
      name: 'bridge',
      query: {
        from,
        to
      },
      replace: true
    })
  })
}
