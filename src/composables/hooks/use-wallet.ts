import { type CHAIN } from '@/entities/chain'
import { CHAIN_CONFIG_MAP } from '@/lib/constants'
import useWalletStore from '@/store/wallet'
import { ethers } from 'ethers'
import { WALLET_TYPE, useBTCWallet, useEVMWallet, WalletConnectModal, type NETWORK, type TransactionParameter, type ChainConfig } from 'oooo-components/oooo-wallet'
import { createFuncall } from 'vue-funcall'

export interface TransferParameter {
  token: string
  from: string
  fromAmount: string
  to: string
  toAddress: string
  toAmount: string
}

export const useWallet = () => {
  const { name: btcName, address: btcAddress, getWalletInstance: getBTCWalletInstance, onLogout: onBTCLogout } = useBTCWallet()
  const { name: evmName, address: evmAddress, getWalletInstance: getEVMWalletInstance, onLogout: onEVMLogout } = useEVMWallet()
  const store = useWalletStore()

  const name = computed(() => {
    if (store.walletType === WALLET_TYPE.BITCOIN) {
      return btcName.value
    } else {
      return evmName.value
    }
  })

  const address = computed(() => {
    if (store.walletType === WALLET_TYPE.BITCOIN) {
      return btcAddress.value
    } else {
      return evmAddress.value
    }
  })

  function getInstance () {
    if (store.walletType === WALLET_TYPE.BITCOIN) {
      return getBTCWalletInstance()
    } else {
      return getEVMWalletInstance()
    }
  }

  function onConnect (type?: WALLET_TYPE) {
    createFuncall(WalletConnectModal, {
      modelValue: true,
      type: type ?? store.walletType ?? WALLET_TYPE.ETHEREUM,
      network: import.meta.env.VITE_NETWORK as NETWORK
    })
  }

  async function onLogout () {
    if (store.walletType === WALLET_TYPE.BITCOIN) {
      await onBTCLogout()
    } else {
      await onEVMLogout()
    }
  }

  async function sign (message: string) {
    if (address.value == null) throw new Error('Please login wallet before call function')
    const instance = getInstance()
    return await instance.sign(message, address.value)
  }

  async function getPublicKey () {
    if (address.value == null) throw new Error('Please login wallet before call function')
    const instance = getInstance()
    if (instance.type === WALLET_TYPE.BITCOIN) {
      return await instance.getPublicKey()
    } else {
      return address.value
    }
  }

  async function transfer (parameter: TransactionParameter): Promise<string>
  async function transfer (parameter: TransactionParameter, chainName: string): Promise<string>
  async function transfer (parameter: TransactionParameter, chainName: string, contractAddress: string): Promise<string>
  async function transfer (parameter: TransactionParameter, chainName?: string, contractAddress?: string) {
    if (address.value == null) throw new Error('Please login wallet before call function')
    const instance = getInstance()
    if (chainName == null) {
      if (instance.type !== WALLET_TYPE.BITCOIN) throw new Error('transfer mismatch wallet type')
      await instance.switchNetwork(import.meta.env.VITE_NETWORK)
      return await instance.transfer(parameter)
    }
    if (instance.type === WALLET_TYPE.BITCOIN) throw new Error('transfer mismatch wallet type')
    const config = CHAIN_CONFIG_MAP[chainName as CHAIN] as ChainConfig
    if (config == null) throw new Error(`Chain ${chainName} not config`)
    await instance.switchToChain(config)
    if (contractAddress != null) {
      return await instance.tokenTransfer(parameter, contractAddress)
    } else {
      return await instance.transfer(parameter, config)
    }
  }

  async function calcEstimateGas (parameter: TransactionParameter, chainName?: string) {
    const instance = getInstance()
    if (instance.type === WALLET_TYPE.BITCOIN) {
      const gasLimit = 200
      return Number(parameter.gas) * gasLimit * 1e-8
    } else {
      const config = CHAIN_CONFIG_MAP[chainName as CHAIN] as ChainConfig
      if (config == null) throw new Error(`Chain ${chainName} not config`)
      await instance.switchToChain(config)
      const provider = new ethers.BrowserProvider(instance.provider)
      try {
        const gasLimit = await provider.estimateGas({
          from: parameter.from,
          to: parameter.to,
          value: ethers.parseUnits(parameter.value, config.nativeCurrency.decimals)
        })
        const ratio = 1.5
        return ethers.formatUnits(Number(parameter.gas) * Number(gasLimit) * ratio, config.nativeCurrency.decimals)
      } finally {
        provider.destroy()
      }
    }
  }

  return {
    name,
    address,
    sign,
    transfer,
    getPublicKey,
    getInstance,
    calcEstimateGas,
    onConnect,
    onLogout
  }
}
