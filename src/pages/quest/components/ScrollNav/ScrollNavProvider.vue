<script setup lang="ts">
import { Ref, onMounted, onUnmounted, provide, ref } from 'vue'
import { ScrollNavProvide } from './type'

const props = withDefaults(defineProps<{
  defaultValue: string
  target: string
}>(), {
  target: 'body'
})

const current = ref<string>(props.defaultValue)
const refs: Record<string, Ref<HTMLElement | undefined>> = {}
const lock = ref(false)

const updateCurrent = (name: string) => {
  current.value = name
  const el = refs[name].value
  if (!el) {
    throw new Error(`[ScrollNav]: Element ${name} is undefined`)
  }

  const target = document.querySelector(props.target)!

  target.scrollTo({
    top: el.offsetTop,
    behavior: 'smooth'
  })
  lock.value = true
}

const bind = (name: string, ref: Ref<HTMLElement | undefined>) => {
  refs[name] = ref
}

provide<ScrollNavProvide<string>>('scroll-nav', {
  current,
  updateCurrent,
  bind
})

const scroll = (event: Event) => {
  if (lock.value) return

  const scrollTop = (event.target as HTMLElement).scrollTop

  for (const name in refs) {
    const el = refs[name].value
    if (!el) continue
    if (el.offsetTop <= scrollTop) {
      current.value = name
    }
  }
}

const scrollEnd = () => {
  lock.value = false
}

onMounted(() => {
  const target = document.querySelector(props.target)
  if (!target) {
    throw new Error(`[ScrollNav]: detect element ${props.target} not exist`)
  }
  target.addEventListener('scroll', scroll)
  target.addEventListener('scrollend', scrollEnd)
})

onUnmounted(() => {
  const target = document.querySelector(props.target)
  if (!target) {
    throw new Error(`[ScrollNav]: detect element ${props.target} not exist`)
  }
  target.removeEventListener('scroll', scroll)
  target.removeEventListener('scrollend', scrollEnd)
})
</script>

<template>
  <slot :current="current" />
</template>
