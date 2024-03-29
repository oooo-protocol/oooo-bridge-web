<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import { SelectTrigger } from 'radix-vue'
import { CHAIN_LIST } from '@/lib/constants'
import Icon from '@/components/Icon.vue'
import { type Chain } from '@/entities/bridge'

const props = defineProps<{
  list?: Chain[]
}>()
const SUPPORT_CHAIN_LIST = computed(() => {
  const supportChainName = (props.list ?? []).map(item => item.chainName)
  return CHAIN_LIST.filter(chain => supportChainName.includes(chain.value))
})
const model = defineModel<string>()
const selected = computed(() => {
  if (model.value != null) {
    return SUPPORT_CHAIN_LIST.value.find(chain => chain.value === model.value)
  }
  return undefined
})
const open = ref(false)
</script>

<template>
  <Select
    class="w-full"
    v-model="model"
    v-model:open="open"
  >
    <SelectTrigger as-child>
      <div class="flex items-center p-[8px] border border-input bg-background rounded-[2px]">
        <div
          class="flex items-center shrink-0 gap-[8px] pr-[15px] cursor-pointer"
          v-if="selected"
          @click="open = true"
        >
          <img
            class="w-[24px] h-[24px]"
            :src="selected.image"
          >
          <p class="xl:text-[19px]">
            {{ selected.name }}
          </p>
          <Icon
            name="a-arrowdown"
            class="text-[24px]"
          />
        </div>
        <slot name="suffix" />
      </div>
    </SelectTrigger>
    <SelectContent class="py-[12px]">
      <SelectItem
        class="flex gap-[8px]"
        :value="chain.value"
        v-for="chain of SUPPORT_CHAIN_LIST"
        :key="chain.value"
        :disabled="chain.disabled"
      >
        <img
          class="w-[24px] h-[24px]"
          :src="chain.image"
        >
        <p>{{ chain.name }}</p>
      </SelectItem>
    </SelectContent>
  </Select>
</template>
