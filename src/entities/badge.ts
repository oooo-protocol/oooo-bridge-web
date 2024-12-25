import { type QuestTag } from './quest'

export interface Category {
  id: number
  title: string
  description: string
}

export interface Badge {
  id: number // badge id
  categoryId: number // 分类 id
  name: string // badge 名称
  description: string // badge 描述
  icon: string // badge 图标
  chainId: number // badge 所属链 chainId
  chainName: string // badge 所属链
  contractAddress: string
  tags: QuestTag[]
  mintLimit: BadgeMintLimit[]
}

export enum BadgeMintType {
  WHITE_LIST = 1,
  GALXE_OAT,
  DISCORD
}

export interface BadgeMintLimit {
  id: number
  title: string
  description: string
  type: BadgeMintType
  icon: string
  /**
   * 前端内部设置状态, 用于前端更新该 MintLimit 的状态
   */
  status?: boolean
}

export interface UserBadge {
  walletAddress: string
  badgeId: Badge['id']
  tokenId: number
  chainId: Badge['chainId']
  chainName: Badge['chainName']
  contractAddress: Badge['contractAddress']
  txnHash: string
  signature: string
  mintTime: string
}

export enum UserBadgeMintStatus {
  UNMINT,
  MINTING,
  MINTED
}

export interface UserBadgeWithMint extends UserBadge {
  status: UserBadgeMintStatus
  badgeIcon: Badge['icon']
}
