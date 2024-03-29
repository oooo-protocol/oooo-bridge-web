import { NoAlarmException } from '@/lib/exception'
import { BitcoinWallet } from './bitcoin'

export default new BitcoinWallet({
  getProvider () {
    if (window.unisat == null) throw new NoAlarmException('Please install Unisat Wallet')
    return window.unisat
  }
})
