import { type EthersError } from 'ethers'

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
  return relativeURL ? `${baseURL.replace(/\/+$/, '')}/${relativeURL.replace(/^\/+/, '')}` : baseURL
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
