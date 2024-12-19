import axios from '../axios'
import type { BadgeConfig } from '@/entities/config'
import type { UserBadgeWithMint, UserBadge } from '@/entities/badge'
import { type SignatureRequest } from './type'

export const retrieveBadgeConfig = async (data: { walletAddress?: string }) => {
  return await axios<BadgeConfig>({
    url: '/badge/configuration',
    params: data
  })
}

export const retrieveUserBadgeInfo = async (data: SignatureRequest & { badgeId: UserBadgeWithMint['badgeId'] }) => {
  return await axios<UserBadgeWithMint>({
    url: '/badge/mint/info',
    method: 'POST',
    data
  })
}

export const verifyBadgeLimit = async (data: { walletAddress: string, badgeId: number, mintLimitId: number }) => {
  return await axios<boolean>({
    url: '/badge/mint/check',
    params: data
  })
}

export interface MintBadgeRequest extends SignatureRequest {
  badgeId: UserBadge['badgeId']
  txnHash: UserBadge['txnHash']
}

export const mintBadge = async (
  data: MintBadgeRequest
) => {
  return await axios<UserBadge>({
    url: '/badge/mint/report',
    method: 'POST',
    data
  })
}

export const getBadgeDiscordAuthorizationUrl = async (
  data: {
    walletAddress: string
    badgeId: UserBadge['badgeId']
    mintLimitId: number
  }
) => {
  return await axios<string>({
    url: '/badge/discord/authorization/url',
    params: data
  })
}

interface DiscordCallback {
  code: string
  state: string
}

export const sendBadgeDiscordCallback = async (data: DiscordCallback) => {
  return await axios<boolean>({
    method: 'POST',
    url: '/badge/discord/callback',
    data
  })
}
