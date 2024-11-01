<script setup lang="ts">
import { useCountDown, type CurrentTime } from '@/composables/hooks/use-count-down'

const props = defineProps<{
  time: string | number
}>()

const emit = defineEmits<{
  (e: 'change', current: CurrentTime): void
  (e: 'finish'): void
}>()

const { start, reset, current } = useCountDown({
  time: +props.time,
  onChange: (current) => { emit('change', current) },
  onFinish: () => { emit('finish') }
})

const resetTime = () => {
  reset(+props.time)

  start()
}

watch(() => props.time, resetTime, { immediate: true })

function padZero (num: number, targetLength = 2): string {
  let str = num + ''

  while (str.length < targetLength) {
    str = '0' + str
  }

  return str
}
</script>

<template>
  <div class="flex items-center gap-[2px] text-[10px]">
    <span class="px-[2px] rounded-[2px] bg-[#4B4A4A]">
      {{ padZero(current.days) }}
    </span>
    <span>D</span>
    <span class="px-[2px] rounded-[2px] bg-[#4B4A4A]">
      {{ padZero(current.hours) }}
    </span>
    <span>H</span>
    <span class="px-[2px] rounded-[2px] bg-[#4B4A4A]">
      {{ padZero(current.minutes) }}
    </span>
    <span>M</span>
  </div>
</template>

<style lang="scss" scoped>

</style>
