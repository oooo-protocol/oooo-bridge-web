import { useWallet } from '@/composables/hooks/use-wallet'
import { getArrayFirst } from '@preflower/utils'
import { createFunctionCall } from '@/composables/function-call'
import WalletConnectModal from '@/components/wallet-connect/WalletConnectModal.vue'
import { CHAIN } from '@/entities/chain'
import { WALLET_TYPE } from '@/entities/wallet'
import { uuid } from 'oooo-components/lib/utils'
import { createInvitationRelationship } from '@/request/api/user'

export const useInvite = () => {
  const route = useRoute()
  const inviteCode = getArrayFirst(route.query.inviteCode)

  const { wallet, getWalletType, sign } = useWallet()

  watch(wallet, async (wallet) => {
    if (wallet == null || inviteCode == null) return
    const type = getWalletType()
    if (type === WALLET_TYPE.ETHEREUM) {
      const signContent =
        'oooo Authentication \n' +
        'Welcome to oooo! \n' +
        'The signature is only used to verify your wallet address and does not involve any asset transfers. \n' +
        `Timestamp: ${+new Date()} \n` +
        'Thank you for using oooo for a secure and decentralized experience. \n' +
        'oooo Team \n' +
        `Nonce: ${uuid()}`
      const signature = await sign(signContent, wallet.address)
      void createInvitationRelationship({
        walletAddress: wallet.address,
        signature,
        signContent,
        inviteCode
      })
    }
  })

  onMounted(() => {
    if (inviteCode == null || wallet.value != null) return
    createFunctionCall(WalletConnectModal, {
      chain: CHAIN.BEVM
    })
  })
}
