import { defineStore } from 'pinia'
import { useEVMWallet } from '@/composables/oooo-wallet'
import { uuid } from '@/lib/utils'

export interface SignInfo {
  walletAddress: string
  signature: string
  signContent: string
}

const useSignatureStore = defineStore('oooo-signature', () => {
  const { address, getWalletInstance } = useEVMWallet()

  const signInfo = ref<SignInfo>()

  const generateSignContent = () => {
    return `oooo Authentication
Welcome to oooo!
The signature is only used to verify your wallet address and does not involve any asset transfers.
Timestamp: ${+new Date()}
Thank you for using oooo for a secure and decentralized experience.
oooo Team
Nonce: ${uuid()}`
  }

  const onSign = async () => {
    if (address.value == null) {
      throw new Error('Please connect wallet first')
    }

    const instance = getWalletInstance()

    const _signContent = generateSignContent()
    const _signature = await instance.sign(_signContent, address.value)

    signInfo.value = {
      walletAddress: address.value,
      signature: _signature,
      signContent: _signContent
    }

    return signInfo.value
  }

  const onSignout = () => {
    signInfo.value = undefined
  }

  const getSignInfo = async () => {
    if (signInfo.value == null || address.value !== signInfo.value.walletAddress) {
      await onSign()
    }
    return signInfo.value!
  }

  return {
    getSignInfo,
    signInfo,
    onSign,
    onSignout
  }
}, {
  persist: true
})

export default useSignatureStore
