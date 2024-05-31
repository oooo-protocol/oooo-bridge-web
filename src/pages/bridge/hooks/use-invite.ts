import { useWallet } from '@/composables/hooks/use-wallet'
import { getArrayFirst } from '@preflower/utils'
import { uuid } from 'oooo-components/lib/utils'
import { createInvitationRelationship } from '@/request/api/user'
import { WALLET_TYPE } from 'oooo-components/oooo-wallet'

export const useInvite = () => {
  const route = useRoute()
  const inviteCode = getArrayFirst(route.query.inviteCode)

  const { address, getInstance, onConnect } = useWallet()

  watch(address, async (address) => {
    if (address == null || inviteCode == null) return
    const instance = getInstance()
    if (instance.type === WALLET_TYPE.ETHEREUM) {
      const signContent =
        'oooo Authentication \n' +
        'Welcome to oooo! \n' +
        'The signature is only used to verify your wallet address and does not involve any asset transfers. \n' +
        `Timestamp: ${+new Date()} \n` +
        'Thank you for using oooo for a secure and decentralized experience. \n' +
        'oooo Team \n' +
        `Nonce: ${uuid()}`
      const signature = await instance.sign(signContent, address)
      void createInvitationRelationship({
        walletAddress: address,
        signature,
        signContent,
        inviteCode
      })
    }
  })

  onMounted(() => {
    if (inviteCode == null || address.value != null) return
    onConnect(WALLET_TYPE.ETHEREUM)
  })
}
