import { NoAlarmException } from '@/lib/exception'
import { BitcoinWallet } from './bitcoin'

class OKXBitcoinWallet extends BitcoinWallet {
  get provider () {
    if (window.okxwallet.bitcoin == null) throw new NoAlarmException('Please install OKX Wallet')
    return window.okxwallet.bitcoin
  }
}

export default new OKXBitcoinWallet()
