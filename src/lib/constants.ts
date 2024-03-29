import { defineMap } from '@preflower/utils'
import BEVM_IMAGE from '@/assets/tokens/bevm.png'
import B2_IMAGE from '@/assets/tokens/b2.png'
import SATOSHIVM_IMAGE from '@/assets/tokens/satoshivm.png'
import BTC_IMAGE from '@/assets/tokens/btc.png'
import BRC_20_IMAGE from '@/assets/tokens/brc-20.png'
import MERLIN_IMAGE from '@/assets/tokens/merlin.png'
import ROOTSTOCK_IMAGE from '@/assets/tokens/rootstock.png'
import BITLAYER_IMAGE from '@/assets/tokens/bitlayer.png'
import { TRANSACTION_STATUS } from '@/entities/bridge'
import OKX_IMAGE from '@/assets/wallets/okx.png'
import METAMASK_IMAGE from '@/assets/wallets/metamask.png'
import UNISAT_IMAGE from '@/assets/wallets/unisat.png'

export enum NETWORK {
  LIVENET = 'livenet',
  TESTNET = 'testnet'
}

export enum CHAIN {
  BEVM = 'bevm',
  B2 = 'bsquared',
  BTC = 'btc',
  SATOSHIVM = 'satoshivm',
  MERLIN = 'merlin',
  ROOTSTOCK = 'rootstock',
  BITLAYER = 'bitlayer'
}

export const ENV_VARIABLE = import.meta.env

export const CHAIN_LIVENET_CONFIG = {
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

export const CHAIN_TESTNET_CONFIG = {
  [CHAIN.BEVM]: {
    chainId: '0x5de',
    chainName: 'BEVM Canary TestNet',
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

export const CHAIN_LIST = [
  {
    image: BEVM_IMAGE,
    name: 'BEVM',
    value: CHAIN.BEVM,
    blockExplorerUrl: 'https://scan-canary-testnet.bevm.io'
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

export const CHAIN_CONFIG_MAP: Record<string, any> = ENV_VARIABLE.VITE_NETWORK === NETWORK.LIVENET
  ? CHAIN_LIVENET_CONFIG
  : CHAIN_TESTNET_CONFIG

export const BRIDGE_LIVENET_TEXT = {
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

export const BRIDGE_TESTNET_TEXT = {
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

export const BRIDGE_TEXT_MAP: Record<string, {
  SAVE_AMOUNT: string
  TIME_SPEND: string
  SAVE_TIME: string
}> = ENV_VARIABLE.VITE_NETWORK === NETWORK.LIVENET
  ? BRIDGE_LIVENET_TEXT
  : BRIDGE_TESTNET_TEXT

export const CHAIN_BLOCK_EXPLORER_URL_MAP =
  Object.entries(CHAIN_CONFIG_MAP)
    .reduce<Record<string, string>>((pre, [name, config]) => {
    pre[name] = config.blockExplorerUrls[0]
    return pre
  }, {})

export const CHAIN_IMAGE_MAP = defineMap(CHAIN_LIST, 'value', 'image')

export const TOKEN_LIST = [
  {
    name: 'BTC',
    value: 'BTC',
    image: BTC_IMAGE
  }, {
    name: 'BRC20 (comming soon)',
    value: 'brc20',
    image: BRC_20_IMAGE,
    disabled: true
  }
]

export enum WALLET {
  METAMASK,
  OKX,
  UNISAT,
  OKX_BITCOIN
}

export const BTC_TESTNET_WALLETS = [
  {
    name: 'Unisat',
    value: WALLET.UNISAT,
    image: UNISAT_IMAGE
  }
]

export const BTC_LIVENET_WALLETS = [
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

export const BTC_WALLETS = ENV_VARIABLE.VITE_NETWORK === NETWORK.LIVENET
  ? BTC_LIVENET_WALLETS
  : BTC_TESTNET_WALLETS

export const ETH_WALLETS = [
  {
    name: 'MetaMask',
    value: WALLET.METAMASK,
    image: METAMASK_IMAGE
  }, {
    name: 'OKX WALLET',
    value: WALLET.OKX,
    image: OKX_IMAGE
  }
]

export const WALLET_MAP = defineMap([...BTC_WALLETS, ...ETH_WALLETS], 'value', ['name', 'image'])

export const TRANSACTION_STATUS_MAP = {
  [TRANSACTION_STATUS.PENDING]: {
    icon: 'time'
  },
  [TRANSACTION_STATUS.PROCESSING]: {
    icon: 'time'
  },
  [TRANSACTION_STATUS.FAILED]: {
    icon: 'eor'
  },
  [TRANSACTION_STATUS.SUCCEED]: {
    icon: 'great'
  }
}
