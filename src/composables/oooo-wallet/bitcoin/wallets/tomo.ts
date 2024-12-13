import { NoAlarmException } from '@/lib/exception'
import { BitcoinWallet } from './bitcoin'

export class TomoBitcoinWallet extends BitcoinWallet {
  async getProvider () {
    if (window.tomo_btc == null) {
      throw new NoAlarmException('Please install Tomo Wallet')
    }
    return window.tomo_btc
  }
}
