import axios from '../axios'
import { type Transaction, type TransactionConfig, type Chain, TRANSACTION_STATUS, type EstimateData } from '@/entities/bridge'
import type { Pagination } from './type'
import { combineURLs, getConfigFromChain } from '@/lib/utils'
import { CHAIN_BLOCK_EXPLORER_URL_MAP, CHAIN_CONFIG_MAP, CHAIN_TYPE_MAP } from '@/lib/constants'
import axiosOrigin from 'axios'
import { CHAIN_TYPE, type CHAIN } from '@/entities/chain'
import { type ServerTokenPair, type ServerConfigs } from '@/entities/server'
import { getRpcProvider } from 'oooo-components/lib/utils'
import { Aptos, AptosConfig, TransactionResponseType } from '@aptos-labs/ts-sdk'
import { SuiClient } from '@mysten/sui/client'

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

export const retrieveBitcoinOrFractalTransactionStatus = async (chain: CHAIN, hash: string) => {
  const blockExplorerUrl = CHAIN_BLOCK_EXPLORER_URL_MAP[chain]
  const { data: { status } } = await axiosOrigin.get<{
    status: { confirmed: boolean }
  }>(combineURLs(blockExplorerUrl, `/api/tx/${hash}`), {
    withCredentials: false
  })
  if (status.confirmed) {
    return TRANSACTION_STATUS.SUCCEED
  } else {
    return TRANSACTION_STATUS.PROCESSING
  }
}

export const retrieveAptosTransactionStatus = async (chain: CHAIN, hash: string) => {
  const chainConfig = CHAIN_CONFIG_MAP[chain]
  if (chainConfig == null) {
    throw new Error('Method: retrieveAptosTransactionStatus Failed to get chain config')
  }
  const config = new AptosConfig({
    fullnode: chainConfig.rpcUrls[0]
  })
  const aptos = new Aptos(config)
  const result = await aptos.getTransactionByHash({ transactionHash: hash })
  if (result.type === TransactionResponseType.Pending) {
    return TRANSACTION_STATUS.PROCESSING
  } else {
    return TRANSACTION_STATUS.SUCCEED
  }
}

export const retrieveSuiTransactionStatus = async (chain: CHAIN, hash: string) => {
  const chainConfig = CHAIN_CONFIG_MAP[chain]
  if (chainConfig == null) {
    throw new Error('Method: retrieveSuiTransactionStatus Failed to get chain config')
  }
  const client = new SuiClient({ url: chainConfig.rpcUrls[0] })
  const tx = await client.getTransactionBlock({
    digest: hash,
    options: {
      showEffects: true
    }
  })
  const status = tx.effects?.status.status
  if (status === 'success') {
    return TRANSACTION_STATUS.SUCCEED
  } else if (status === 'failure') {
    return TRANSACTION_STATUS.FAILED
  } else {
    return TRANSACTION_STATUS.PROCESSING
  }
}

export const retrieveTransactionStatus = async (
  chain: CHAIN,
  hash: string
) => {
  const chainType = CHAIN_TYPE_MAP[chain]
  if (chainType === CHAIN_TYPE.BITCOIN) {
    return await retrieveBitcoinOrFractalTransactionStatus(chain, hash)
  } else if (chainType === CHAIN_TYPE.APTOS || chainType === CHAIN_TYPE.MOVEMENT_APTOS) {
    return await retrieveAptosTransactionStatus(chain, hash)
  } else if (chainType === CHAIN_TYPE.SUI) {
    return await retrieveSuiTransactionStatus(chain, hash)
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

export const retrieveBitcoinOrFractalAddressBalance = async (chain: CHAIN.FRACTAL | CHAIN.BTC, address: string) => {
  const blockExplorerUrl = CHAIN_BLOCK_EXPLORER_URL_MAP[chain]
  const { data: { chain_stats: chainStats } } = await axiosOrigin.get<{
    chain_stats: { funded_txo_sum: number, spent_txo_sum: number }
  }>(combineURLs(blockExplorerUrl, `/api/address/${address}`), {
    withCredentials: false
  })
  return ((chainStats.funded_txo_sum - chainStats.spent_txo_sum) * Math.pow(10, -8)).toString()
}

export const retrievePairEstimatePoint = async (data: {
  pairId: number
  walletAddress: string
}) => {
  return await axios<string>({
    url: '/point/pair',
    params: data
  })
}
