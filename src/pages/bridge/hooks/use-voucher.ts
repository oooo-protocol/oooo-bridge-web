import { retrieveVoucherPacks, retrieveAvailableVouchers } from '@/request/api/voucher'
import { useQuery } from '@tanstack/vue-query'
import { useEVMWallet } from '@/composables/oooo-wallet'
// import { storage } from '@preflower/utils'
import DetectedOVoucherModal from '../components/DetectedOVoucherModal.vue'
import { createFuncall } from 'vue-funcall'
import { type MaybeRefOrGetter } from 'vue'

// const VOURCHER_HTNT_KEY = 'VOURCHER_HTNT_KEY'

export const useVoucher = (pairId: MaybeRefOrGetter<number | undefined>) => {
  const { address } = useEVMWallet()

  const enabled = computed(() => address.value != null)
  const { data: packs } = useQuery({
    queryKey: ['/voucher/pack/list', address],
    queryFn: async () => {
      return await retrieveVoucherPacks(address.value!)
    },
    enabled
  })

  watch(packs, (packs) => {
    // const hint = storage.local.get(VOURCHER_HTNT_KEY)
    if (!packs || packs.length === 0) return
    // if (hint != null && hint.timestamp > Date.now() - 1000 * 60 * 60 * 24) return

    createFuncall(DetectedOVoucherModal, {
      modelValue: true
    })
    // storage.local.set(VOURCHER_HTNT_KEY, {
    //   timestamp: Date.now()
    // })
  }, {
    immediate: true
  })

  const { data: vouchers } = useQuery({
    queryKey: ['/voucher/record/available', address, pairId],
    queryFn: async () => {
      return await retrieveAvailableVouchers({
        walletAddress: address.value!,
        pairId: toValue(pairId)!
      })
    },
    enabled: computed(() => enabled.value && toValue(pairId) != null)
  })

  return { vouchers }
}
