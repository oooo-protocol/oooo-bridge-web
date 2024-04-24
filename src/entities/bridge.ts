import { type CHAIN } from '@/entities/chain'

export interface Chain {
  chainId: string
  chainName: CHAIN
  assetCode: string
  assetType: string
}

export interface ChainConfig extends Chain {
  /**
   * Platform walllet address, currently unused.
   */
  platformWalletAddr: string
  /**
   * Platform fee
   */
  platformFee: string
  /**
   * transfer chain support minimal amount
   */
  minAmount: number
  /**
   * transfer chain support maximal amount
   */
  maxAmount: number
  toChains: Array<ChainConfig & {
    /**
     * Platform transfer bitcoin can support max sat gas fee
     */
    toMaxSat?: number
    /**
     * @deprecated now we support user re-write receive address
     */
    wAddress: boolean
    /**
     * @deprecated address validate regexp
     */
    reg: string
  }>
}

export interface TransactionConfig {
  platformAddress: string
  chain: string
  gasPrice: string
  asetType: string
  assetCode: string
}

export interface UserToken {
  chain: CHAIN
  assetType: string
  assetCode: string
  balance: string
}

export enum TRANSACTION_STATUS {
  PENDING = 0,
  PROCESSING = 1,
  FAILED = -1,
  SUCCEED = 10
}

export interface Transaction {
  createTime: string
  fromChainName: CHAIN
  fromAssetType: string
  fromAssetCode: string
  fromWalletAddr: string
  fromTxnHash: string
  fromSwapAmount: string
  fromStatus: TRANSACTION_STATUS
  toChainName: CHAIN
  toAssetType: string
  toAssetCode: string
  toStatus: TRANSACTION_STATUS
  toWalletAddr: string
  toSwapAmount: string
  toTxnHash?: string
}

export interface TransactionListItem extends Omit<Transaction, 'toTxnHashes'> {
  toTxnHash: string
}
