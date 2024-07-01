import { useWallet } from '@/composables/hooks/use-wallet'
import { getArrayFirst } from '@preflower/utils'
import { createInvitationRelationship } from '@/request/api/user'
import { WALLET_TYPE } from 'oooo-components/oooo-wallet'
import useSignatureStore from '@/store/signature'
import useWalletStore from '@/store/wallet'

export const useInvite = () => {
  const route = useRoute()
  const inviteCode = computed(() => getArrayFirst(route.query.inviteCode))

  const signature = useSignatureStore()
  const { address, onConnect } = useWallet()
  const store = useWalletStore()

  watch(address, async (address) => {
    if (address == null) return
    if (inviteCode.value == null) return
    if (signature.signInfo == null) {
      await signature.onSign()
    }
    await createInvitationRelationship({
      ...signature.signInfo!,
      inviteCode: inviteCode.value
    })
  }, {
    immediate: true
  })

  onMounted(() => {
    if (inviteCode.value == null) return
    if (store.walletType === WALLET_TYPE.BITCOIN) return
    if (address.value == null) {
      onConnect(WALLET_TYPE.ETHEREUM)
    }
  })
}
