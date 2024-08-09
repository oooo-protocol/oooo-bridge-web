import { getArrayFirst } from '@preflower/utils'
import { createInvitationRelationship } from '@/request/api/user'
import useSignatureStore from '@/store/signature'

export const useInvite = () => {
  const route = useRoute()
  const inviteCode = computed(() => getArrayFirst(route.query.inviteCode))

  const signature = useSignatureStore()

  watch(() => signature.signInfo, async (signInfo) => {
    if (signInfo == null || inviteCode.value == null) return
    void createInvitationRelationship({
      ...signInfo,
      inviteCode: inviteCode.value
    })
  }, { immediate: true })
}
