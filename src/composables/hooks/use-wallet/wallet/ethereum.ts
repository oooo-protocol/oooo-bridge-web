import { WALLET_TYPE, type TransactionParameter, type WalletOptions, type EthereumWalletImpl } from '@/entities/wallet'
import { CHAIN_CONFIG_MAP, ENV_VARIABLE } from '../../../../lib/constants'
import { ethers, formatEther } from 'ethers'
import { string2Hex } from '@/lib/utils'
import { NoAlarmException } from '@/lib/exception'
import { type CHAIN, type NetworkConfig } from '@/entities/chain'

export class EthereumWallet implements EthereumWalletImpl {
  readonly type = WALLET_TYPE.ETHEREUM

  getProvider: any

  constructor ({ getProvider, disconnect }: WalletOptions) {
    this.getProvider =
      getProvider ??
      (() => {
        if (window.ethereum == null) throw new NoAlarmException('Please install Wallet plugin')
        return window.ethereum
      })
    if (disconnect) {
      this.disconnect = disconnect
    }
  }

  async getAccounts () {
    const provider = await this.getProvider()
    return provider.request({ method: 'eth_accounts' }) as string[]
  }

  async connect () {
    const provider = await this.getProvider()
    const accounts = await provider.request({ method: 'eth_requestAccounts' })
    return accounts[0] as string
  }

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
      const provider = await this.getProvider()
      await provider.request({
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
      } else {
        throw e
      }
    }
  }

  async addToChain (config: NetworkConfig) {
    const provider = await this.getProvider()
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [config]
    })
  }

  async sign (message: string, from: string) {
    const provider = await this.getProvider()
    const parameter = {
      method: 'personal_sign',
      params: [
        '0x' + string2Hex(message),
        from
      ]
    }
    if (ENV_VARIABLE.VITE_MODE === 'dev') {
      console.log('personal_sign', parameter)
    }
    const signature = await provider.request(parameter)
    return signature
  }

  async transaction (parameter: TransactionParameter) {
    const provider = await this.getProvider()
    const config = CHAIN_CONFIG_MAP[parameter.chain]
    if (config == null) {
      throw new Error('The network is not configured')
    }

    await this.switchToChain(parameter.chain)

    const param = {
      method: 'eth_sendTransaction',
      params: [{
        gasPrice: `0x${Number(parameter.gas).toString(16)}`,
        gas: '0x5208',
        to: parameter.to,
        from: parameter.from,
        value: '0x' + ethers.parseUnits(parameter.value, config.nativeCurrency.decimals).toString(16),
        data: '0x',
        chainId: config.chainId
      }]
    }
    if (ENV_VARIABLE.VITE_MODE === 'dev') {
      console.log('eth_sendTransaction', param)
    }
    return provider.request(param)
  }

  async removeAllListeners () {
    const provider = await this.getProvider()
    void provider.removeAllListeners()
  }
}
