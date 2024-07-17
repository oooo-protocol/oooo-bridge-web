import { useEVMWallet } from 'oooo-components/oooo-wallet'
import { createFuncall } from 'vue-funcall'
import DetectedOVoucherModal from '../components/DetectedOVoucherModal.vue'
import { useQuery } from '@tanstack/vue-query'

export const useOVoucherCheck = () => {
  const { address } = useEVMWallet()

  const openDetectedOVoucherModal = () => {
    createFuncall(DetectedOVoucherModal, {
      modelValue: true
    })
  }

  useQuery({
    
  })
}
