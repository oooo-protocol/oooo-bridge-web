import { defineMap } from '@preflower/utils'
import { TRANSACTION_STATUS } from '@/entities/bridge'

import { CHAIN, CHAIN_TYPE, NETWORK } from '@/entities/chain'
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
  ZETACHAIN_LIVENET,
  MODE_TESTNET,
  MODE_LIVENET,
  CORE_TESTNET,
  CORE_LIVENET,
  MANTA_TESTNET,
  MANTA_LIVENET,
  ZORA_TESTNET,
  ZORA_LIVENET,
  OPBNB_TESTNET,
  OPBNB_LIVENET,
  SONEIUM_TESTNET,
  STORY_TESTNET,
  FRACTAL_TESTNET,
  BERA_TESTNET,
  PLUME_TESTNET,
  FRACTAL_LIVENET,
  GRAVITY_LIVENET,
  GRAVITY_TESTNET,
  CITREA_TESTNET,
  DUCKCHAIN_TESTNET,
  BITFINITY_TESTNET,
  BITFINITY_LIVENET,
  UNICHAIN_TESTNET,
  ZIRCUIT_TESTNET,
  APECHAIN_TESTNET,
  APECHAIN_LIVENET,
  TELOS_TESTNET,
  TELOS_LIVENET,
  ABSTRACT_TESTNET,
  MOVEMENT_APTOS_TESTNET,
  DUCKCHAIN_LIVENET,
  ZIRCUIT_LIVENET,
  APTOS_TESTNET,
  APTOS_LIVENET,
  MORPH_TESTNET,
  MORPH_LIVENET,
  MEZO_TESTNET,
  SWAN_TESTNET,
  SWAN_LIVENET,
  SUI_TESTNET,
  SUI_LIVENET
} from '@/lib/chain-config'
import { type ChainConfig } from '@/composables/oooo-wallet'

export const CHAIN_LIST = [
  {
    image: 'https://oooo.money/static/images/bevm.png',
    value: CHAIN.BEVM,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: BEVM_TESTNET,
    [NETWORK.LIVENET]: BEVM_LIVENET
  }, {
    image: 'https://oooo.money/static/images/bevm_canary.png',
    value: CHAIN.BEVM_CANARY,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: BEVM_CANARY_TESTNET,
    [NETWORK.LIVENET]: BEVM_CANARY_LIVENET
  }, {
    image: 'https://oooo.money/static/images/b2.png',
    value: CHAIN.B2,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: B2_TESTNET,
    [NETWORK.LIVENET]: B2_LIVENET
  }, {
    image: 'https://oooo.money/static/images/btc.png',
    value: CHAIN.BTC,
    type: CHAIN_TYPE.BITCOIN,
    [NETWORK.TESTNET]: BTC_TESTNET,
    [NETWORK.LIVENET]: BTC_LIVENET
  }, {
    image: 'https://oooo.money/static/images/merlin.png',
    value: CHAIN.MERLIN,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: MERLIN_TESTNET,
    [NETWORK.LIVENET]: MERLIN_LIVENET
  }, {
    image: 'https://oooo.money/static/images/rootstock.png',
    value: CHAIN.ROOTSTOCK,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: ROOTSTOCK_TESTNET,
    [NETWORK.LIVENET]: ROOTSTOCK_LIVENET
  }, {
    image: 'https://oooo.money/static/images/bitlayer.png',
    value: CHAIN.BITLAYER,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: BITLAYER_TESTNET,
    [NETWORK.LIVENET]: BITLAYER_LIVENET
  }, {
    image: 'https://oooo.money/static/images/binance.png',
    value: CHAIN.BINANCE_CEX,
    type: CHAIN_TYPE.CEX
  }, {
    image: 'https://oooo.money/static/images/binance.png',
    value: CHAIN.BINANCE_PAY,
    type: CHAIN_TYPE.CEX
  }, {
    image: 'https://oooo.money/static/images/bob.png',
    value: CHAIN.BOB,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: BOB_TESTNET,
    [NETWORK.LIVENET]: BOB_LIVENET
  }, {
    image: 'https://oooo.money/static/images/arbitrum.png',
    value: CHAIN.ARIBTRUM,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: ARBITRUM_TESTNET,
    [NETWORK.LIVENET]: ARBITRUM_LIVENET
  }, {
    image: 'https://oooo.money/static/images/bsc.png',
    value: CHAIN.BSC,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: BSC_TESTNET,
    [NETWORK.LIVENET]: BSC_LIVENET
  }, {
    image: 'https://oooo.money/static/images/zklink.png',
    value: CHAIN.ZKLINK,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: ZKLINK_TESTNET,
    [NETWORK.LIVENET]: ZKLINK_LIVENET
  }, {
    image: 'https://oooo.money/static/images/alienx.png',
    value: CHAIN.ALIENX,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: ALIENX_TESTNET,
    [NETWORK.LIVENET]: ALIENX_LIVENET
  }, {
    image: 'https://oooo.money/static/images/zksyncera.png',
    value: CHAIN.ZKSYNC,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: ZKSYNC_TESTNET,
    [NETWORK.LIVENET]: ZKSYNC_LIVENET
  }, {
    image: 'https://oooo.money/static/images/scroll.png',
    value: CHAIN.SCROLL,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: SCROLL_TESTNET,
    [NETWORK.LIVENET]: SCROLL_LIVENET
  }, {
    image: 'https://oooo.money/static/images/linea.png',
    value: CHAIN.LINEA,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: LINEA_TESTNET,
    [NETWORK.LIVENET]: LINEA_LIVENET
  }, {
    image: 'https://oooo.money/static/images/blast.png',
    value: CHAIN.BLAST,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: BLAST_TESTNET,
    [NETWORK.LIVENET]: BLAST_LIVENET
  }, {
    image: 'https://oooo.money/static/images/base.png',
    value: CHAIN.BASE,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: BASE_TESTNET,
    [NETWORK.LIVENET]: BASE_LIVENET
  }, {
    image: 'https://oooo.money/static/images/optimism.png',
    value: CHAIN.OP,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: OP_TESTNET,
    [NETWORK.LIVENET]: OP_LIVENET
  }, {
    image: 'https://oooo.money/static/images/polygon.png',
    value: CHAIN.POLYGON,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: POLYGON_TESTNET,
    [NETWORK.LIVENET]: POLYGON_LIVENET
  }, {
    image: 'https://oooo.money/static/images/taiko.png',
    value: CHAIN.TAIKO,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: TAIKO_TESTNET,
    [NETWORK.LIVENET]: TAIKO_LIVENET
  }, {
    image: 'https://oooo.money/static/images/fantom.png',
    value: CHAIN.FANTOM,
    type: CHAIN_TYPE.ETHEREUM,
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
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: XLAYER_TESTNET,
    [NETWORK.LIVENET]: XLAYER_LIVENET
  }, {
    image: 'https://oooo.money/static/images/zetachain.png',
    value: CHAIN.ZETACHAIN,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: ZETACHAIN_TESTNET,
    [NETWORK.LIVENET]: ZETACHAIN_LIVENET
  }, {
    image: 'https://oooo.money/static/images/mode.png',
    value: CHAIN.MODE,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: MODE_TESTNET,
    [NETWORK.LIVENET]: MODE_LIVENET
  }, {
    image: 'https://oooo.money/static/images/core.png',
    value: CHAIN.CORE,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: CORE_TESTNET,
    [NETWORK.LIVENET]: CORE_LIVENET
  }, {
    image: 'https://oooo.money/static/images/manta.png',
    value: CHAIN.MANTA,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: MANTA_TESTNET,
    [NETWORK.LIVENET]: MANTA_LIVENET
  }, {
    image: 'https://oooo.money/static/images/zora.png',
    value: CHAIN.ZORA,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: ZORA_TESTNET,
    [NETWORK.LIVENET]: ZORA_LIVENET
  }, {
    image: 'https://oooo.money/static/images/bsc.png',
    value: CHAIN.OPBNB,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: OPBNB_TESTNET,
    [NETWORK.LIVENET]: OPBNB_LIVENET
  }, {
    image: 'https://oooo.money/static/images/soneium.png',
    value: CHAIN.SONEIUM,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: SONEIUM_TESTNET
  }, {
    image: 'https://oooo.money/static/images/story.png',
    value: CHAIN.STORY,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: STORY_TESTNET
  }, {
    image: 'https://oooo.money/static/images/fractal.png',
    testnetImage: 'https://oooo.money/static/images/fractal-testnet.png',
    value: CHAIN.FRACTAL,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: FRACTAL_TESTNET,
    [NETWORK.LIVENET]: FRACTAL_LIVENET
  }, {
    image: 'https://oooo.money/static/images/bera.png',
    value: CHAIN.BERA,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: BERA_TESTNET
  }, {
    image: 'https://oooo.money/static/images/plume.png',
    value: CHAIN.PLUME,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: PLUME_TESTNET
  }, {
    image: 'https://oooo.money/static/images/gravity.png',
    value: CHAIN.GRAVITY,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: GRAVITY_TESTNET,
    [NETWORK.LIVENET]: GRAVITY_LIVENET
  }, {
    image: 'https://oooo.money/static/images/citrea.png',
    value: CHAIN.CITREA,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: CITREA_TESTNET
  }, {
    image: 'https://oooo.money/static/images/duckchain.png',
    value: CHAIN.DUCKCHAIN,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: DUCKCHAIN_TESTNET,
    [NETWORK.LIVENET]: DUCKCHAIN_LIVENET
  }, {
    image: 'https://oooo.money/static/images/bitfinity.png',
    value: CHAIN.BITFINITY,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: BITFINITY_TESTNET,
    [NETWORK.LIVENET]: BITFINITY_LIVENET
  }, {
    image: 'https://oooo.money/static/images/unichain.png',
    testnetImage: 'https://oooo.money/static/images/unichain-testnet.png',
    value: CHAIN.UNICHAIN,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: UNICHAIN_TESTNET
  }, {
    image: 'https://oooo.money/static/images/zircuit.png',
    value: CHAIN.ZIRCUIT,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: ZIRCUIT_TESTNET,
    [NETWORK.LIVENET]: ZIRCUIT_LIVENET
  }, {
    image: 'https://oooo.money/static/images/apechain.png',
    value: CHAIN.APECHAIN,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: APECHAIN_TESTNET,
    [NETWORK.LIVENET]: APECHAIN_LIVENET
  }, {
    image: 'https://oooo.money/static/images/telos.png',
    value: CHAIN.TELOS,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: TELOS_TESTNET,
    [NETWORK.LIVENET]: TELOS_LIVENET
  }, {
    image: 'https://oooo.money/static/images/abstract.png',
    value: CHAIN.ABSTRACT,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: ABSTRACT_TESTNET
  }, {
    image: 'https://oooo.money/static/images/movement.png',
    value: CHAIN.MOVEMENT_APTOS,
    type: CHAIN_TYPE.MOVEMENT_APTOS,
    [NETWORK.TESTNET]: MOVEMENT_APTOS_TESTNET
  }, {
    image: 'https://oooo.money/static/images/aptos.png',
    value: CHAIN.APTOS,
    type: CHAIN_TYPE.APTOS,
    [NETWORK.TESTNET]: APTOS_TESTNET,
    [NETWORK.LIVENET]: APTOS_LIVENET
  }, {
    image: 'https://oooo.money/static/images/morph.png',
    value: CHAIN.MORPH,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: MORPH_TESTNET,
    [NETWORK.LIVENET]: MORPH_LIVENET
  }, {
    image: 'https://oooo.money/static/images/mezo.png',
    value: CHAIN.MEZO,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: MEZO_TESTNET
  }, {
    image: 'https://oooo.money/static/images/swan.png',
    value: CHAIN.SWAN,
    type: CHAIN_TYPE.ETHEREUM,
    [NETWORK.TESTNET]: SWAN_TESTNET,
    [NETWORK.LIVENET]: SWAN_LIVENET
  }, {
    image: 'https://oooo.money/static/images/sui.png',
    value: CHAIN.SUI,
    type: CHAIN_TYPE.SUI,
    [NETWORK.TESTNET]: SUI_TESTNET,
    [NETWORK.LIVENET]: SUI_LIVENET
  }
]

export const CHAIN_CONFIG_MAP = defineMap(CHAIN_LIST, 'value', import.meta.env.VITE_NETWORK as NETWORK) as Record<CHAIN, ChainConfig | undefined>

export const CHAIN_IMAGE_MAP = CHAIN_LIST.reduce<Record<string, string>>((map, chain) => {
  let image = chain.image
  if (import.meta.env.VITE_NETWORK === NETWORK.TESTNET && (chain.testnetImage != null)) {
    image = chain.testnetImage
  }
  map[chain.value] = image
  return map
}, {})

export const CHAIN_TYPE_MAP = defineMap(CHAIN_LIST, 'value', 'type')

export const CHAIN_BLOCK_EXPLORER_URL_MAP =
  Object.entries(CHAIN_CONFIG_MAP)
    .reduce<Record<string, string>>((pre, [name, config]) => {
    if (config) pre[name] = config.blockExplorerUrls[0]
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

export const APTOS_ADDRESS_REGEXP = /^(0x)[0-9A-Fa-f]{64}$/

export const SUI_ADDRESS_REGEXP = /^(0x)[0-9A-Fa-f]{64}$/
