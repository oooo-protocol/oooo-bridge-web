<script setup lang="ts">
import { TRANSACTION_STATUS_MAP, CHAIN_BLOCK_EXPLORER_URL_MAP } from '@/lib/constants'
import { TRANSACTION_STATUS } from '@/entities/bridge'
import { combineURLs } from '@/lib/utils'
import { formatHashWithEllipsis } from '@/lib/utils'
import { CHAIN } from '@/entities/chain'
import Icon from '@/components/Icon.vue'

const props = defineProps<{
  status: TRANSACTION_STATUS
  chainName: CHAIN
  txnHash?: string
}>()

defineEmits<(e: 'checking') => void>()

const txnUrl = computed(() => {
  if (props.txnHash == null) return undefined
  const explorer = CHAIN_BLOCK_EXPLORER_URL_MAP[props.chainName]
  if ([CHAIN.MOVEMENT_APTOS, CHAIN.APTOS].includes(props.chainName)) {
    return combineURLs(explorer, `/txn/${props.txnHash}`)
  } else {
    return combineURLs(explorer, `/tx/${props.txnHash}`)
  }
})
</script>

<template>
  <div class="flex items-center gap-[4px] text-[#616161]">
    <Icon
      class="shrink-0"
      :name="TRANSACTION_STATUS_MAP[status].icon"
    />
    <div
      class="text-[12px] -tracking-tighter leading-none"
    >
      <template v-if="[CHAIN.BINANCE_CEX, CHAIN.BINANCE_PAY].includes(chainName)">
        <template v-if="status === TRANSACTION_STATUS.SUCCEED">
          COMPLETED
        </template>
        <template v-else-if="status === TRANSACTION_STATUS.CLOSED || status === TRANSACTION_STATUS.TIMEOUT">
          CLOSED
        </template>
        <template v-else>
          <p>CHECKING TRANSFER</p>
          <p
            class="underline cursor-pointer"
            @click="$emit('checking')"
          >
            TRANSFER INSTRUCTIONS
          </p>
        </template>
      </template>
      <template v-else>
        <p
          v-if="status === TRANSACTION_STATUS.FAILED"
          class="font-[300] text-[#ff5402]"
        >
          TRANSACTION FAILED
        </p>
        <p v-else-if="txnHash">
          TX:
          <a
            :href="txnUrl"
            target="_blank"
          >
            {{ formatHashWithEllipsis(txnHash) }}
          </a>
        </p>
        <p v-else-if="status === TRANSACTION_STATUS.CLOSED || status === TRANSACTION_STATUS.TIMEOUT">
          CLOSED
        </p>
        <p v-else>
          Waiting
        </p>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
