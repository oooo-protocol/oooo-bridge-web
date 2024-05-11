import { useWallet } from '@/composables/hooks/use-wallet'
import { CHAIN } from '@/entities/chain'
import { WALLET_TYPE } from '@/entities/wallet'
import { useQuery } from '@tanstack/vue-query'
import { useToast } from 'oooo-components/ui/toast'

export const useChainBalance = (select: {
  from: CHAIN
  to: CHAIN
}) => {
  const { wallet, getWalletType, retrieveNativeBalance } = useWallet()
  const { toast } = useToast()

  const queryKey = computed(() => [select.from, wallet.value])

  const enabled = computed(() => {
    if (select.from === CHAIN.BINANCE_CEX) {
      return false
    }
    if (wallet.value == null) return false
    const walletType = getWalletType()
    if (walletType === WALLET_TYPE.BITCOIN && select.from !== CHAIN.BTC) return false
    if (walletType === WALLET_TYPE.ETHEREUM && select.from === CHAIN.BTC) return false
    return true
  })
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
