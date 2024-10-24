<script setup lang="ts">
import { inject } from 'vue'
import { ScrollNavProvide } from './type'

const provide = inject<ScrollNavProvide>('scroll-nav')

const props = defineProps<{
  name: string
}>()

if (provide == null) {
  throw new Error('[ScrollNav]: must be used in `ScrollNavProvide`')
}

const { current, updateCurrent } = provide
</script>

<template>
  <div
    v-bind="$attrs"
    @click="updateCurrent(props.name)"
  >
    <slot :current="current" />
  </div>
</template>

<style lang="scss" scoped>

</style>
