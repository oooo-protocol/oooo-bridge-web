import type { CheckIn, CheckInChain } from '@/entities/quest'
import axios from '../axios'
import { type SignatureRequest } from './type'

export const retrieveCheckInDays = async (data: { walletAddress?: string }) => {
  return await axios<{
    lists: CheckIn[]
    commonAmount: string
    bridgeAmount: string
  }>({
    url: '/gem/checkin/daily',
    params: data
  })
}

export const retireveCheckInChainList = async () => {
  return await axios<CheckInChain[]>({
    method: 'POST',
    url: '/gem/checkin/chain/list'
  })
}

export const checkIn = async (data: SignatureRequest & {
  chainName: string
  txnHash: string
}) => {
  return await axios<boolean>({
    method: 'POST',
    url: '/gem/checkin/report',
    data
  })
}
