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
  platformAddress: string
  reg: string
}

export interface ServerTokenPairConfig {
  pairId: number
  minAmount: number
  maxAmount: number
  feeSaveTips: string
  timeSpendTips: string
  timeSaveTips: string
  toMaxPrice: string
}

export interface ServerTokenPair extends ServerTokenPairConfig {
  fromTokenId: number
  fromChainName: string
  fromAssetCode: string
  fromAssetType: SERVER_ASSET
  toTokenId: number
  toChainName: string
  toAssetCode: string
  toAssetType: SERVER_ASSET
}

export enum SERVER_CHAIN_TYPE {
  ON_CHAIN = 'blockchain',
  CEX = 'cex'
}

export interface ServerChain {
  chainName: string
  showName: string
  chainType: SERVER_CHAIN_TYPE
  nativeSymbol: string
  chainConfig: ChainConfig
  rpcUrls?: string[]
  confirmBlockNum: number
}

export interface ServerConfigs {
  chainList: ServerChain[]
  tokenList: ServerToken[]
  txPairList: ServerTokenPair[]
}
