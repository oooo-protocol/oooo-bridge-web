import axios from '../axios'
import { type SignatureRequest } from './type'

export const isFollowedTwitter = async (data: SignatureRequest) => {
  return await axios<boolean>({
    method: 'POST',
    url: '/point/twitter/check',
    data
  })
}

export const verifyTwitter = async (data: SignatureRequest) => {
  return await axios<boolean>({
    method: 'POST',
    url: '/point/twitter/verify',
    data
  })
}

export const getTwitterAuthorizationUrl = async (data: SignatureRequest) => {
  return await axios<string>({
    method: 'POST',
    url: '/twitter/authorization/url',
    data
  })
}

interface TwitterCallback {
  code: string
  state: string
}

export const sendTwitterCallback = async (data: TwitterCallback) => {
  return await axios<boolean>({
    method: 'POST',
    url: '/twitter/callback',
    data
  })
}

export const isFollowedDiscord = async (data: SignatureRequest) => {
  return await axios<boolean>({
    method: 'POST',
    url: '/point/discord/check',
    data
  })
}

export const getDiscordAuthorizationUrl = async (data: SignatureRequest) => {
  return await axios<string>({
    method: 'POST',
    url: '/discord/authorization/url',
    data
  })
}

interface DiscordCallback {
  code: string
  state: string
}

export const sendDiscordCallback = async (data: DiscordCallback) => {
  return await axios<boolean>({
    method: 'POST',
    url: '/discord/callback',
    data
  })
}

interface Pagination {
  page: number
  pagesize: number
}

export interface AccountListItem {
  walletAddress: string
  point: string
  rank: string
}

export const retrieveTopAccountList = async (params: Pagination) => {
  return await axios<{
    accountList: AccountListItem[]
    total: number
  }>({
    url: '/point/account/top',
    params
  })
}

export const retrieveAccountInfo = async (data: { walletAddress: string }) => {
  return await axios<{
    point: string
    gem: string
    rank: string
    inviteCode: string
  }>({
    url: '/point/account',
    method: 'POST',
    data
  })
}

export const createInvitationRelationship = async (data: SignatureRequest & { inviteCode: string }) => {
  return await axios({
    url: '/point/invitation',
    method: 'POST',
    data
  })
}

export interface PointLog {
  type: string
  point: string
  createTime: string
  walletAddress: string
}

export const retrieveAccountPointLogs = async (data: SignatureRequest & Pagination) => {
  return await axios<{
    totalCount: number
    list: PointLog[]
  }>({
    url: '/point/account/log',
    method: 'POST',
    data
  })
}

export interface VerifyTaskRequest {
  taskId: string
}

export const verifyTask = async (data: SignatureRequest & VerifyTaskRequest) => {
  return await axios<boolean>({
    url: '/activity/transaction/verify',
    method: 'POST',
    data
  })
}

export const retrieveTaskStatus = async (data: SignatureRequest & VerifyTaskRequest) => {
  return await axios<boolean>({
    url: '/activity/task/status',
    method: 'POST',
    data
  })
}
