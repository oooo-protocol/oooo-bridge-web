import { type CHAIN } from '@/lib/constants'

export interface Chain {
  chainId: string
  chainName: CHAIN
  assetCode: string
  assetType: string
}

export interface ChainConfig extends Chain {
  /**
   * 平台钱包地址, 暂未使用
   */
  platformWalletAddr: string
  /**
   * 平台费用
   */
  platformFee: string
  /**
   * 链支持最小金额
   */
  minAmount: number
  /**
   * 链支持最大金额
   */
  maxAmount: number
  toChains: Array<ChainConfig & {
    /**
     * 判断是否需要填写收款地址
     */
    wAddress: boolean
    /**
     * @deprecated 地址校验正则
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
