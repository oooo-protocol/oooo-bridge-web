import { NoAlarmException } from '@/lib/exception'
import { BitcoinWallet } from './bitcoin'

export default new BitcoinWallet({
  getProvider () {
    if (window.okxwallet.bitcoin == null) throw new NoAlarmException('Please install OKX Wallet')
    return window.okxwallet.bitcoin
  },
  async disconnect () {
    const provider = await this.getProvider()
    try {
      await provider.disconnect()
    } catch (e) {}
  }
})
