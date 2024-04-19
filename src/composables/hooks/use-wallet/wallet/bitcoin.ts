import { WALLET_TYPE, type onAccountChangedEvent, type TransactionParameter, type WalletImpl } from '@/entities/wallet'
import { ENV_VARIABLE } from '@/lib/constants'
import { Decimal } from 'decimal.js-light'

export class BitcoinWallet implements WalletImpl {
  readonly type = WALLET_TYPE.BITCOIN

  get provider (): any {
    throw new Error('Provider not config, please check it')
  }

  async getAccounts () {
    return this.provider.getAccounts() as string[]
  }

  async getNativeBalance () {
    const balance = await this.provider.getBalance()
    return balance.confirmed * Math.pow(10, -8)
  }

  async connect () {
    await this.checkNetwork()
    const accounts = await this.provider.requestAccounts()
    return accounts[0] as string
  }

  async disconnect () {
    void this.provider.removeAllListeners()
  }

  async sign (message: string) {
    await this.checkNetwork()
    const signature = await this.provider.signMessage(message)
    return signature
  }

  async getPublicKey () {
    return this.provider.getPublicKey()
  }

  async checkNetwork () {
    const network = await this.provider.getNetwork()
    if (network !== ENV_VARIABLE.VITE_NETWORK) {
      await this.provider.switchNetwork(ENV_VARIABLE.VITE_NETWORK)
    }
  }

  async transaction (parameter: TransactionParameter) {
    await this.checkNetwork()
    return this.provider.sendBitcoin(
      parameter.to,
      Number(new Decimal(parameter.value).mul(new Decimal(10).pow(8))),
      {
        feeRate: parameter.gas
      }
    )
  }

  async onAccountChanged (event: onAccountChangedEvent) {
    this.provider.on('accountChanged', (account?: {
      address: string
      publicKey: string
      compressedPublicKey: string
    }) => {
      event(account?.address)
    })
  }
}
