import { NoAlarmException } from '@/lib/exception'
import { BitcoinWallet } from './bitcoin'
import { type onAccountChangedEvent } from '@/entities/wallet'

class UnisatWallet extends BitcoinWallet {
  get provider () {
    if (window.unisat == null) throw new NoAlarmException('Please install Unisat Wallet')
    return window.unisat
  }

  async onAccountChanged (event: onAccountChangedEvent) {
    this.provider.on('accountsChanged', (accounts: string[]) => {
      event(accounts[0])
    })
  }
}

export default new UnisatWallet()
