import { NoAlarmException } from '@/lib/exception'
import { EthereumWallet } from './ethereum'

class OKXEthereum extends EthereumWallet {
  get provider () {
    if (window.okxwallet == null) throw new NoAlarmException('Please install OKX Wallet')
    return window.okxwallet
  }
}

export default new OKXEthereum()
