import { type ChainConfig } from 'oooo-components/oooo-wallet'

export enum SERVER_ASSET {
  COIN = 'coin',
  TOKEN = 'erc20',
  APTOS_TOKEN = 'aptos_coin'
}

export enum SERVER_TOKEN_TYPE {
  BITCOIN = 1,
  FRACTAL,
  ETH_COIN,
  ETH_TOKEN,
  APTOS_COIN,
  APTOS_TOKEN,
  CEX
}

export interface CommonServerToken {
  tokenId: number
  tokenName: string
  icon: string
  chainName: string
  assetCode: string
  assetType: SERVER_ASSET
  frontDecimal: number
  tokenDecimal: number
  /**
   * Platform wallet address
   */
  platformAddress: string
  /**
   * @deprecated address validate regexp
   */
  reg: string
}

export interface AptosServerToken extends CommonServerToken {
  tokenType: SERVER_TOKEN_TYPE.APTOS_COIN | SERVER_TOKEN_TYPE.APTOS_TOKEN
  aptosFunction: string
  aptosTypeArgument: string
}

export interface BitcoinServerToken extends CommonServerToken {
  tokenType: SERVER_TOKEN_TYPE.BITCOIN
}

export interface FractalServerToken extends CommonServerToken {
  tokenType: SERVER_TOKEN_TYPE.FRACTAL
}

export interface EthereumServerToken extends CommonServerToken {
  tokenType: SERVER_TOKEN_TYPE.ETH_COIN | SERVER_TOKEN_TYPE.ETH_TOKEN
  contractAddress: string
}

export interface CexServerToken extends CommonServerToken {
  tokenType: SERVER_TOKEN_TYPE.CEX
}

export type ServerToken = AptosServerToken | BitcoinServerToken | FractalServerToken | EthereumServerToken | CexServerToken

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
