// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REQUEST_DOMAIN: string
  readonly VITE_NETWORK: NETWORK
  readonly VITE_TITLE: string
  readonly VITE_DEFAULT_SELECT_FROM: string
  readonly VITE_DEFAULT_SELECT_TO: string
  readonly VITE_DEFAULT_SELECT_TOKEN: string
  readonly VITE_MEMPOOL_URL: string
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string
}
