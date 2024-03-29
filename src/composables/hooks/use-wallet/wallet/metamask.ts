import { NoAlarmException } from '@/lib/exception'
import { EthereumWallet } from './ethereum'

export default new EthereumWallet({
  getProvider: () => {
    if (window.ethereum == null) throw new NoAlarmException('Please install Metamask Wallet')
    return window.ethereum
  },
  async disconnect () {
    const provider = await this.getProvider()
    try {
      /**
       * only metamask support wallet_revokePermissions method
       */
      await provider.request({
        method: 'wallet_revokePermissions',
        params: [
          {
            eth_accounts: {}
          }
        ]
      })
    } catch (e) {}
  }
})
