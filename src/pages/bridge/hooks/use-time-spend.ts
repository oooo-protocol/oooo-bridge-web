import { CHAIN } from '@/entities/chain'
import { BRIDGE_TEXT_MAP } from '@/lib/config'
import { retrieveBitcoinRecommendFees } from '@/request/api/bridge'
import { useQuery } from '@tanstack/vue-query'

export const useTimeSpend = (select: {
  from: CHAIN
  to: CHAIN
}, toMaxSat: Ref<number | undefined>) => {
  const { data: fees } = useQuery({
    queryKey: ['/fees/recommended'],
    queryFn: retrieveBitcoinRecommendFees
  })

  const text = computed(() => {
    if (select.from === CHAIN.BINANCE_CEX) {
      if (select.to === CHAIN.MERLIN) {
        return {
          SAVE_AMOUNT: 'SAVE $19.2~$20.3',
          TIME_SPEND: '30S～5MIN',
          SAVE_TIME: BRIDGE_TEXT_MAP.CEX_SAVE_TIME
        }
      }
      return {
        SAVE_AMOUNT: BRIDGE_TEXT_MAP.CEX_SAVE_AMOUNT,
        TIME_SPEND: '30S～5MIN',
        SAVE_TIME: BRIDGE_TEXT_MAP.CEX_SAVE_TIME
      }
    }
    if (select.from === CHAIN.BTC) {
      return {
        SAVE_AMOUNT: BRIDGE_TEXT_MAP.BITCOIN_SAVE_AMOUNT,
        TIME_SPEND: BRIDGE_TEXT_MAP.BITCOIN_TIME_SPEND,
        SAVE_TIME: BRIDGE_TEXT_MAP.BITCOIN_SAVE_TIME
      }
    }
    if (select.to !== CHAIN.BTC) {
      return {
        SAVE_AMOUNT: BRIDGE_TEXT_MAP.ETHEREUM_SAVE_AMOUNT,
        TIME_SPEND: BRIDGE_TEXT_MAP.ETHEREUM_TIME_SPEND,
        SAVE_TIME: BRIDGE_TEXT_MAP.ETHEREUM_SAVE_TIME
      }
    }
    if (toMaxSat.value == null || fees.value == null) {
      return {
        SAVE_AMOUNT: BRIDGE_TEXT_MAP.BITCOIN_SAVE_AMOUNT,
        TIME_SPEND: 'Several hours',
        SAVE_TIME: BRIDGE_TEXT_MAP.BITCOIN_SAVE_TIME
      }
    }
    if (fees.value.fastestFee <= toMaxSat.value) {
      return {
        SAVE_AMOUNT: BRIDGE_TEXT_MAP.BITCOIN_SAVE_AMOUNT,
        TIME_SPEND: '10~60 MIN',
        SAVE_TIME: BRIDGE_TEXT_MAP.BITCOIN_SAVE_TIME
      }
    } else if (fees.value.halfHourFee < toMaxSat.value) {
      return {
        SAVE_AMOUNT: BRIDGE_TEXT_MAP.BITCOIN_SAVE_AMOUNT,
        TIME_SPEND: '30~60 MIN',
        SAVE_TIME: BRIDGE_TEXT_MAP.BITCOIN_SAVE_TIME
      }
    } else if (fees.value.hourFee < toMaxSat.value) {
      return {
        SAVE_AMOUNT: BRIDGE_TEXT_MAP.BITCOIN_SAVE_AMOUNT,
        TIME_SPEND: '60~120MIN',
        SAVE_TIME: BRIDGE_TEXT_MAP.BITCOIN_SAVE_TIME
      }
    } else {
      return {
        SAVE_AMOUNT: BRIDGE_TEXT_MAP.BITCOIN_SAVE_AMOUNT,
        TIME_SPEND: 'Several hours',
        ERROR: 'Bitcoin network is currently congested'
      }
    }
  })

  return text
}
