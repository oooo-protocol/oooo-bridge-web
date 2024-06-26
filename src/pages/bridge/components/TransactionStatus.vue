<script setup lang="ts">
import { TRANSACTION_STATUS_MAP, CHAIN_BLOCK_EXPLORER_URL_MAP } from '@/lib/constants'
import { TRANSACTION_STATUS } from '@/entities/bridge'
import { combineURLs } from '@/lib/utils'
import { formatHashWithEllipsis } from 'oooo-components/lib/utils'
import { CHAIN } from '@/entities/chain'
import Icon from 'oooo-components/ui/Icon.vue'

defineProps<{
  status: TRANSACTION_STATUS
  chainName: CHAIN
  txnHash?: string
}>()

defineEmits<(e: 'checking') => void>()
</script>

<template>
  <div class="flex gap-[4px] text-[#616161]">
    <Icon
      class="shrink-0"
      :name="TRANSACTION_STATUS_MAP[status].icon"
    />
    <div
      class="text-[14px] md:text-[16px] -tracking-tighter leading-none"
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
            :href="combineURLs(CHAIN_BLOCK_EXPLORER_URL_MAP[chainName], `/tx/${txnHash}`)"
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
