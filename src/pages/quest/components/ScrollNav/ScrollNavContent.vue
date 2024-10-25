<script setup lang="ts">
import { inject, ref } from 'vue'
import { ScrollNavProvide } from './type'

const provide = inject<ScrollNavProvide>('scroll-nav')

const props = defineProps<{
  name: string
}>()
const instance = ref<HTMLElement>()

if (provide == null) {
  throw new Error('[ScrollNav]: must be used in `ScrollNavProvide`')
}

const { bind } = provide

bind(props.name, instance)
</script>

<template>
  <div
    ref="instance"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>

</style>
