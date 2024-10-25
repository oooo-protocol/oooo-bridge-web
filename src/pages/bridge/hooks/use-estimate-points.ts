import { useWallet } from '@/composables/hooks/use-wallet'
import { retrievePairEstimatePoint } from '@/request/api/bridge'
import { useQuery } from '@tanstack/vue-query'

export const useEstimatePoints = (
  pairId: ComputedRef<number | undefined>
) => {
  const { address } = useWallet()

  const enabled = computed(() => address.value != null && pairId.value != null)
  const { data } = useQuery({
    queryKey: ['/point/pair', pairId, address],
    queryFn: async () => await retrievePairEstimatePoint({
      pairId: pairId.value!,
      walletAddress: address.value!
    }),
    enabled
  })
  return {
    estimatePoints: data
  }
}
