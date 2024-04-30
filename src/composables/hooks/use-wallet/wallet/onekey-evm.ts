import { NoAlarmException } from '@/lib/exception'
import { EthereumWallet } from './ethereum'

class OnekeyEthereumWallet extends EthereumWallet {
  get provider () {
    if (window.$onekey?.ethereum == null) {
      throw new NoAlarmException('Please install OneKey Browser Extension at https://onekey.so/download!')
    }
    return window.$onekey.ethereum
  }
}

export default new OnekeyEthereumWallet()
