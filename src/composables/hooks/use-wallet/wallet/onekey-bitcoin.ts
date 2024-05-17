import { NoAlarmException } from '@/lib/exception'
import { BitcoinWallet } from './bitcoin'
import { type onAccountChangedEvent } from '@/entities/wallet'

class OnekeyBitcoinWallet extends BitcoinWallet {
  get provider () {
    if (window.$onekey?.btc == null) {
      throw new NoAlarmException('Please install OneKey Browser Extension at https://onekey.so/download!')
    }
    return window.$onekey.btc
  }

  async disconnect () {
    try {
      await this.provider.disconnect()
    } catch (e) {}
  }

  async onAccountChanged (event: onAccountChangedEvent) {
    this.provider.on('accountsChanged', (accounts: string[]) => {
      event(accounts[0])
    })
  }
}

export default new OnekeyBitcoinWallet()
