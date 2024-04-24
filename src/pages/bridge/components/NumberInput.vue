<script setup lang="ts">
import { formatNumber } from '@/lib/utils'
import Input from 'oooo-components/ui/input/Input.vue'

defineOptions({
  name: 'NumberInput'
})
const props = defineProps<{
  modelValue?: string | number
  decimal?: number
}>()

const emits = defineEmits<(e: 'update:modelValue', payload?: string | number) => void>()

const modelValue = ref(props.modelValue)

watch(() => props.modelValue, () => {
  modelValue.value = props.modelValue
})

watch(() => modelValue.value, (val) => {
  if (val !== undefined) {
    let number = formatNumber(val, true, false)
    if (props.decimal != null) {
      number = number.replace(new RegExp(`([0-9]+\\.[0-9]{0,${props.decimal}})(.*)`), '$1')
    }
    modelValue.value = number
  }
  emits('update:modelValue', modelValue.value)
}, {
  // 临时解决 v-model 值修改再通过 Watch 修改回去后导致 vue 认为 props modelValue 无变化阻止组件重渲染问题
  flush: 'post'
})
</script>

<template>
  <Input
    v-model="modelValue"
    v-bind="$attrs"
  />
</template>
