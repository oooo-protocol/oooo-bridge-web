import { useWallet } from '@/composables/hooks/use-wallet'
import { SERVER_ASSET } from '@/entities/server'
import { useMutation } from '@tanstack/vue-query'
import { WALLET_TYPE } from 'oooo-components/oooo-wallet'
import { type PairConfig } from './use-config'
import { CHAIN_RPC_MAP } from '@/lib/constants'
import { CHAIN } from '@/entities/chain'
import { captureMessage } from '@sentry/vue'

export const useBalance = (from: Ref<string>, config: ComputedRef<PairConfig | null>) => {
  const { address, getInstance } = useWallet()

  const contractAddress = computed(() => config.value?.contractAddress)

  const { data: balance, mutate } = useMutation({
    mutationKey: ['getNativeBalance', from, address, contractAddress],
    mutationFn: async () => {
      const _address = address.value
      const _config = config.value
      if (_address == null || _config == null || [CHAIN.BINANCE_PAY, CHAIN.BINANCE_CEX].includes(from.value as CHAIN)) return
      const instance = getInstance()
      if (instance.type === WALLET_TYPE.BITCOIN) {
        return await instance.getNativeBalance()
      }
      const rpc = CHAIN_RPC_MAP[from.value]
      if (_config.assetType === SERVER_ASSET.COIN) {
        return await instance.getNativeBalance(_address, rpc)
      } else {
        return await instance.getTokenBalance(_address, rpc, _config.contractAddress)
      }
    },
    onError: () => {
      captureMessage(`Failed to get user balance; chain: ${from.value} address: ${address.value}`)
    }
  })

  watch([from, address, contractAddress], () => {
    mutate()
  }, {
    immediate: true
  })

  return balance
}
