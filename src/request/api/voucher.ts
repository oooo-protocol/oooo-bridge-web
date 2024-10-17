import axios from '../axios'
import { type PaginationRequest, type Pagination, type SignatureRequest } from './type'
import { type VOUCHER_STATUS, type Voucher, type VoucherPack } from '@/entities/voucher'

export const redeemVoucherPack = async (data: SignatureRequest & { packCode: string }) => {
  return await axios<VoucherPack>({
    method: 'POST',
    url: '/voucher/pack/redeem',
    data
  })
}

export const retrieveVoucherPacks = async (walletAddress: string) => {
  return await axios<VoucherPack[]>({
    url: '/voucher/pack/list',
    params: {
      walletAddress
    }
  })
}

export const claimVoucherPack = async (data: SignatureRequest & { claimTxnHash?: string, packRecordId: number }) => {
  return await axios<boolean>({
    method: 'POST',
    url: '/voucher/pack/claim',
    data
  })
}

export interface RetrieveVouchersRequest extends SignatureRequest, PaginationRequest {
  status?: VOUCHER_STATUS
}

export const retrieveVouchers = async (data: RetrieveVouchersRequest) => {
  return await axios<Pagination<Voucher>>({
    method: 'POST',
    url: '/voucher/record/list',
    data
  })
}

export const retrieveAvailableVouchers = async (data: {
  walletAddress: string
  pairId: number
}) => {
  return await axios<Voucher[]>({
    url: '/voucher/record/available',
    params: data
  })
}

export const checkVoucherPackIsClaimed = async (data: SignatureRequest & {
  packRecordId: number
}) => {
  return await axios<boolean>({
    method: 'POST',
    url: '/voucher/pack/claim/check',
    data
  })
}

export const retrieveVoucherPack = async (data: { packCode: string }) => {
  return await axios<VoucherPack>({
    url: '/voucher/pack/info',
    params: data
  })
}
