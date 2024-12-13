import { NoAlarmException } from '@/lib/exception'
import { EthereumWallet } from './ethereum'

export class TomoEthereumWallet extends EthereumWallet {
  getProvider () {
    if (window.tomo_evm == null) throw new NoAlarmException('Please install Tomo Wallet')
    return window.tomo_evm
  }
}
