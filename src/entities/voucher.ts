export interface VoucherPackClaimConfig {
  claimChainName: string
  contractAddress: string
}

export interface VoucherPack {
  packRecordId: number
  title: string
  description: string
  startTime: string
  endTime: string
  claimConfig: VoucherPackClaimConfig
}

export enum VOUCHER_STATUS {
  AVAILABLE,
  USED,
  EXPIRED
}

export interface VoucherPariConfig {
  pair: string
  desc: string
}

export interface Voucher {
  voucherRecordId: number
  name: string
  description: string
  icon: string
  walletAddress: string
  assetCode: string
  discountAmount: 0.00001
  startTime: string
  endTime: string
  status: VOUCHER_STATUS
  pairConfigs: VoucherPariConfig[]
}
