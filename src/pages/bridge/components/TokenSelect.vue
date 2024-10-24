<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from 'oooo-components/ui/select'
import { type Token } from '@/entities/bridge'

const model = defineModel<string>()

const props = defineProps<{
  list: Token[]
}>()

const selected = computed(() => {
  if (model.value != null) {
    return props.list.find(token => token.tokenName === model.value)
  }
  return undefined
})

</script>

<template>
  <Select
    v-model="model"
  >
    <SelectTrigger class="shrink-0 w-auto px-[8px] py-[4px]">
      <div
        class="flex items-center gap-[8px] pr-[15px] select-none"
        v-if="selected"
      >
        <img
          class="w-[24px] h-[24px]"
          :src="selected.icon"
        >
        <p>{{ selected.assetCode }}</p>
      </div>
    </SelectTrigger>
    <SelectContent class="py-[12px]">
      <SelectItem
        class="flex gap-[8px]"
        :value="token.tokenName"
        v-for="token of props.list"
        :key="token.tokenName"
      >
        <img
          class="w-[24px] h-[24px]"
          :src="token.icon"
        >
        <p>{{ token.assetCode }}</p>
      </SelectItem>
    </SelectContent>
  </Select>
</template>
