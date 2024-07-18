import { retrieveEstimateData } from '@/request/api/bridge'
import { useMutation } from '@tanstack/vue-query'
import { useDebounceFn } from '@vueuse/core'
import { type MaybeRefOrGetter } from 'vue'
import { useToast } from 'oooo-components/ui/toast'
import { type EstimateData } from '@/entities/bridge'

export const useEstimateData = (
  amount: MaybeRefOrGetter<string>,
  pairId: ComputedRef<number | undefined>,
  voucherRecordId: MaybeRefOrGetter<number | undefined>
) => {
  const { toast } = useToast()

  const estimateData = ref<EstimateData>()

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
      estimateData.value = result
    }
  })

  const debouncedFn = useDebounceFn(mutateAsync, 500, { maxWait: 5000 })

  watchEffect(() => {
    const fromAmount = toValue(amount)
    const fromAmountNumber = Number(fromAmount)
    if (pairId.value == null || fromAmountNumber === 0 || Number.isNaN(fromAmountNumber)) {
      estimateData.value = undefined
    } else {
      void debouncedFn({
        pairId: pairId.value,
        fromAmount,
        voucherRecordId: toValue(voucherRecordId)
      })
    }
  })

  return {
    estimating,
    estimateData
  }
}
