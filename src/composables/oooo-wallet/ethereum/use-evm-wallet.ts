import { type EthereumWalletImpl, WALLET } from '../types'
import Wrapper from '../wrapper'
import { MetamaskWallet } from './wallets/metamask'
import { OKXEthereumWallet } from './wallets/okx-evm'
import { OnekeyEthereumWallet } from './wallets/onekey-evm'
import { BybitEthereumWallet } from './wallets/bybit-evm'
import { BitgetEthereumWallet } from './wallets/bitget-evm'
import { TokenPocketEthereumWallet } from './wallets/tokenpocket-evm'
import { Coin98EthereumWallet } from './wallets/coin98-evm'
import { WalletConnectWallet } from './wallets/wallet-connect'
import { BinanceEthereumWallet } from './wallets/binance-evm'
import { TomoEthereumWallet } from './wallets/tomo'

const wrapper = new Wrapper<EthereumWalletImpl>(
  'oooo-evm-wallet',
  {
    [WALLET.METAMASK]: MetamaskWallet,
    [WALLET.OKX]: OKXEthereumWallet,
    [WALLET.ONEKEY]: OnekeyEthereumWallet,
    [WALLET.BYBIT]: BybitEthereumWallet,
    [WALLET.BITGET]: BitgetEthereumWallet,
    [WALLET.TOKENPOCKET]: TokenPocketEthereumWallet,
    [WALLET.COIN98]: Coin98EthereumWallet,
    [WALLET.WALLETCONNCET]: WalletConnectWallet,
    [WALLET.BINANCE]: BinanceEthereumWallet,
    [WALLET.TOMO]: TomoEthereumWallet
  }
)

export const useEVMWallet = () => {
  const getWalletInstance = () => {
    return wrapper.instance
  }

  const onConnect = async (name: WALLET) => {
    await wrapper.onConnect(name)
  }

  const onLogout = async () => {
    await wrapper.onLogout()
  }

  return {
    name: wrapper.name,
    address: wrapper.address,
    getWalletInstance,
    onConnect,
    onLogout
  }
}
