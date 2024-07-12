<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { retrieveNotification } from '@/request/api/common'

const marquee = ref<HTMLParagraphElement>()

const { data: messages } = useQuery({
  queryKey: ['/v1/bridge/announcement'],
  queryFn: retrieveNotification
})
const message = computed(() => {
  if (messages.value == null) {
    return null
  }
  const { warning, notice } = messages.value
  if (warning != null && warning !== '') {
    return {
      type: 'warning',
      text: warning
    }
  }
  if (notice != null && notice !== '') {
    return {
      type: 'notice',
      text: notice
    }
  }
  return null
})

watch(marquee, async () => {
  await nextTick(() => {})
  const el = marquee.value
  if (!el) return
  const time = Math.floor(el.scrollWidth / 140)
  el.style.setProperty('--marquee-time', `${time}s`)
})
</script>

<template>
  <div
    v-if="message"
    class="flex justify-center items-center gap-[8px] px-[12px] py-[8px] rounded-md mx-[24px] md:mx-[48px] xl:mx-auto xl:max-w-[832px] xl:w-full"
    :class="{
      'bg-[#ff3300]/[0.3]': message.type === 'warning',
      'bg-[#88b099]/[0.3]': message.type === 'notice'
    }"
  >
    <p
      class="shrink-0 md:text-[18px]"
    >
      {{ message.type === 'warning' ? '🚨' : '🔔' }}
    </p>
    <div class="flex overflow-hidden">
      <p
        ref="marquee"
        class="app-notification__content text-nowrap"
        :data-text="message.text"
      >
        {{ message.text }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-notification {
  &__content {
    padding: 0 200px;
    animation: marquee var(--marquee-time) linear infinite;

    &::after {
      padding-left: 200px;
      content: attr(data-text);
    }
  }

  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      // calc logic: (400px - 200px - 100%) / 2
      transform: translateX(calc(-50% + 100px));
    }
  }
}
</style>
