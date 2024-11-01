import type { QuestGroup, Quest } from './quest'

export interface Banner {
  startDate?: string
  endDate?: string
  imageUrl: string
  mobileImageUrl?: string
  link?: string
  sortOrder: number
}

export interface RewardsHubConfig {
  bridgeQuestsBanners: Banner[]
  bridgeQuestsTasks: Quest[]
}

export interface QuestConfig {
  questsTaskGroups: QuestGroup[]
  questsTasks: Quest[]
  questsTopBanners: Banner[]
}
