import { CHAIN } from '@/entities/chain'
import useWalletStore from '@/store/wallet'
import { WALLET_TYPE } from 'oooo-components/oooo-wallet'
import type { PairConfig } from './use-config'
import { SERVER_CHAIN_TYPE } from '@/entities/server'

export const useConfigWallet = (
  from: Ref<string>,
  config: ComputedRef<PairConfig | null>
) => {
  const { updateWalletType } = useWalletStore()
  const type = computed(() => config.value?.fromChainType)

  watch(() => [from.value, type.value], ([from, type]) => {
    if (type === SERVER_CHAIN_TYPE.BITCOIN_L2) {
      if (from === CHAIN.BTC) {
        updateWalletType(WALLET_TYPE.BITCOIN)
      } else if (from === CHAIN.FRACTAL) {
        updateWalletType(WALLET_TYPE.FRACTAL)
      } else {
        console.error(`Current chain type: ${type} is not support chain: ${from}`)
      }
    } else if (type === SERVER_CHAIN_TYPE.APTOS) {
      updateWalletType(WALLET_TYPE.APTOS)
    } else {
      updateWalletType(WALLET_TYPE.ETHEREUM)
    }
  }, {
    immediate: true
  })
}
