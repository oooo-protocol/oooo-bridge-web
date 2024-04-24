<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from 'oooo-components/ui/select'
import { TOKEN_LIST } from '@/lib/constants'

const model = defineModel<string>()

const selected = computed(() => {
  if (model.value != null) {
    return TOKEN_LIST.find(token => token.value === model.value)
  }
  return undefined
})
</script>

<template>
  <Select
    v-model="model"
  >
    <SelectTrigger class="w-auto">
      <div
        class="flex items-center gap-[8px] pr-[15px] select-none"
        v-if="selected"
      >
        <img
          class="w-[24px] h-[24px]"
          :src="selected.image"
        >
        <p>{{ selected.name }}</p>
      </div>
    </SelectTrigger>
    <SelectContent class="py-[12px]">
      <SelectItem
        class="flex gap-[8px]"
        :value="token.value"
        v-for="token of TOKEN_LIST"
        :key="token.value"
        :disabled="token.disabled"
      >
        <img
          class="w-[24px] h-[24px]"
          :src="token.image"
        >
        <p>{{ token.name }}</p>
      </SelectItem>
    </SelectContent>
  </Select>
</template>
