import { NoAlarmException } from '@/lib/exception'
import { BitcoinWallet } from './bitcoin'

export class UnisatWallet extends BitcoinWallet {
  async getProvider () {
    if (window.unisat == null) throw new NoAlarmException('Please install Unisat Wallet')
    return window.unisat
  }
}
