import { defineStore } from 'pinia'
import { type WALLET_TYPE } from '@/composables/oooo-wallet'

const useWalletStore = defineStore('wallet', () => {
  const walletType = ref<WALLET_TYPE>()

  const updateWalletType = (type: WALLET_TYPE) => {
    walletType.value = type
  }

  return {
    walletType,
    updateWalletType
  }
}, {
  persist: true
})

export default useWalletStore
