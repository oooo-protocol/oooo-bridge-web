import { type ChainConfig } from 'oooo-components/oooo-wallet'

export enum SERVER_ASSET {
  COIN = 'coin',
  TOKEN = 'erc20'
}

export interface ServerToken {
  tokenId: number
  tokenName: string
  icon: string
  chainName: string
  assetCode: string
  assetType: SERVER_ASSET
  frontDecimal: number
  tokenDecimal: number
  contractAddress: string
  /**
   * Platform walllet address
   */
  platformAddress: string
  /**
   * @deprecated address validate regexp
   */
  reg: string
}

export interface ServerTokenPairConfig {
  pairId: number
  /**
   * transfer chain support minimal amount
   */
  minAmount: number
  /**
   * transfer chain support maximal amount
   */
  maxAmount: number
  feeSaveTips: string
  timeSpendTips: string
  timeSaveTips: string
  toMaxPrice: string
}

export interface ServerTokenPair extends ServerTokenPairConfig {
  fromTokenId: number
  toTokenId: number
}

export enum SERVER_CHAIN_TYPE {
  /**
   * Unexposed type
   */
  UNSET,
  /**
   * Bitcoin & Bitcoin L2
   */
  BITCOIN_L2,
  /**
   * Ethereum & Ethereum L2
   */
  ETHEREUM_L2,
  CEX,
  /**
   * Aptos & Aptos compatible network (such as: Movment)
   */
  APTOS
}

export interface ServerChain {
  chainName: string
  showName: string
  type: SERVER_CHAIN_TYPE
  nativeSymbol: string
  chainConfig: ChainConfig
  rpcUrls?: string[]
  confirmBlockNum: number
}

export interface ServerConfigs {
  chainList: ServerChain[]
  tokenList: ServerToken[]
}
