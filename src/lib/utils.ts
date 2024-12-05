import { type EthersError } from 'ethers'
import { CHAIN_CONFIG_MAP } from './constants'
import { type CHAIN } from '@/entities/chain'
import dayjs from 'dayjs'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Updater } from '@tanstack/vue-table'
import { type Ref } from 'vue'
import { ethers } from 'ethers'

export function cn (...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function valueUpdater<T extends Updater<any>> (updaterOrValue: T, ref: Ref) {
  ref.value =
    typeof updaterOrValue === 'function'
      ? updaterOrValue(ref.value)
      : updaterOrValue
}

/**
 * use `URL.createObjectURL` to generate uuid, `URL.createObjectURL` will return a uuid string in url's end
 * @returns
 */
export function uuid () {
  const tempUrl = URL.createObjectURL(new Blob())
  /**
   * Example
   * blob:https://xxx.com/b250d159-e1b6-4a87-9002-885d90033be3
   */
  const uuid = tempUrl.toString()
  URL.revokeObjectURL(tempUrl)
  return uuid.substring(uuid.lastIndexOf('/') + 1)
}

export function formatHashWithEllipsis (hash: string, front = 6, tail = 4) {
  return `${hash.substring(0, front)}...${hash.substring(hash.length - tail)}`
}

export const EVM_ADDRESS_REGEXP = /^(0x)[0-9A-Fa-f]{40}$/

/**
 * get available Rpc from the Rpc list
 */
export async function getRpcProvider (rpcs: string[]) {
  if (rpcs.length === 0) throw new Error('Rpc list is empty.')

  let index = 0

  while (true) {
    try {
      const provider = new ethers.JsonRpcProvider(rpcs[index])
      await provider.getNetwork()
      return provider
    } catch (e) {
      if (index === rpcs.length - 1) throw e
      index += 1
    }
  }
}

function trimExtraChar (value: string, char: string, regExp: RegExp) {
  const index = value.indexOf(char)

  if (index === -1) {
    return value
  }

  if (char === '-' && index !== 0) {
    return value.slice(0, index)
  }

  return value.slice(0, index + 1) + value.slice(index).replace(regExp, '')
}

export function formatNumber (
  value: string | number,
  allowDot = true,
  allowMinus = true
) {
  if (typeof value === 'number') {
    value = String(value)
  }
  if (allowDot) {
    value = trimExtraChar(value, '.', /\./g)
  } else {
    value = value.split('.')[0]
  }

  if (allowMinus) {
    value = trimExtraChar(value, '-', /-/g)
  } else {
    value = value.replace(/-/, '')
  }

  const regExp = allowDot ? /[^-0-9.]/g : /[^-0-9]/g

  return value.replace(regExp, '')
}

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
export const combineURLs = (baseURL: string, relativeURL: string) => {
  const url = new URL(baseURL)
  if (relativeURL) {
    url.pathname = `${url.pathname.replace(/\/+$/, '')}/${relativeURL.replace(/^\/+/, '')}`
  }
  return url.href
}

/**
 * open a authorization tab and listen message response
 * @param url authorization url
 * @param isCheckClosed Some website security policy cause we cannot determine tab is closed,
 * so we set a param for dev to close page closed check
 * @returns is verified
 */
export async function invokeAuthorizationLink (url: string, isCheckClosed: boolean = true) {
  return await new Promise<boolean>((resolve, reject) => {
    const tab = window.open(url, '_blank', 'popup,width=600,height=800')
    const bc = new BroadcastChannel('oooo-authorization')

    const timer = setInterval(() => {
      console.log(tab)
      if (isCheckClosed) {
        if (tab?.closed) {
          clear()
          reject(new Error('User cancel authorization'))
        }
      }
    }, 500)

    const listener = (event: MessageEvent<{
      source: string
      data: boolean
    }>) => {
      console.log(event.origin, event.data)
      if (event.origin !== window.location.origin) return
      const { source, data } = event.data
      if (source === 'oooo-authorization') {
        resolve(data)
        clear()
      }
    }

    bc.addEventListener('message', listener)

    const clear = () => {
      clearInterval(timer)
      window.removeEventListener('message', listener)
      if (tab) {
        tab.close()
      }
    }
  })
}

/**
 * setTimeout promisify
 * @param ms set timeout milliseconds
 * @returns {Promise<Timeout>}
 */
export const timeout = async (ms: number) => {
  return await new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * parse ether error and format it to get original error
 * @param e EthersError
 * @returns Error
 */
export function formatEtherError (e: EthersError) {
  try {
    if (e.info?.error != null) {
      return e.info.error
    } else if (e.error) {
      return e.error
    } else {
      return e
    }
  } catch {
    return e
  }
}

/**
 * get chain config from chain name
 * @param chain chain name
 * @returns {ChainConfig}
 */
export function getConfigFromChain (chain: string) {
  const chainConfig = CHAIN_CONFIG_MAP[chain as CHAIN]
  if (chainConfig == null) throw new Error(`Chain ${chain} not config`)
  return chainConfig
}

export function formatDate (date: string | number | Date, format = 'YYYY/MM/DD HH:mm') {
  return dayjs(date).format(format)
}
