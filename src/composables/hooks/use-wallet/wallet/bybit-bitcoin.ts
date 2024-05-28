import { NoAlarmException } from '@/lib/exception'
import { BitcoinWallet } from './bitcoin'
import { type onAccountChangedEvent } from '@/entities/wallet'
import { Network, validate } from 'bitcoin-address-validation'

class BybitBitcoinWallet extends BitcoinWallet {
  get provider () {
    if (window.bybitWallet == null) {
      throw new NoAlarmException('Please install Bybit Wallet')
    }
    if (window.bybitWallet.bitcoin == null) {
      throw new NoAlarmException('Please upgrade Bybit Wallet to support Bitcoin chain')
    }
    return window.bybitWallet.bitcoin
  }

  async onAccountChanged (event: onAccountChangedEvent) {
    this.provider.on('accountsChanged', (accounts: string[]) => {
      const account = accounts[0]
      if (validate(account, Network.mainnet)) {
        event(account)
      } else {
        event(undefined)
      }
    })
  }
}

export default new BybitBitcoinWallet()
