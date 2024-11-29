import { CHAIN, CHAIN_TYPE } from '@/entities/chain'
import useWalletStore from '@/store/wallet'
import { WALLET_TYPE } from 'oooo-components/oooo-wallet'
import { CHAIN_TYPE_MAP } from '@/lib/constants'

export const useConfigWallet = (
  from: Ref<string>
) => {
  const { updateWalletType } = useWalletStore()

  watch(from, (from) => {
    const chianType = CHAIN_TYPE_MAP[from as CHAIN]
    if (chianType === CHAIN_TYPE.BITCOIN) {
      if (from === CHAIN.BTC) {
        updateWalletType(WALLET_TYPE.BITCOIN)
      } else if (from === CHAIN.FRACTAL) {
        updateWalletType(WALLET_TYPE.FRACTAL)
      } else {
        console.error(`Current chain type: ${chianType} is not support chain: ${from}`)
      }
    } else if (chianType === CHAIN_TYPE.APTOS) {
      updateWalletType(WALLET_TYPE.APTOS)
    } else if (chianType === CHAIN_TYPE.MOVEMENT_APTOS) {
      updateWalletType(WALLET_TYPE.MOVEMENT_APTOS)
    } else {
      updateWalletType(WALLET_TYPE.ETHEREUM)
    }
  }, {
    immediate: true
  })
}
