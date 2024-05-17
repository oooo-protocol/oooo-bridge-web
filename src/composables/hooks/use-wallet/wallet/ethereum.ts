import { WALLET_TYPE, type TransactionParameter, type EthereumWalletImpl, type onAccountChangedEvent } from '@/entities/wallet'
import { ethers, formatEther, toBeHex, toUtf8Bytes, hexlify } from 'ethers'
import { NoAlarmException } from '@/lib/exception'
import { type CHAIN, type NetworkConfig } from '@/entities/chain'
import { CHAIN_CONFIG_MAP, ENV_VARIABLE, EVM_ADDRESS_REGEXP } from '@/lib/constants'

export class EthereumWallet implements EthereumWalletImpl {
  readonly type = WALLET_TYPE.ETHEREUM

  get provider () {
    if (window.ethereum == null) throw new NoAlarmException('Please install Wallet plugin')
    return window.ethereum
  }

  async getAccounts () {
    return await this.provider.request({ method: 'eth_accounts' }) as string[]
  }

  async connect () {
    const accounts = await this.provider.request({ method: 'eth_requestAccounts' })
    const account = accounts[0]
    if (account == null) {
      throw new Error('Unable to access wallet account')
    }
    return account as string
  }

  async disconnect () {
    void this.provider.removeAllListeners()
    try {
      // @ts-expect-error some wallet can use `disconnect` to direct logout, such as OKX
      await this.provider.disconnect?.()
    } catch (e) {}
  }

  async getNativeBalance (address: string, chain: CHAIN) {
    const config = CHAIN_CONFIG_MAP[chain]
    const jsonRpcProvider = new ethers.JsonRpcProvider(config.rpcUrls[0])
    try {
      const balance = await jsonRpcProvider.getBalance(address)
      return formatEther(balance)
    } finally {
      jsonRpcProvider.destroy()
    }
  }

  async switchToChain (chain: CHAIN) {
    const config = CHAIN_CONFIG_MAP[chain]
    if (config == null) {
      throw new Error('The network is not configured')
    }

    try {
      await this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: config.chainId
          }
        ]
      })
    } catch (e) {
      if ((e as any).code === 4902) {
        await this.addToChain(config)
        await this.switchToChain(chain)
      } else {
        throw e
      }
    }
  }

  async addToChain (config: NetworkConfig) {
    await this.provider.request({
      method: 'wallet_addEthereumChain',
      params: [config]
    })
  }

  async sign (message: string, from: string) {
    const parameter = {
      method: 'personal_sign',
      params: [
        hexlify(toUtf8Bytes(message)),
        from
      ]
    }
    if (ENV_VARIABLE.VITE_MODE === 'dev') {
      console.log('personal_sign', parameter)
    }
    const signature = await this.provider.request(parameter)
    return signature
  }

  async transaction (parameter: TransactionParameter) {
    const config = CHAIN_CONFIG_MAP[parameter.chain]
    if (config == null) {
      throw new Error('The network is not configured')
    }

    await this.switchToChain(parameter.chain)

    const param = {
      method: 'eth_sendTransaction',
      params: [{
        gasPrice: toBeHex(Number(parameter.gas)),
        gas: '0x5208',
        to: parameter.to,
        from: parameter.from,
        value: toBeHex(ethers.parseUnits(parameter.value, config.nativeCurrency.decimals)),
        data: '0x',
        chainId: config.chainId
      }]
    }
    if (ENV_VARIABLE.VITE_MODE === 'dev') {
      console.log('eth_sendTransaction', param)
    }
    return await this.provider.request(param)
  }

  async onAccountChanged (event: onAccountChangedEvent) {
    await this.provider.on('accountsChanged', (accounts: string[]) => {
      const account = accounts[0]
      if (EVM_ADDRESS_REGEXP.test(account)) {
        event(account)
      } else {
        event(undefined)
      }
    })
  }
}
