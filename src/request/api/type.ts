export interface Pagination<T> {
  page: number
  size: number
  totalCount: number
  list: T[]
}

export interface PaginationRequest {
  page: number
  pagesize: number
}

export interface SignatureRequest {
  walletAddress: string
  signature: string
  signContent: string
}
