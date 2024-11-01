import axios from '../axios'
import type { RewardsHubConfig, Banner, QuestConfig } from '@/entities/config'

export const retrieveBridgeBannerConfig = async () => {
  return await axios<Banner[]>({
    url: '/config/bridge/banners'
  })
}

export const retriveRewardsHubConfig = async () => {
  return await axios<RewardsHubConfig>({
    method: 'POST',
    url: '/config/bridge/quests'
  })
}

export const retrieveQuestConfig = async () => {
  return await axios<QuestConfig>({
    method: 'POST',
    url: '/config/quests'
  })
}
