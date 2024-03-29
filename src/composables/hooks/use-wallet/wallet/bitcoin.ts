import { WALLET_TYPE, type TransactionParameter, type WalletImpl, type WalletOptions } from '@/entities/wallet'
import { ENV_VARIABLE } from '@/lib/constants'
import { Decimal } from 'decimal.js-light'

export class BitcoinWallet implements WalletImpl {
  readonly type = WALLET_TYPE.BITCOIN

  getProvider: any

  constructor ({ getProvider, disconnect }: WalletOptions) {
    this.getProvider = getProvider
    if (disconnect) {
      this.disconnect = disconnect
    }
  }

  async getAccounts () {
    const provider = await this.getProvider()
    return provider.getAccounts() as string[]
  }

  async getNativeBalance () {
    const provider = await this.getProvider()
    const balance = await provider.getBalance()
    return balance.confirmed * Math.pow(10, -8)
  }

  async connect () {
    const provider = await this.getProvider()
    const network = await provider.getNetwork()
    if (network !== ENV_VARIABLE.VITE_NETWORK) {
      await provider.switchNetwork(ENV_VARIABLE.VITE_NETWORK)
    }
    const accounts = await provider.requestAccounts()
    return accounts[0] as string
  }

  async disconnect () {}

  async sign (message: string) {
    const provider = await this.getProvider()
    await provider.switchNetwork(ENV_VARIABLE.VITE_NETWORK)
    const signature = await provider.signMessage(message)
    return signature
  }

  async getPublicKey () {
    const provider = await this.getProvider()
    return provider.getPublicKey()
  }

  async transaction (parameter: TransactionParameter) {
    const provider = await this.getProvider()
    await provider.switchNetwork(ENV_VARIABLE.VITE_NETWORK)
    return provider.sendBitcoin(
      parameter.to,
      Number(new Decimal(parameter.value).mul(new Decimal(10).pow(8))),
      {
        feeRate: parameter.gas
      }
    )
  }

  async removeAllListeners () {
    const provider = await this.getProvider()
    void provider.removeAllListeners()
  }
}
