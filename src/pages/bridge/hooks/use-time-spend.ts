import { CHAIN } from '@/entities/chain'
import { retrieveBitcoinRecommendFees } from '@/request/api/bridge'
import { useQuery } from '@tanstack/vue-query'
import { type PairConfig } from './use-config'

export const useTimeSpend = (
  to: Ref<string>,
  currentPairConfig: ComputedRef<PairConfig | null>
) => {
  const { data: fees } = useQuery({
    queryKey: ['/fees/recommended'],
    queryFn: retrieveBitcoinRecommendFees
  })

  const text = computed(() => {
    const config = currentPairConfig.value
    if (config == null) return
    if (to.value !== CHAIN.BTC) {
      return {
        SAVE_AMOUNT: config.feeSaveTips,
        TIME_SPEND: config.timeSpendTips,
        SAVE_TIME: config.timeSaveTips
      }
    }
    if (config.toMaxPrice == null || fees.value == null) {
      return {
        SAVE_AMOUNT: config.feeSaveTips,
        TIME_SPEND: 'SEVERAL HOURS',
        SAVE_TIME: config.timeSaveTips
      }
    }
    const toMaxPrice = Number(config.toMaxPrice)
    if (fees.value.fastestFee <= toMaxPrice) {
      return {
        SAVE_AMOUNT: config.feeSaveTips,
        TIME_SPEND: '10~60 MIN',
        SAVE_TIME: config.timeSaveTips
      }
    } else if (fees.value.halfHourFee < toMaxPrice) {
      return {
        SAVE_AMOUNT: config.feeSaveTips,
        TIME_SPEND: '30~60 MIN',
        SAVE_TIME: config.timeSaveTips
      }
    } else if (fees.value.hourFee < toMaxPrice) {
      return {
        SAVE_AMOUNT: config.feeSaveTips,
        TIME_SPEND: '60~120MIN',
        SAVE_TIME: config.timeSaveTips
      }
    } else {
      return {
        SAVE_AMOUNT: config.feeSaveTips,
        TIME_SPEND: 'SEVERAL HOURS',
        ERROR: 'Bitcoin network is currently congested'
      }
    }
  })

  return text
}
