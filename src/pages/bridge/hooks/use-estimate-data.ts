import { retrieveEstimateData } from '@/request/api/bridge'
import { useMutation } from '@tanstack/vue-query'
import { useDebounceFn } from '@vueuse/core'
import { type MaybeRefOrGetter } from 'vue'
import { type PairConfig } from './use-config'
import { useToast } from 'oooo-components/ui/toast'

export const useEstimateData = (
  amount: MaybeRefOrGetter<string>,
  config: ComputedRef<PairConfig | null>
) => {
  const { toast } = useToast()

  const toAmount = ref(0)
  const platformFee = ref<string>()

  const { isPending: estimating, data, mutateAsync } = useMutation({
    mutationFn: retrieveEstimateData,
    onError: (e) => {
      toast({
        description: e.message
      })
    }
  })

  // listen data change to avoid request race-condition
  watch(data, (result) => {
    if (result) {
      toAmount.value = Number(result.toAmount)
      platformFee.value = result.platformFee
    }
  })

  const debouncedFn = useDebounceFn(mutateAsync, 500, { maxWait: 5000 })

  watch([config, amount], async () => {
    const pairId = config.value?.pairId
    const fromAmount = toValue(amount)
    const fromAmountNumber = Number(fromAmount)
    if (pairId == null || fromAmountNumber === 0 || Number.isNaN(fromAmountNumber)) {
      toAmount.value = 0
      platformFee.value = undefined
    } else {
      void debouncedFn({
        pairId,
        fromAmount
      })
    }
  })

  return {
    estimating,
    toAmount,
    platformFee
  }
}
