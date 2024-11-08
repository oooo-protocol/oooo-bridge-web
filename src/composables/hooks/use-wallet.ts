import { CHAIN } from '@/entities/chain'
import { CHAIN_CONFIG_MAP } from '@/lib/constants'
import { getConfigFromChain } from '@/lib/utils'
import useWalletStore from '@/store/wallet'
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk'
import { ethers } from 'ethers'
import { getRpcProvider } from 'oooo-components/lib/utils'
import { WALLET_TYPE, useBTCWallet, useFractalWallet, useEVMWallet, WalletConnectModal, type NETWORK, type TransactionParameter, type ChainConfig } from 'oooo-components/oooo-wallet'
import { useAptosWallet } from 'oooo-components/oooo-wallet/aptos/use-aptos-wallet'
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
  const { name: fractalName, address: fractalAddress, getWalletInstance: getFractalWalletInstance, onLogout: onFractalLogout } = useFractalWallet()
  const { name: evmName, address: evmAddress, getWalletInstance: getEVMWalletInstance, onLogout: onEVMLogout } = useEVMWallet()
  const { name: aptosName, address: aptosAddress, getWalletInstance: getAptosWalletInstance, onLogout: onAptosLogout } = useAptosWallet()
  const store = useWalletStore()
  const walletType = computed(() => store.walletType)

  const name = computed(() => {
    if (store.walletType === WALLET_TYPE.BITCOIN) {
      return btcName.value
    } else if (store.walletType === WALLET_TYPE.FRACTAL) {
      return fractalName.value
    } else if (store.walletType === WALLET_TYPE.APTOS) {
      return aptosName.value
    } else {
      return evmName.value
    }
  })

  const address = computed(() => {
    if (store.walletType === WALLET_TYPE.BITCOIN) {
      return btcAddress.value
    } else if (store.walletType === WALLET_TYPE.FRACTAL) {
      return fractalAddress.value
    } else if (store.walletType === WALLET_TYPE.APTOS) {
      return aptosAddress.value
    } else {
      return evmAddress.value
    }
  })

  function getInstance () {
    if (store.walletType === WALLET_TYPE.BITCOIN) {
      return getBTCWalletInstance()
    } else if (store.walletType === WALLET_TYPE.FRACTAL) {
      return getFractalWalletInstance()
    } else if (store.walletType === WALLET_TYPE.APTOS) {
      return getAptosWalletInstance()
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
    } else if (store.walletType === WALLET_TYPE.FRACTAL) {
      await onFractalLogout()
    } else if (store.walletType === WALLET_TYPE.APTOS) {
      await onAptosLogout()
    } else {
      await onEVMLogout()
    }
  }

  async function sign (message: string) {
    if (address.value == null) throw new Error('Please login wallet before call function')
    const instance = getInstance()
    if (instance.type === WALLET_TYPE.BITCOIN || instance.type === WALLET_TYPE.FRACTAL) {
      const signature = await instance.sign(message)
      return { signature, signContent: message }
    } else if (instance.type === WALLET_TYPE.APTOS) {
      const res = await instance.sign(message)
      return {
        signature: res.signature.toString(),
        signContent: res.fullMessage
      }
    } else {
      const signature = await instance.sign(message, address.value)
      return { signature, signContent: message }
    }
  }

  async function getPublicKey () {
    if (address.value == null) throw new Error('Please login wallet before call function')
    const instance = getInstance()
    if (instance.type === WALLET_TYPE.BITCOIN || instance.type === WALLET_TYPE.FRACTAL) {
      return await instance.getPublicKey()
    } else if (instance.type === WALLET_TYPE.APTOS) {
      return (await instance.getPublicKey()).toString()
    } else {
      return address.value
    }
  }

  async function transfer (parameter: TransactionParameter, chainName: string): Promise<string>
  async function transfer (parameter: TransactionParameter, chainName: string, contractAddress: string): Promise<string>
  async function transfer (parameter: TransactionParameter, chainName: string, contractAddress?: string) {
    if (address.value == null) throw new Error('Please login wallet before call function')
    const instance = getInstance()
    const config = CHAIN_CONFIG_MAP[chainName as CHAIN] as ChainConfig
    if (config == null) throw new Error(`Chain ${chainName} not config`)
    /** BTC  */
    if (instance.type === WALLET_TYPE.BITCOIN) {
      if (chainName !== CHAIN.BTC) throw new Error('transfer mismatch wallet type')
      await instance.switchNetwork(import.meta.env.VITE_NETWORK)
      return await instance.transfer(parameter)
    /** FRACTAL */
    } else if (instance.type === WALLET_TYPE.FRACTAL) {
      if (chainName !== CHAIN.FRACTAL) throw new Error('transfer mismatch wallet type')
      await instance.switchChain(config.chainName)
      return await instance.transfer(parameter)
    } else if (instance.type === WALLET_TYPE.APTOS) {
      await instance.switchToChain({
        chainId: Number(config.chainId),
        name: config.chainName as Network
      })
      return await instance.transfer(parameter, config)
    } else {
      /** EVM  */
      await instance.switchToChain(config)
      if (contractAddress != null) {
        return await instance.tokenTransfer(parameter, contractAddress)
      } else {
        return await instance.transfer(parameter, config)
      }
    }
  }

  async function calcEstimateGas (parameter: TransactionParameter, chainName: string) {
    const instance = getInstance()
    if (instance.type === WALLET_TYPE.BITCOIN) {
      const gasLimit = 200
      return Number(parameter.gas) * gasLimit * 1e-8
    } else if (instance.type === WALLET_TYPE.FRACTAL) {
      const gasLimit = 200
      return Number(parameter.gas) * gasLimit * 1e-8
    } else if (instance.type === WALLET_TYPE.APTOS) {
      const config = new AptosConfig({ network: import.meta.env.VITE_MODE === 'testnet' ? Network.TESTNET : Network.MAINNET })
      const aptos = new Aptos(config)

      const publicKey = await instance.getPublicKey()

      const transaction = await aptos.transaction.build.simple({
        sender: parameter.from,
        data: {
          // All transactions on Aptos are implemented via smart contracts.
          function: '0x1::aptos_account::transfer',
          functionArguments: [parameter.to, parameter.value]
        }
      })

      const [userTransactionResponse] = await aptos.transaction.simulate.simple({
        signerPublicKey: publicKey,
        transaction
      })
      return userTransactionResponse.gas_used
    } else {
      if (chainName == null) throw new Error('chainName cannot be empty.')
      const config = getConfigFromChain(chainName)
      await instance.switchToChain(config)
      const provider = await getRpcProvider(config.rpcUrls)
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
    walletType,
    sign,
    transfer,
    getPublicKey,
    getInstance,
    calcEstimateGas,
    onConnect,
    onLogout
  }
}
