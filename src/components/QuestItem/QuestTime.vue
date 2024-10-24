<script setup lang="ts">
import { formatDate } from '@/lib/utils'
import CountDown from './CountDown.vue'

const props = defineProps<{
  startDate?: string
  endDate?: string
}>()
const timestamp = computed(() => {
  const current = +new Date()
  const endTimestamp = +new Date(props.endDate ?? current)
  return endTimestamp - current
})
const isShowCountdown = computed(() => {
  if (timestamp.value < 5 * 24 * 60 * 60 * 1000 && timestamp.value > 0) {
    return true
  }
  return false
})
const isEnd = ref(timestamp.value <= 0)
</script>

<template>
  <div
    class="text-[12px]"
    v-if="startDate && endDate"
  >
    <CountDown
      v-if="isShowCountdown"
      :time="timestamp"
      @finish="isEnd = true"
    />
    <p
      v-else-if="isEnd"
      class="text-[#ff5402]"
    >
      End.
    </p>
    <p
      v-else
      class="text-[#a4a4a4]"
    >
      {{ formatDate(startDate, 'MMM.DD') }} - {{ formatDate(endDate, 'MMM.DD') }}
    </p>
  </div>
</template>

<style lang="scss" scoped>

</style>
