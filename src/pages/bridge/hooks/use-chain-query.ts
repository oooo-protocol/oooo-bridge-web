import { type ChainConfig } from '@/entities/bridge'
import { type CHAIN } from '@/entities/chain'
import { getArrayFirst } from '@preflower/utils'
import { watchOnce } from '@vueuse/core'

export const useChainQuery = (configs: Ref<ChainConfig[] | undefined>, select: {
  from: CHAIN
  to: CHAIN
}) => {
  const isQueryInited = ref(false)
  const route = useRoute()
  const router = useRouter()

  watchOnce(configs, (list) => {
    try {
      if (!list) return
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