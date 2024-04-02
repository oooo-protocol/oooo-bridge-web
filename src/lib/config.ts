import BEVM_IMAGE from '@/assets/tokens/bevm.png'
import B2_IMAGE from '@/assets/tokens/b2.png'
import SATOSHIVM_IMAGE from '@/assets/tokens/satoshivm.png'
import BTC_IMAGE from '@/assets/tokens/btc.png'
import MERLIN_IMAGE from '@/assets/tokens/merlin.png'
import ROOTSTOCK_IMAGE from '@/assets/tokens/rootstock.png'
import BITLAYER_IMAGE from '@/assets/tokens/bitlayer.png'

import UNISAT_IMAGE from '@/assets/wallets/unisat.png'

import { CHAIN } from '@/entities/chain'
import { WALLET } from '@/entities/wallet'

export const CHAIN_CONFIG_MAP: Record<string, any> = {
  [CHAIN.BEVM]: {
    chainId: '0x2cef',
    chainName: 'BEVM Testnet',
    rpcUrls: ['https://testnet.bevm.io'],
    nativeCurrency: {
      name: 'BTC',
      symbol: 'BTC',
      decimals: 18
    },
    blockExplorerUrls: ['https://scan-testnet.bevm.io']
  },
  [CHAIN.BEVM_CANARY]: {
    chainId: '0x5de',
    chainName: 'BEVM Canary Testnet',
    rpcUrls: ['https://canary-testnet.bevm.io'],
    nativeCurrency: {
      name: 'BTC',
      symbol: 'BTC',
      decimals: 18
    },
    blockExplorerUrls: ['https://scan-canary-testnet.bevm.io']
  },
  [CHAIN.B2]: {
    chainId: '0x44e',
    chainName: 'B² Haven Testnet',
    rpcUrls: ['https://trusted-sequencer-rpc.bsquared.network'],
    nativeCurrency: {
      name: 'tBTC',
      symbol: 'tBTC',
      decimals: 18
    },
    blockExplorerUrls: ['https://haven-explorer.bsquared.network']
  },
  [CHAIN.MERLIN]: {
    chainId: '0xa7b14',
    chainName: 'Merlin Testnet',
    rpcUrls: ['https://testnet-rpc.merlinchain.io'],
    nativeCurrency: {
      name: 'BTC',
      symbol: 'BTC',
      decimals: 18
    },
    blockExplorerUrls: ['https://testnet-scan.merlinchain.io']
  },
  [CHAIN.ROOTSTOCK]: {
    chainId: '0x1f',
    chainName: 'RSK Testnet',
    rpcUrls: ['https://public-node.testnet.rsk.co'],
    nativeCurrency: {
      name: 'tRBTC',
      symbol: 'tRBTC',
      decimals: 18
    },
    blockExplorerUrls: ['https://explorer.testnet.rsk.co']
  },
  [CHAIN.BITLAYER]: {
    chainId: '0x3106a',
    chainName: 'Bitlayer Testnet',
    rpcUrls: ['https://testnet-rpc.bitlayer.org'],
    nativeCurrency: {
      name: 'BTC',
      symbol: 'BTC',
      decimals: 18
    },
    blockExplorerUrls: ['https://testnet-scan.bitlayer.org']
  },
  [CHAIN.BTC]: {
    blockExplorerUrls: ['https://mempool.space/testnet']
  }
}

export const CHAIN_LIST: Array<{
  image: string
  name: string
  value: CHAIN
  /**
   * hidden in the wallet connect
   */
  hide?: boolean
  disabled?: boolean
}> = [
  {
    image: BEVM_IMAGE,
    name: 'BEVM',
    value: CHAIN.BEVM
  }, {
    image: BEVM_IMAGE,
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
    image: BITLAYER_IMAGE,
    name: 'BITLAYER',
    value: CHAIN.BITLAYER
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
    TIME_SPEND: '30S',
    SAVE_TIME: 'SAVE 4 HOURS'
  },
  [CHAIN.BTC]: {
    SAVE_AMOUNT: 'SAVE $1.85~$2.23',
    TIME_SPEND: '5~30MIN',
    SAVE_TIME: 'SAVE 2 HOURS'
  }
}

export const BTC_WALLETS = [
  {
    name: 'Unisat',
    value: WALLET.UNISAT,
    image: UNISAT_IMAGE
  }
]
