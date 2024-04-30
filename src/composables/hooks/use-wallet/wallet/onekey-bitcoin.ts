import { NoAlarmException } from '@/lib/exception'
import { BitcoinWallet } from './bitcoin'

class BybitBitcoinWallet extends BitcoinWallet {
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
}

export default new BybitBitcoinWallet()
