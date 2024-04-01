import axios from '../axios'
import { type Transaction, type TransactionConfig, type TransactionListItem, type ChainConfig, type Chain, TRANSACTION_STATUS } from '@/entities/bridge'
import type { Pagination } from './type'
import { CHAIN_CONFIG_MAP, ENV_VARIABLE } from '@/lib/constants'
import { combineURLs } from '@/lib/utils'
import { ethers } from 'ethers'
import axiosOrigin from 'axios'
import { CHAIN } from '@/entities/chain'

export const retrieveChainConfigs = async () => {
  return await axios<ChainConfig[]>({
    url: '/v1/bridge/chain/list'
  })
}

export const retrieveTransactionConfig = async (data: {
  fromChain: string
  fromAddress: string
  fromAmount: string
  fromAssetType?: string
  fromAssetCode?: string
  toChain: string
  toAddress: string
  toAssetType?: string
  toAssetCode?: string
}) => {
  return await axios<TransactionConfig>({
    url: '/v1/bridge/transfer/pre/check',
    method: 'POST',
    data
  })
}

export const retrieveChainGasPrice = async (data: {
  chainName: string
  assetType?: string
  assetCode?: string
}) => {
  return await axios<Chain & {
    gasPrice: string
  }>({
    url: '/v1/bridge/transfer/gas/price',
    method: 'POST',
    data
  })
}

export const transfer = async (data: {
  fromChain: string
  fromAddress: string
  fromAssetType?: string
  fromAssetCode?: string
  toChain: string
  toAddress?: string
  toAssetType?: string
  toAssetCode?: string
  txnHash: string
  amount: string
  signature: string
  signContent: string
  publicKey: string
}) => {
  return await axios<boolean>({
    method: 'POST',
    url: '/v1/bridge/transfer/one',
    data
  })
}

export const retrieveTransactionDetail = async (params: {
  fromChain: string
  fromAssetType?: string
  fromAssetCode?: string
  fromTxnHash: string
  fromWalletAddr: string
}) => {
  return await axios<Transaction>({
    url: '/v1/bridge/transaction/detail',
    params
  })
}

export const retrieveTransactionList = async (params: {
  fromWalletAddr: string
  page?: number
  size?: number
}) => {
  return await axios<Pagination<TransactionListItem>>({
    url: '/v1/bridge/transaction/list',
    params
  })
}

/**
 * refer: https://docs.ethers.org/v6/api/providers/#TransactionResponse
 */
export const retrieveEthereumTransactionStatus = async (chain: CHAIN, hash: string) => {
  const config = CHAIN_CONFIG_MAP[chain]
  const jsonRpcProvider = new ethers.JsonRpcProvider(config.rpcUrls[0])
  try {
    const response = await jsonRpcProvider.getTransaction(hash)
    if (response == null) return TRANSACTION_STATUS.PENDING
    const receipt = await response.wait()
    if (receipt == null) return TRANSACTION_STATUS.PENDING
    if (receipt.status === 0) {
      return TRANSACTION_STATUS.FAILED
    } else if (receipt.status === 1) {
      return TRANSACTION_STATUS.SUCCEED
    } else {
      return TRANSACTION_STATUS.PROCESSING
    }
  } finally {
    jsonRpcProvider.destroy()
  }
}

export const retrieveBitcoinTransactionStatus = async (hash: string) => {
  const { data: { status } } = await axiosOrigin.get<{
    status: { confirmed: boolean }
  }>(combineURLs(ENV_VARIABLE.VITE_MEMPOOL_URL, `/tx/${hash}`), {
    withCredentials: false
  })
  if (status.confirmed) {
    return TRANSACTION_STATUS.SUCCEED
  } else {
    return TRANSACTION_STATUS.PROCESSING
  }
}

export const retrieveTransactionStatus = async (
  chain: CHAIN,
  hash: string
) => {
  if (chain === CHAIN.BTC) {
    return await retrieveBitcoinTransactionStatus(hash)
  } else {
    return await retrieveEthereumTransactionStatus(chain, hash)
  }
}
