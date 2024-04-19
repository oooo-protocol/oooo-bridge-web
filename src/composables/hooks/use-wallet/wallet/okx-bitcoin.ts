import { NoAlarmException } from '@/lib/exception'
import { BitcoinWallet } from './bitcoin'

class OKXBitcoinWallet extends BitcoinWallet {
  get provider () {
    if (window.okxwallet.bitcoin == null) throw new NoAlarmException('Please install OKX Wallet')
    return window.okxwallet.bitcoin
  }

  async disconnect () {
    try {
      await this.provider.disconnect()
    } catch (e) {}
  }
}

export default new OKXBitcoinWallet()
