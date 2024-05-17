import { type CHAIN } from '@/entities/chain'

export enum WALLET {
  METAMASK,
  OKX,
  UNISAT,
  OKX_BITCOIN,
  ONEKEY,
  ONEKEY_BITCOIN,
  BYBIT
}

export enum WALLET_TYPE {
  BITCOIN = 'bitcoin',
  ETHEREUM = 'ethereum'
}

export interface TransactionParameter {
  from: string
  to: string
  value: string
  gas: string
  chain: CHAIN
}

export type onAccountChangedEvent = (account?: string) => void

export interface WalletImpl {
  type: WALLET_TYPE
  provider: any
  getAccounts: () => Promise<string[]>
  connect: () => Promise<string>
  disconnect: () => Promise<void>
  sign: (message: string, from: string) => Promise<string>
  transaction: (parameter: TransactionParameter) => Promise<string>
  onAccountChanged: (event: onAccountChangedEvent) => void
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
