import UAParser from 'ua-parser-js'

/**
 * Get the current device type
 * @returns {string} console, mobile, tablet, smarttv, wearable, embedded
 */
export const getDeviceType = () => {
  const parser = new UAParser()
  const { type } = parser.getDevice()
  return type
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
  return relativeURL ? `${baseURL.replace(/\/+$/, '')}/${relativeURL.replace(/^\/+/, '')}` : baseURL
}
