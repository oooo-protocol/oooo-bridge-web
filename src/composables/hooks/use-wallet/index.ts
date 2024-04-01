import { WALLET_TYPE, type TransactionParameter, WALLET } from '@/entities/wallet'
import metamaskWallet from './wallet/metamask'
import okxEvmWallet from './wallet/okx-evm'
import okxBitcoinWallet from './wallet/okx-bitcoin'
import unisatWallet from './wallet/unisat'
import { storage } from '@preflower/utils'
import { type EthereumWallet } from './wallet/ethereum'
import { type BitcoinWallet } from './wallet/bitcoin'
import { CHAIN } from '@/entities/chain'

interface WalletStorage {
  address: string
  name: WALLET
}

const instances = {
  [WALLET.METAMASK]: metamaskWallet,
  [WALLET.OKX]: okxEvmWallet,
  [WALLET.OKX_BITCOIN]: okxBitcoinWallet,
  [WALLET.UNISAT]: unisatWallet
}

class WalletWrapper {
  wallet = ref<WalletStorage>()
  instance: EthereumWallet | BitcoinWallet | undefined

  constructor () {
    void this.init()
  }

  init = async () => {
    const _wallet = storage.local.get<WalletStorage>('oooo-wallet')
    if (_wallet != null) {
      const _instance = instances[_wallet.name]
      this.wallet.value = _wallet
      this.instance = _instance

      const accounts = await _instance.getAccounts()
      if (accounts.includes(_wallet.address)) {
        const provider = await _instance.getProvider()
        await provider.on('accountsChanged', this.handleAddressChanged)
      } else {
        void this.onLogout()
      }
    }
  }

  getInstance = (name?: WALLET) => {
    if (name != null) this.instance = instances[name]
    if (this.instance == null) {
      throw new Error(`Invalid wallet wallet-id: ${name as any}`)
    }
    return this.instance
  }

  updateWallet = (value?: WalletStorage) => {
    this.wallet.value = value
    if (value) {
      storage.local.set('oooo-wallet', value)
    } else {
      storage.local.remove('oooo-wallet')
    }
  }

  onConnect = async (name: WALLET) => {
    const instance = this.getInstance(name)
    const address = await instance.connect()
    const provider = await instance.getProvider()
    await provider.on('accountsChanged', this.handleAddressChanged)
    this.updateWallet({
      address,
      name
    })
  }

  handleAddressChanged = (accounts: string[]) => {
    const account = accounts[0]
    if (account && this.wallet.value) {
      this.updateWallet({
        address: accounts[0],
        name: this.wallet.value.name
      })
    } else {
      void this.onLogout()
    }
  }

  onLogout = async () => {
    this.updateWallet(undefined)
    if (this.instance) {
      void this.instance.disconnect()
      void this.instance.removeAllListeners()
      this.instance = undefined
    }
  }
}

const wrapper = new WalletWrapper()

export const useWallet = () => {
  const getWalletType = () => {
    const instance = wrapper.getInstance()
    return instance.type
  }

  const sign = async (message: string, from: string) => {
    const instance = wrapper.getInstance()
    return await instance.sign(message, from)
  }

  const getPublicKey = async () => {
    const instance = wrapper.getInstance()
    if (instance.type === WALLET_TYPE.BITCOIN) {
      return await instance.getPublicKey()
    } else if (instance.type === WALLET_TYPE.ETHEREUM) {
      return wrapper.wallet.value?.address
    }
  }

  const transaction = async (parameter: TransactionParameter) => {
    const instance = wrapper.getInstance()
    return await instance.transaction(parameter)
  }

  const retrieveNativeBalance = async (chain: CHAIN) => {
    if (!wrapper.wallet.value) return
    const instance = wrapper.getInstance()
    if (instance.type === WALLET_TYPE.ETHEREUM) {
      /**
       * 链与钱包类型不匹配, 则直接跳过
       */
      if (chain === CHAIN.BTC) return
      return await instance.getNativeBalance(wrapper.wallet.value.address, chain)
    } else if (instance.type === WALLET_TYPE.BITCOIN) {
      /**
       * 链与钱包类型不匹配, 则直接跳过
       */
      if (chain !== CHAIN.BTC) return
      return await instance.getNativeBalance()
    }
  }

  const onConnect = async (name: WALLET) => {
    await wrapper.onConnect(name)
  }

  const onLogout = async () => {
    await wrapper.onLogout()
  }

  return {
    wallet: wrapper.wallet,
    getWalletType,
    sign,
    transaction,
    getPublicKey,
    retrieveNativeBalance,
    onConnect,
    onLogout
  }
}
