export enum NETWORK {
  LIVENET = 'livenet',
  TESTNET = 'testnet'
}

export enum CHAIN {
  BEVM = 'bevm',
  BEVM_CANARY = 'bevm_canary',
  B2 = 'bsquared',
  BTC = 'btc',
  SATOSHIVM = 'satoshivm',
  MERLIN = 'merlin',
  ROOTSTOCK = 'rootstock',
  BITLAYER = 'bitlayer',
  BINANCE_CEX = 'binance'
}

export interface NetworkConfig {
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
