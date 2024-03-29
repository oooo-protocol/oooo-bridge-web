import { NoAlarmException } from '@/lib/exception'
import { EthereumWallet } from './ethereum'

export default new EthereumWallet({
  getProvider: () => {
    if (window.okxwallet == null) throw new NoAlarmException('Please install OKX Wallet')
    return window.okxwallet
  },
  async disconnect () {
    const provider = await this.getProvider()
    try {
      await provider.disconnect()
    } catch (e) {}
  }
})
