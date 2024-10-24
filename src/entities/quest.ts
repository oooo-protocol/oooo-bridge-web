export interface QuestTag {
  icon: string
  name: string
  background?: string
  color?: string
}

export interface Quest {
  groupId?: string
  title?: string
  subTitle?: string
  button?: string
  link?: string
  icon: string
  showStartDate?: string
  showEndDate?: string
  startDate?: string
  endDate?: string
  sortOrder?: number
  tags: QuestTag[]
}

export enum CHECK_IN_STATUS {
  UNCHECK,
  CHECKED
}

export interface CheckIn {
  walletAddress: string
  checkInDay: string
  status: CHECK_IN_STATUS
  gemAmount: string
}

export interface QuestGroup {
  groupId: string
  groupName: string
  groupSortOrder: number
}

export enum PRESET_GROUP_ID {
  INVITE_TO_EARN = 'inviteToEarn',
  FOLLOW_TO_EARN = 'followToEarn'
}

export interface CheckInChain {
  chainName: string
  showName: string
  icon: string
  contractAddress: string
}
