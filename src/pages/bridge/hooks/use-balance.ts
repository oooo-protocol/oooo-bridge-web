import { useWallet } from '@/composables/hooks/use-wallet'
import { useMutation } from '@tanstack/vue-query'
import { type PairConfig } from './use-config'
import { captureMessage } from '@sentry/vue'

export const useBalance = (from: Ref<string>, config: ComputedRef<PairConfig | null>) => {
  const { address, getBalance } = useWallet()

  const tokenId = computed(() => config.value?.tokenId)

  const { data: balance, mutate } = useMutation({
    mutationKey: ['getBalance', tokenId, address],
    mutationFn: async () => {
      const _address = address.value
      const _config = config.value
      if (_address == null || _config == null) return
      return await getBalance(_config)
    },
    onError: () => {
      captureMessage(`Failed to get user balance; chain: ${from.value} address: ${address.value}`)
    }
  })

  watch([tokenId, address], () => {
    mutate()
  }, {
    immediate: true
  })

  return balance
}
