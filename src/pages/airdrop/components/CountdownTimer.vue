<template>
  <div class="flex justify-center gap-2 md:gap-4 font-mono">
    <div class="relative">
      <FlipNumber
        class="size-20 md:w-[160px] md:h-[200px]"
        :value="days"
      />
      <p class="absolute bottom-[13px] left-1/2 -translate-x-1/2 text-xs text-gray-400">
        DAYS
      </p>
    </div>
    <div class="relative">
      <FlipNumber
        class="size-20 md:w-[160px] md:h-[200px]"
        :value="hours"
      />
      <p class="absolute bottom-[13px] left-1/2 -translate-x-1/2 text-xs text-gray-400">
        HRS
      </p>
    </div>

    <div class="relative">
      <FlipNumber
        class="size-20 md:w-[160px] md:h-[200px]"
        :value="minutes"
      />
      <p class="absolute bottom-[13px] left-1/2 -translate-x-1/2 text-xs text-gray-400">
        MINS
      </p>
    </div>

    <div class="relative">
      <FlipNumber
        class="size-20 md:w-[160px] md:h-[200px]"
        :value="seconds"
      />
      <p class="absolute bottom-[13px] left-1/2 -translate-x-1/2 text-xs text-gray-400">
        SECS
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import FlipNumber from './FlipNumber.vue'

interface Props {
  time: number | Date
}

const props = defineProps<Props>()
const emit = defineEmits<(e: 'finish') => void>()

const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | null = null

const remaining = computed(() => {
  const targetTime = typeof props.time === 'number' ? props.time : props.time.getTime()
  const diff = targetTime - now.value
  return diff > 0 ? diff : 0
})

watch(remaining, (newVal) => {
  if (newVal === 0) {
    emit('finish')
  }
})

const days = computed(() => {
  return String(Math.floor(remaining.value / (1000 * 60 * 60 * 24))).padStart(2, '0')
})

const hours = computed(() => {
  return String(Math.floor((remaining.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0')
})

const minutes = computed(() => {
  return String(Math.floor((remaining.value % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0')
})

const seconds = computed(() => {
  return String(Math.floor((remaining.value % (1000 * 60)) / 1000)).padStart(2, '0')
})

onMounted(() => {
  // Check immediately if already expired
  if (remaining.value === 0) {
    emit('finish')
  }

  timer = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
})
</script>
