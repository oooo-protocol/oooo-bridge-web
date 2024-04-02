import BEVM_IMAGE from '@/assets/tokens/bevm.png'
import B2_IMAGE from '@/assets/tokens/b2.png'
import SATOSHIVM_IMAGE from '@/assets/tokens/satoshivm.png'
import BTC_IMAGE from '@/assets/tokens/btc.png'
import MERLIN_IMAGE from '@/assets/tokens/merlin.png'
import ROOTSTOCK_IMAGE from '@/assets/tokens/rootstock.png'
import BEVM_CANARY_IMAGE from '@/assets/tokens/bevm_canary.png'

import OKX_IMAGE from '@/assets/wallets/okx.png'
import UNISAT_IMAGE from '@/assets/wallets/unisat.png'

import { CHAIN } from '@/entities/chain'
import { WALLET } from '@/entities/wallet'

export const CHAIN_CONFIG_MAP: Record<string, any> = {
  [CHAIN.MERLIN]: {
    chainId: '0x1068',
    chainName: 'Merlin Mainnet',
    rpcUrls: ['https://rpc.merlinchain.io'],
    nativeCurrency: {
      name: 'BTC',
      symbol: 'BTC',
      decimals: 18
    },
    blockExplorerUrls: ['https://scan.merlinchain.io']
  },
  [CHAIN.BEVM]: {
    chainId: '0x2ced',
    chainName: 'BEVM',
    rpcUrls: ['https://rpc-mainnet-1.bevm.io/'],
    nativeCurrency: {
      name: 'BTC',
      symbol: 'BTC',
      decimals: 18
    },
    blockExplorerUrls: ['https://scan-mainnet.bevm.io/']
  },
  [CHAIN.BEVM_CANARY]: {
    chainId: '0x5dd',
    chainName: 'BEVM Canary',
    rpcUrls: ['https://rpc-canary-1.bevm.io/'],
    nativeCurrency: {
      name: 'BTC',
      symbol: 'BTC',
      decimals: 18
    },
    blockExplorerUrls: ['https://scan-canary.bevm.io/']
  },
  [CHAIN.ROOTSTOCK]: {
    chainId: '0x1e',
    chainName: 'RSK Mainnet',
    rpcUrls: ['https://public-node.rsk.co'],
    nativeCurrency: {
      name: 'RBTC',
      symbol: 'RBTC',
      decimals: 18
    },
    blockExplorerUrls: ['https://explorer.rsk.co']
  },
  [CHAIN.BTC]: {
    blockExplorerUrls: ['https://mempool.space']
  }
}

export const CHAIN_LIST = [
  {
    image: BEVM_IMAGE,
    name: 'BEVM',
    value: CHAIN.BEVM
  }, {
    image: BEVM_CANARY_IMAGE,
    name: 'BEVM Canary',
    value: CHAIN.BEVM_CANARY
  }, {
    image: B2_IMAGE,
    name: 'B²',
    value: CHAIN.B2
  }, {
    image: BTC_IMAGE,
    name: 'BITCOIN',
    value: CHAIN.BTC
  }, {
    image: MERLIN_IMAGE,
    name: 'MERLIN',
    value: CHAIN.MERLIN
  }, {
    image: ROOTSTOCK_IMAGE,
    name: 'ROOTSTOCK',
    value: CHAIN.ROOTSTOCK
  }, {
    image: SATOSHIVM_IMAGE,
    name: 'SatoshiVM (comming soon)',
    value: CHAIN.SATOSHIVM,
    disabled: true
  }
]

export const BRIDGE_TEXT_MAP: Record<string, {
  SAVE_AMOUNT: string
  TIME_SPEND: string
  SAVE_TIME: string
}> = {
  default: {
    SAVE_AMOUNT: 'SAVE $3.65~$4.45',
    TIME_SPEND: '30S～5min',
    SAVE_TIME: 'SAVE 3 HOURS'
  },
  [CHAIN.BTC]: {
    SAVE_AMOUNT: 'SAVE $1.85~$2.23',
    TIME_SPEND: '10~60min',
    SAVE_TIME: 'SAVE 2 HOURS'
  }
}

export const BTC_WALLETS = [
  {
    name: 'Unisat',
    value: WALLET.UNISAT,
    image: UNISAT_IMAGE
  },
  {
    name: 'OKX WALLET',
    value: WALLET.OKX_BITCOIN,
    image: OKX_IMAGE
  }
]
