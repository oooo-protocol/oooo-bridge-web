import { CHAIN } from '@/entities/chain'
import useWalletStore from '@/store/wallet'
import { WALLET_TYPE } from 'oooo-components/oooo-wallet'

export const useConfigWallet = (
  from: Ref<string>
) => {
  const { updateWalletType } = useWalletStore()

  watch(from, (from) => {
    if (from === CHAIN.BTC) {
      updateWalletType(WALLET_TYPE.BITCOIN)
    } else if (from === CHAIN.FRACTAL) {
      updateWalletType(WALLET_TYPE.FRACTAL)
    } else {
      updateWalletType(WALLET_TYPE.ETHEREUM)
    }
  }, {
    immediate: true
  })
}
