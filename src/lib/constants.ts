import { defineMap } from '@preflower/utils'
import { TRANSACTION_STATUS } from '@/entities/bridge'

import BEVM_IMAGE from '@/assets/tokens/bevm.png'
import B2_IMAGE from '@/assets/tokens/b2.png'
import BTC_IMAGE from '@/assets/tokens/btc.png'
import MERLIN_IMAGE from '@/assets/tokens/merlin.png'
import ROOTSTOCK_IMAGE from '@/assets/tokens/rootstock.png'
import BITLAYER_IMAGE from '@/assets/tokens/bitlayer.png'
import BEVM_CANARY_IMAGE from '@/assets/tokens/bevm_canary.png'
import BINANCE_CEX_IMAGE from '@/assets/tokens/binance.png'
import BOB_IMAGE from '@/assets/tokens/bob.png'
import ARBITRUM_IMAGE from '@/assets/tokens/arbitrum.png'
import BSC_IMAGE from '@/assets/tokens/bsc.png'

import { CHAIN, NETWORK } from '@/entities/chain'
import { BEVM_TESTNET, BEVM_LIVENET, BEVM_CANARY_TESTNET, BEVM_CANARY_LIVENET, B2_TESTNET, B2_LIVENET, BTC_TESTNET, BTC_LIVENET, MERLIN_TESTNET, MERLIN_LIVENET, ROOTSTOCK_TESTNET, ROOTSTOCK_LIVENET, BITLAYER_TESTNET, BITLAYER_LIVENET, BOB_TESTNET, BOB_LIVENET, ARBITRUM_TESTNET, ARBITRUM_LIVENET, BSC_TESTNET, BSC_LIVENET } from './chain-config'
import { type ChainConfig } from 'oooo-components/oooo-wallet'

export const CHAIN_LIST = [
  {
    image: BEVM_IMAGE,
    value: CHAIN.BEVM,
    [NETWORK.TESTNET]: BEVM_TESTNET,
    [NETWORK.LIVENET]: BEVM_LIVENET
  }, {
    image: BEVM_CANARY_IMAGE,
    value: CHAIN.BEVM_CANARY,
    [NETWORK.TESTNET]: BEVM_CANARY_TESTNET,
    [NETWORK.LIVENET]: BEVM_CANARY_LIVENET
  }, {
    image: B2_IMAGE,
    value: CHAIN.B2,
    [NETWORK.TESTNET]: B2_TESTNET,
    [NETWORK.LIVENET]: B2_LIVENET
  }, {
    image: BTC_IMAGE,
    value: CHAIN.BTC,
    [NETWORK.TESTNET]: BTC_TESTNET,
    [NETWORK.LIVENET]: BTC_LIVENET
  }, {
    image: MERLIN_IMAGE,
    value: CHAIN.MERLIN,
    [NETWORK.TESTNET]: MERLIN_TESTNET,
    [NETWORK.LIVENET]: MERLIN_LIVENET
  }, {
    image: ROOTSTOCK_IMAGE,
    value: CHAIN.ROOTSTOCK,
    [NETWORK.TESTNET]: ROOTSTOCK_TESTNET,
    [NETWORK.LIVENET]: ROOTSTOCK_LIVENET
  }, {
    image: BITLAYER_IMAGE,
    value: CHAIN.BITLAYER,
    [NETWORK.TESTNET]: BITLAYER_TESTNET,
    [NETWORK.LIVENET]: BITLAYER_LIVENET
  }, {
    image: BINANCE_CEX_IMAGE,
    value: CHAIN.BINANCE_CEX
  }, {
    image: BOB_IMAGE,
    value: CHAIN.BOB,
    [NETWORK.TESTNET]: BOB_TESTNET,
    [NETWORK.LIVENET]: BOB_LIVENET
  }, {
    image: ARBITRUM_IMAGE,
    value: CHAIN.ARIBTRUM,
    [NETWORK.TESTNET]: ARBITRUM_TESTNET,
    [NETWORK.LIVENET]: ARBITRUM_LIVENET
  }, {
    image: BSC_IMAGE,
    value: CHAIN.BSC,
    [NETWORK.TESTNET]: BSC_TESTNET,
    [NETWORK.LIVENET]: BSC_LIVENET
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
  [TRANSACTION_STATUS.SUCCEED]: {
    icon: 'great'
  }
}

export const EVM_ADDRESS_REGEXP = /^(0x)[0-9A-Fa-f]{40}$/
