import axios from '../axios'
import { type SignatureRequest } from './type'

export const createInvitationRelationship = async (data: SignatureRequest & { inviteCode: string }) => {
  return await axios({
    url: '/point/invitation',
    method: 'POST',
    data
  })
}
