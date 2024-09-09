import axios from '../axios'
import { type Transaction, type TransactionConfig, type Chain, TRANSACTION_STATUS, type EstimateData } from '@/entities/bridge'
import type { Pagination } from './type'
import { combineURLs, getConfigFromChain } from '@/lib/utils'
import axiosOrigin from 'axios'
import { CHAIN } from '@/entities/chain'
import { type ServerTokenPair, type ServerConfigs } from '@/entities/server'
import { getRpcProvider } from 'oooo-components/lib/utils'

export const retrieveBridgeConfigs = async () => {
  return await axios<ServerConfigs>({
    url: '/v1/bridge/global/configuration'
  })
}

export const retreieveBridgePairs = async (data: { assetCode: string }) => {
  return await axios<Pagination<ServerTokenPair>>({
    url: '/v1/bridge/global/pairs',
    params: data
  })
}

export const retrieveEstimateData = async (data: {
  pairId: number
  fromAmount: string
  voucherRecordId?: number
}) => {
  return await axios<EstimateData>({
    url: '/v1/bridge/transaction/fee/estimate',
    params: data
  })
}

export const retrieveTransactionConfig = async (data: {
  pairId: number
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

export const createTransaction = async (data: {
  pairId: number
  fromChain: string
  fromAddress: string
  fromAssetType?: string
  fromAssetCode?: string
  toChain: string
  toAddress?: string
  toAssetType?: string
  toAssetCode?: string
  txnHash?: string
  amount: string
  signature: string
  signContent: string
  publicKey: string
  voucherRecordId?: number
}) => {
  return await axios<Transaction>({
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
  return await axios<Pagination<Transaction>>({
    url: '/v1/bridge/transaction/list',
    params
  })
}

/**
 * refer: https://docs.ethers.org/v6/api/providers/#TransactionResponse
 */
export const retrieveEthereumTransactionStatus = async (chain: CHAIN, hash: string) => {
  const config = getConfigFromChain(chain)
  const provider = await getRpcProvider(config.rpcUrls)
  try {
    const response = await provider.getTransaction(hash)
    console.log(response)
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
    provider.destroy()
  }
}

export const retrieveBitcoinTransactionStatus = async (hash: string) => {
  const { data: { status } } = await axiosOrigin.get<{
    status: { confirmed: boolean }
  }>(combineURLs(import.meta.env.VITE_MEMPOOL_URL, `/tx/${hash}`), {
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

export const retrieveBitcoinRecommendFees = async () => {
  const { data } = await axiosOrigin.get<{
    'fastestFee': number
    'halfHourFee': number
    'hourFee': number
    'economyFee': number
    'minimumFee': number
  }>(combineURLs(import.meta.env.VITE_MEMPOOL_URL, '/v1/fees/recommended'), {
    withCredentials: false
  })
  return data
}
