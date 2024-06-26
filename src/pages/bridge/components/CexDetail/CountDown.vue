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

const countDown = computed(() => {
  let { hours, minutes, seconds } = current.value

  if (current.value.days) {
    hours += current.value.days * 24
  }

  const formatHours = padZero(hours)
  const formatMinutes = padZero(minutes)
  const formatSeconds = padZero(seconds)

  return hours ? `${formatHours}:${formatMinutes}:${formatSeconds}` : `${formatMinutes}:${formatSeconds}`
})
</script>

<template>
  <span>
    {{ countDown }}
  </span>
</template>

<style lang="scss" scoped>

</style>
