import { type CHAIN } from '@/entities/chain'
import type { SERVER_CHAIN_TYPE, ServerChain, ServerToken } from './server'

export interface Token {
  tokenName: string
  assetType: string
  assetCode: string
  icon: string
}

export type Chain = ServerToken & {
  showName: ServerChain['showName']
  type: ServerChain['type']
}

export interface TransactionConfig {
  platformAddress: string
  chain: string
  gasPrice: string
  assetType: string
  assetCode: string
}

export enum TRANSACTION_STATUS {
  PENDING = 0,
  PROCESSING = 1,
  FAILED = -1,
  SUCCEED = 10,
  CLOSED = 20,
  REFUNDED = 21,
  TIMEOUT = 22
}

export interface BinancePayOrder {
  prepayId: string
  expireTime: number
  qrcodeLink: string
  qrContent: string
  checkoutUrl: string
  deeplink: string
  universalUrl: string
  totalFee: string
  currency: string
}

export interface Transaction {
  createTime: string
  fromChainName: CHAIN
  fromChainType: SERVER_CHAIN_TYPE
  fromAssetType: string
  fromAssetCode: string
  fromWalletAddr: string
  fromTxnHash: string
  fromSwapAmount: string
  fromStatus: TRANSACTION_STATUS
  toChainName: CHAIN
  toChainType: SERVER_CHAIN_TYPE
  toAssetType: string
  toAssetCode: string
  toStatus: TRANSACTION_STATUS
  toWalletAddr: string
  toSwapAmount: string
  toTxnHash?: string
  platformAddr?: string
  platformName?: string
  binancePayOrder?: BinancePayOrder
  /**
   * return the point that be earned for this transaction
   */
  point?: string
}

export interface EstimateData {
  /**
   * platform fee before use voucher
   */
  platformFee: string
  /**
   * platform fee after use voucher
   */
  actualPlatformFee: string
  discount: string
  toAmount: string
  save: string
}
