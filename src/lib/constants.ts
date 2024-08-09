import { defineMap } from '@preflower/utils'
import { TRANSACTION_STATUS } from '@/entities/bridge'

import { CHAIN, NETWORK } from '@/entities/chain'
import {
  BEVM_TESTNET,
  BEVM_LIVENET,
  BEVM_CANARY_TESTNET,
  BEVM_CANARY_LIVENET,
  B2_TESTNET,
  B2_LIVENET,
  BTC_TESTNET,
  BTC_LIVENET,
  MERLIN_TESTNET,
  MERLIN_LIVENET,
  ROOTSTOCK_TESTNET,
  ROOTSTOCK_LIVENET,
  BITLAYER_TESTNET,
  BITLAYER_LIVENET,
  BOB_TESTNET,
  BOB_LIVENET,
  ARBITRUM_TESTNET,
  ARBITRUM_LIVENET,
  BSC_TESTNET,
  BSC_LIVENET,
  ZKLINK_TESTNET,
  ZKLINK_LIVENET,
  ALIENX_TESTNET,
  ALIENX_LIVENET,
  ZKSYNC_TESTNET,
  ZKSYNC_LIVENET,
  SCROLL_TESTNET,
  SCROLL_LIVENET,
  BASE_TESTNET,
  BASE_LIVENET,
  LINEA_TESTNET,
  LINEA_LIVENET,
  BLAST_TESTNET,
  BLAST_LIVENET,
  OP_TESTNET,
  OP_LIVENET,
  POLYGON_TESTNET,
  POLYGON_LIVENET,
  TAIKO_TESTNET,
  TAIKO_LIVENET,
  FANTOM_TESTNET,
  FANTOM_LIVENET,
  ETHEREUM_TESTNET,
  ETHEREUM_LIVENET,
  XLAYER_TESTNET,
  XLAYER_LIVENET,
  ZETACHAIN_TESTNET,
  ZETACHAIN_LIVENET
} from 'oooo-components/lib/chain-config'
import { type ChainConfig } from 'oooo-components/oooo-wallet'

export const CHAIN_LIST = [
  {
    image: 'https://oooo.money/static/images/bevm.png',
    value: CHAIN.BEVM,
    [NETWORK.TESTNET]: BEVM_TESTNET,
    [NETWORK.LIVENET]: BEVM_LIVENET
  }, {
    image: 'https://oooo.money/static/images/bevm_canary.png',
    value: CHAIN.BEVM_CANARY,
    [NETWORK.TESTNET]: BEVM_CANARY_TESTNET,
    [NETWORK.LIVENET]: BEVM_CANARY_LIVENET
  }, {
    image: 'https://oooo.money/static/images/b2.png',
    value: CHAIN.B2,
    [NETWORK.TESTNET]: B2_TESTNET,
    [NETWORK.LIVENET]: B2_LIVENET
  }, {
    image: 'https://oooo.money/static/images/btc.png',
    value: CHAIN.BTC,
    [NETWORK.TESTNET]: BTC_TESTNET,
    [NETWORK.LIVENET]: BTC_LIVENET
  }, {
    image: 'https://oooo.money/static/images/merlin.png',
    value: CHAIN.MERLIN,
    [NETWORK.TESTNET]: MERLIN_TESTNET,
    [NETWORK.LIVENET]: MERLIN_LIVENET
  }, {
    image: 'https://oooo.money/static/images/rootstock.png',
    value: CHAIN.ROOTSTOCK,
    [NETWORK.TESTNET]: ROOTSTOCK_TESTNET,
    [NETWORK.LIVENET]: ROOTSTOCK_LIVENET
  }, {
    image: 'https://oooo.money/static/images/bitlayer.png',
    value: CHAIN.BITLAYER,
    [NETWORK.TESTNET]: BITLAYER_TESTNET,
    [NETWORK.LIVENET]: BITLAYER_LIVENET
  }, {
    image: 'https://oooo.money/static/images/binance.png',
    value: CHAIN.BINANCE_CEX
  }, {
    image: 'https://oooo.money/static/images/binance.png',
    value: CHAIN.BINANCE_PAY
  }, {
    image: 'https://oooo.money/static/images/bob.png',
    value: CHAIN.BOB,
    [NETWORK.TESTNET]: BOB_TESTNET,
    [NETWORK.LIVENET]: BOB_LIVENET
  }, {
    image: 'https://oooo.money/static/images/arbitrum.png',
    value: CHAIN.ARIBTRUM,
    [NETWORK.TESTNET]: ARBITRUM_TESTNET,
    [NETWORK.LIVENET]: ARBITRUM_LIVENET
  }, {
    image: 'https://oooo.money/static/images/bsc.png',
    value: CHAIN.BSC,
    [NETWORK.TESTNET]: BSC_TESTNET,
    [NETWORK.LIVENET]: BSC_LIVENET
  }, {
    image: 'https://oooo.money/static/images/zklink.png',
    value: CHAIN.ZKLINK,
    [NETWORK.TESTNET]: ZKLINK_TESTNET,
    [NETWORK.LIVENET]: ZKLINK_LIVENET
  }, {
    image: 'https://oooo.money/static/images/alienx.png',
    value: CHAIN.ALIENX,
    [NETWORK.TESTNET]: ALIENX_TESTNET,
    [NETWORK.LIVENET]: ALIENX_LIVENET
  }, {
    image: 'https://oooo.money/static/images/zksyncera.png',
    value: CHAIN.ZKSYNC,
    [NETWORK.TESTNET]: ZKSYNC_TESTNET,
    [NETWORK.LIVENET]: ZKSYNC_LIVENET
  }, {
    image: 'https://oooo.money/static/images/scroll.png',
    value: CHAIN.SCROLL,
    [NETWORK.TESTNET]: SCROLL_TESTNET,
    [NETWORK.LIVENET]: SCROLL_LIVENET
  }, {
    image: 'https://oooo.money/static/images/linea.png',
    value: CHAIN.LINEA,
    [NETWORK.TESTNET]: LINEA_TESTNET,
    [NETWORK.LIVENET]: LINEA_LIVENET
  }, {
    image: 'https://oooo.money/static/images/blast.png',
    value: CHAIN.BLAST,
    [NETWORK.TESTNET]: BLAST_TESTNET,
    [NETWORK.LIVENET]: BLAST_LIVENET
  }, {
    image: 'https://oooo.money/static/images/base.png',
    value: CHAIN.BASE,
    [NETWORK.TESTNET]: BASE_TESTNET,
    [NETWORK.LIVENET]: BASE_LIVENET
  }, {
    image: 'https://oooo.money/static/images/optimism.png',
    value: CHAIN.OP,
    [NETWORK.TESTNET]: OP_TESTNET,
    [NETWORK.LIVENET]: OP_LIVENET
  }, {
    image: 'https://oooo.money/static/images/polygon.png',
    value: CHAIN.POLYGON,
    [NETWORK.TESTNET]: POLYGON_TESTNET,
    [NETWORK.LIVENET]: POLYGON_LIVENET
  }, {
    image: 'https://oooo.money/static/images/taiko.png',
    value: CHAIN.TAIKO,
    [NETWORK.TESTNET]: TAIKO_TESTNET,
    [NETWORK.LIVENET]: TAIKO_LIVENET
  }, {
    image: 'https://oooo.money/static/images/fantom.png',
    value: CHAIN.FANTOM,
    [NETWORK.TESTNET]: FANTOM_TESTNET,
    [NETWORK.LIVENET]: FANTOM_LIVENET
  }, {
    image: 'https://oooo.money/static/images/ethereum.png',
    value: CHAIN.ETHEREUM,
    [NETWORK.TESTNET]: ETHEREUM_TESTNET,
    [NETWORK.LIVENET]: ETHEREUM_LIVENET
  },
  {
    image: 'https://oooo.money/static/images/xlayer.png',
    value: CHAIN.XLAYER,
    [NETWORK.TESTNET]: XLAYER_TESTNET,
    [NETWORK.LIVENET]: XLAYER_LIVENET
  }, {
    image: 'https://oooo.money/static/images/zetachain.png',
    value: CHAIN.ZETACHAIN,
    [NETWORK.TESTNET]: ZETACHAIN_TESTNET,
    [NETWORK.LIVENET]: ZETACHAIN_LIVENET
  }
]

export const CHAIN_CONFIG_MAP = defineMap(CHAIN_LIST, 'value', import.meta.env.VITE_NETWORK as NETWORK) as Record<CHAIN, ChainConfig | undefined>

export const CHAIN_IMAGE_MAP = defineMap(CHAIN_LIST, 'value', 'image')

export const CHAIN_BLOCK_EXPLORER_URL_MAP =
  Object.entries(CHAIN_CONFIG_MAP)
    .reduce<Record<string, string>>((pre, [name, config]) => {
    if (config) pre[name] = config.blockExplorerUrls[0]
    return pre
  }, {})

export const CHAIN_RPC_MAP = Object.entries(CHAIN_CONFIG_MAP)
  .reduce<Record<string, string>>((pre, [name, config]) => {
  if (config?.rpcUrls) pre[name] = config.rpcUrls[0]
  return pre
}, {})

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
  [TRANSACTION_STATUS.REFUNDED]: {
    icon: 'eor'
  },
  [TRANSACTION_STATUS.TIMEOUT]: {
    icon: 'eor'
  },
  [TRANSACTION_STATUS.CLOSED]: {
    icon: 'eor'
  },
  [TRANSACTION_STATUS.SUCCEED]: {
    icon: 'great'
  }
}

export const EVM_ADDRESS_REGEXP = /^(0x)[0-9A-Fa-f]{40}$/
