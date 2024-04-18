import axios from '../axios'

interface SignatureRequest {
  walletAddress: string
  signature: string
  signContent: string
}

export const createInvitationRelationship = async (data: SignatureRequest & { inviteCode: string }) => {
  return await axios({
    url: '/point/invitation',
    method: 'POST',
    data
  })
}
