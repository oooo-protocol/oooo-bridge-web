import { useWallet } from '@/composables/hooks/use-wallet'
import { CHAIN } from '@/entities/chain'
import { useQuery } from '@tanstack/vue-query'
import { useToast } from 'oooo-components/ui/toast'

export const useChainBalance = (select: {
  from: CHAIN
  to: CHAIN
}) => {
  const { wallet, retrieveNativeBalance } = useWallet()
  const { toast } = useToast()

  const queryKey = computed(() => [select.from, wallet.value])
  const enabled = computed(() => select.from !== CHAIN.BINANCE_CEX && wallet.value != null)
  const { error, data: balance } = useQuery({
    queryKey: ['retrieveNativeBalance', queryKey],
    queryFn: async () => await retrieveNativeBalance(select.from),
    retry: false,
    enabled
  })

  watch(error, (e) => {
    if (e) {
      toast({
        description: e.message
      })
    }
  })

  return balance
}
