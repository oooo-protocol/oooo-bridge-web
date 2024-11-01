import useSignatureStore from '@/store/signature'
import { useWallet } from './use-wallet'

export const useSignatureCheck = ({
  immediate = true
}) => {
  const { address, onLogout } = useWallet()
  const signature = useSignatureStore()

  watch(address, async (address) => {
    if (address == null) return
    try {
      if (signature.signInfo == null || address !== signature.signInfo.walletAddress) {
        await signature.onSign()
      }
    } catch {
      void onLogout()
    }
  }, {
    immediate
  })

  return {
    signature
  }
}
