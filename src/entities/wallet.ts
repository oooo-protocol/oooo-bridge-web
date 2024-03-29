import { type CHAIN } from '@/lib/constants'

export interface ChainConfig {
  chainId: string
  chainName: string
  rpcUrls: string[]
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  blockExplorerUrls: string[]
}

export interface TransactionParameter {
  from: string
  to: string
  value: string
  gas: string
  chain: CHAIN
}

export enum WALLET_TYPE {
  BITCOIN = 'bitcoin',
  ETHEREUM = 'ethereum'
}

export interface WalletImpl {
  type: WALLET_TYPE
  getProvider: any
  getAccounts: () => Promise<string[]>
  connect: () => Promise<string>
  disconnect: () => Promise<void>
  sign: (message: string, from: string) => Promise<string>
  transaction: (parameter: TransactionParameter) => Promise<string>
  removeAllListeners: () => void
}

export interface WalletOptions {
  getProvider: () => any
  disconnect?: () => Promise<void>
}

export interface EthereumWalletImpl extends WalletImpl {
  type: WALLET_TYPE.ETHEREUM
  getNativeBalance: (address: string, chain: CHAIN) => Promise<string>
}

export interface BitcoinWalletImpl extends WalletImpl {
  type: WALLET_TYPE.BITCOIN
  getPublicKey: () => Promise<string>
  getNativeBalance: () => Promise<string>
}
