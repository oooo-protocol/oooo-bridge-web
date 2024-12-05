import { CHAIN } from '@/entities/chain'
import { SERVER_TOKEN_TYPE, type ServerToken } from '@/entities/server'
import { CHAIN_CONFIG_MAP } from '@/lib/constants'
import { getConfigFromChain } from '@/lib/utils'
import useWalletStore from '@/store/wallet'
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk'
import { ethers } from 'ethers'
import { getRpcProvider } from '@/lib/utils'
import { NETWORK, WALLET_TYPE, useBTCWallet, useFractalWallet, useEVMWallet, WalletConnectModal, useAptosWallet, useSuiWallet, type TransactionParameter, useMovementAptosWallet } from '@/composables/oooo-wallet'
import { createFuncall } from 'vue-funcall'
import { retrieveBitcoinOrFractalAddressBalance } from '@/request/api/bridge'

export const useWallet = () => {
  const { name: btcName, address: btcAddress, getWalletInstance: getBTCWalletInstance, onLogout: onBTCLogout } = useBTCWallet()
  const { name: fractalName, address: fractalAddress, getWalletInstance: getFractalWalletInstance, onLogout: onFractalLogout } = useFractalWallet()
  const { name: evmName, address: evmAddress, getWalletInstance: getEVMWalletInstance, onLogout: onEVMLogout } = useEVMWallet()
  const { name: aptosName, address: aptosAddress, getWalletInstance: getAptosWalletInstance, onLogout: onAptosLogout } = useAptosWallet()
  const { name: movementAptosName, address: movementAptosAddress, getWalletInstance: getMovementAptosWalletInstance, onLogout: onMovementAptosLogout } = useMovementAptosWallet()
  const { name: suiName, address: suiAddress, getWalletInstance: getSuiWalletInstance, onLogout: onSuiLogout } = useSuiWallet()
  const store = useWalletStore()
  const walletType = computed(() => store.walletType)

  const name = computed(() => {
    if (store.walletType === WALLET_TYPE.BITCOIN) {
      return btcName.value
    } else if (store.walletType === WALLET_TYPE.FRACTAL) {
      return fractalName.value
    } else if (store.walletType === WALLET_TYPE.APTOS) {
      return aptosName.value
    } else if (store.walletType === WALLET_TYPE.MOVEMENT_APTOS) {
      return movementAptosName.value
    } else if (store.walletType === WALLET_TYPE.SUI) {
      return suiName.value
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
    } else if (store.walletType === WALLET_TYPE.MOVEMENT_APTOS) {
      return movementAptosAddress.value
    } else if (store.walletType === WALLET_TYPE.SUI) {
      return suiAddress.value
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
    } else if (store.walletType === WALLET_TYPE.MOVEMENT_APTOS) {
      return getMovementAptosWalletInstance()
    } else if (store.walletType === WALLET_TYPE.SUI) {
      return getSuiWalletInstance()
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
    } else if (store.walletType === WALLET_TYPE.MOVEMENT_APTOS) {
      await onMovementAptosLogout()
    } else if (store.walletType === WALLET_TYPE.SUI) {
      await onSuiLogout()
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
    } else if (instance.type === WALLET_TYPE.APTOS || instance.type === WALLET_TYPE.MOVEMENT_APTOS) {
      const res = await instance.sign(message)
      return {
        signature: res.signature.toString(),
        signContent: res.fullMessage
      }
    } else if (instance.type === WALLET_TYPE.SUI) {
      const res = await instance.sign(message)
      return { signature: res, signContent: message }
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
    } else if (instance.type === WALLET_TYPE.APTOS || instance.type === WALLET_TYPE.MOVEMENT_APTOS) {
      return (await instance.getPublicKey()).toString()
    } else if (instance.type === WALLET_TYPE.SUI) {
      return await instance.getPublicKey()
    } else {
      return address.value
    }
  }

  async function getBalance (token: ServerToken) {
    if (address.value == null) throw new Error('Please login wallet before call function')
    const { chainName } = token
    const chainConfig = CHAIN_CONFIG_MAP[chainName as CHAIN]
    const instance = getInstance()
    if (chainConfig == null) throw new Error(`Chain ${chainName} not config`)
    switch (token.tokenType) {
      case SERVER_TOKEN_TYPE.BITCOIN:
        if (instance.type !== WALLET_TYPE.BITCOIN) throw new Error('Wallet type is mismatch method')
        return await retrieveBitcoinOrFractalAddressBalance(CHAIN.BTC, address.value)
      case SERVER_TOKEN_TYPE.FRACTAL:
        if (instance.type !== WALLET_TYPE.FRACTAL) throw new Error('Wallet type is mismatch method')
        return await retrieveBitcoinOrFractalAddressBalance(CHAIN.FRACTAL, address.value)
      case SERVER_TOKEN_TYPE.ETH_COIN:
        if (instance.type !== WALLET_TYPE.ETHEREUM) throw new Error('Wallet type is mismatch method')
        return await instance.getNativeBalance(address.value, chainConfig)
      case SERVER_TOKEN_TYPE.ETH_TOKEN:
        if (instance.type !== WALLET_TYPE.ETHEREUM) throw new Error('Wallet type is mismatch method')
        return await instance.getTokenBalance(address.value, chainConfig, token.contractAddress)
      case SERVER_TOKEN_TYPE.APTOS_COIN:
      case SERVER_TOKEN_TYPE.APTOS_TOKEN: {
        if (instance.type !== WALLET_TYPE.APTOS && instance.type !== WALLET_TYPE.MOVEMENT_APTOS) throw new Error('Wallet type is mismatch method')
        return await instance.getBalance(address.value, {
          function: token.aptosFunction,
          decimals: token.tokenDecimal,
          coinType: (token.aptosTypeArgument != null && token.aptosTypeArgument !== '') ? token.aptosTypeArgument : undefined,
          chainRpcUrl: chainConfig.rpcUrls[0]
        })
      }
      case SERVER_TOKEN_TYPE.SUI_COIN:
      case SERVER_TOKEN_TYPE.SUI_TOKEN:
        if (instance.type !== WALLET_TYPE.SUI) throw new Error('Wallet type is mismatch method')
        return await instance.getBalance(address.value, {
          coinType: token.suiCoinType,
          decimals: token.tokenDecimal,
          chain: import.meta.env.VITE_NETWORK === NETWORK.TESTNET ? 'sui:testnet' : 'sui:mainnet',
          chainRpcUrl: chainConfig.rpcUrls[0]
        })
    }
  }

  async function transfer (parameter: TransactionParameter, token: ServerToken) {
    if (address.value == null) throw new Error('Please login wallet before call function')
    const { chainName } = token
    const chainConfig = CHAIN_CONFIG_MAP[chainName as CHAIN]
    if (chainConfig == null) throw new Error(`Chain ${chainName} not config`)
    const instance = getInstance()
    switch (token.tokenType) {
      case SERVER_TOKEN_TYPE.BITCOIN:
        if (instance.type !== WALLET_TYPE.BITCOIN) throw new Error('Wallet type is mismatch method')
        await instance.switchNetwork(import.meta.env.VITE_NETWORK)
        return await instance.transfer(parameter)
      case SERVER_TOKEN_TYPE.FRACTAL:
        if (instance.type !== WALLET_TYPE.FRACTAL) throw new Error('Wallet type is mismatch method')
        await instance.switchChain(chainConfig.chainName)
        return await instance.transfer(parameter)
      case SERVER_TOKEN_TYPE.ETH_COIN:
        if (instance.type !== WALLET_TYPE.ETHEREUM) throw new Error('Wallet type is mismatch method')
        await instance.switchToChain(chainConfig)
        return await instance.transfer(parameter, chainConfig)
      case SERVER_TOKEN_TYPE.ETH_TOKEN:
        if (instance.type !== WALLET_TYPE.ETHEREUM) throw new Error('Wallet type is mismatch method')
        await instance.switchToChain(chainConfig)
        return await instance.tokenTransfer(parameter, token.contractAddress)
      case SERVER_TOKEN_TYPE.APTOS_COIN:
      case SERVER_TOKEN_TYPE.APTOS_TOKEN: {
        if (instance.type !== WALLET_TYPE.APTOS && instance.type !== WALLET_TYPE.MOVEMENT_APTOS) throw new Error('Wallet type is mismatch method')
        await instance.switchToChain({
          chainId: Number(chainConfig.chainId),
          name: chainConfig.chainName as Network,
          url: chainConfig.rpcUrls[0]
        })
        return await instance.transfer(parameter, {
          function: token.aptosFunction,
          decimals: token.tokenDecimal,
          coinType: (token.aptosTypeArgument != null && token.aptosTypeArgument !== '') ? token.aptosTypeArgument : undefined
        })
      }
      case SERVER_TOKEN_TYPE.SUI_COIN:
      case SERVER_TOKEN_TYPE.SUI_TOKEN:
        if (instance.type !== WALLET_TYPE.SUI) throw new Error('Wallet type is mismatch method')
        return await instance.transfer(parameter, {
          coinType: token.suiCoinType,
          decimals: token.tokenDecimal,
          chainRpcUrl: chainConfig.rpcUrls[0],
          chain: import.meta.env.VITE_NETWORK === NETWORK.TESTNET ? 'sui:testnet' : 'sui:mainnet'
        })
      default:
        throw new Error(`Unknown transfer Type: ${instance.type}`)
    }
  }

  async function calcEstimateGas (parameter: TransactionParameter, token: ServerToken) {
    const instance = getInstance()
    const chainConfig = getConfigFromChain(token.chainName)
    switch (token.tokenType) {
      case SERVER_TOKEN_TYPE.BITCOIN:
      case SERVER_TOKEN_TYPE.FRACTAL: {
        const gasLimit = 200
        return Number(parameter.gas) * gasLimit * 1e-8
      }
      case SERVER_TOKEN_TYPE.APTOS_COIN:
      case SERVER_TOKEN_TYPE.APTOS_TOKEN: {
        if (instance.type !== WALLET_TYPE.APTOS && instance.type !== WALLET_TYPE.MOVEMENT_APTOS) throw new Error('Wallet type is mismatch method')
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
      }
      case SERVER_TOKEN_TYPE.SUI_COIN:
      case SERVER_TOKEN_TYPE.SUI_TOKEN: {
        if (instance.type !== WALLET_TYPE.SUI) throw new Error('Wallet type is mismatch method')
        return await instance.estimateGas(parameter, {
          coinType: token.suiCoinType,
          decimals: token.tokenDecimal,
          chainRpcUrl: chainConfig.rpcUrls[0],
          chain: import.meta.env.VITE_NETWORK === NETWORK.TESTNET ? 'sui:testnet' : 'sui:mainnet'
        })
      }
      case SERVER_TOKEN_TYPE.ETH_COIN:
      case SERVER_TOKEN_TYPE.ETH_TOKEN: {
        if (instance.type !== WALLET_TYPE.ETHEREUM) throw new Error('Wallet type is mismatch method')
        await instance.switchToChain(chainConfig)
        const provider = await getRpcProvider(chainConfig.rpcUrls)
        try {
          const gasLimit = await provider.estimateGas({
            from: parameter.from,
            to: parameter.to,
            value: ethers.parseUnits(parameter.value, chainConfig.nativeCurrency.decimals)
          })
          const ratio = 1.5
          return ethers.formatUnits(Number(parameter.gas) * Number(gasLimit) * ratio, chainConfig.nativeCurrency.decimals)
        } finally {
          provider.destroy()
        }
      }
      default:
        throw new Error(`Unknown transfer Type: ${instance.type}`)
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
    getBalance,
    onConnect,
    onLogout
  }
}
