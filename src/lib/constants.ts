import { defineMap } from '@preflower/utils'
import BTC_IMAGE from '@/assets/tokens/btc.png'
import BRC_20_IMAGE from '@/assets/tokens/brc-20.png'
import { TRANSACTION_STATUS } from '@/entities/bridge'
import OKX_IMAGE from '@/assets/wallets/okx.png'
import METAMASK_IMAGE from '@/assets/wallets/metamask.png'
import { CHAIN_CONFIG_MAP, CHAIN_LIST, BTC_WALLETS } from './config'
import { WALLET } from '@/entities/wallet'

export * from './config'

export const ENV_VARIABLE = import.meta.env

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

export const ETH_WALLETS = [
  {
    name: 'METAMASK',
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
