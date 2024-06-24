<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel
} from 'oooo-components/ui/select'
import { SelectTrigger } from 'radix-vue'
import Icon from 'oooo-components/ui/Icon.vue'
import { type ServerChain } from '@/entities/server'
import { cn } from 'oooo-components/lib/utils'
import { CHAIN } from '@/entities/chain'
import { CHAIN_IMAGE_MAP } from '@/lib/constants'

const props = defineProps<{
  list: ServerChain[]
}>()
const CHAIN_GROUP = computed(() => {
  const _map = props.list.reduce<{
    chain: ServerChain[]
    cex: ServerChain[]
  }>((pre, cur) => {
    if ([CHAIN.BINANCE_PAY, CHAIN.BINANCE_CEX].includes(cur.chainName as CHAIN)) {
      pre.cex.push(cur)
    } else {
      pre.chain.push(cur)
    }
    return pre
  }, {
    chain: [],
    cex: []
  })
  const group = []
  if (_map.chain.length > 0) {
    group.push({
      label: '_ CHAIN',
      children: _map.chain
    })
  }
  if (_map.cex.length > 0) {
    group.push({
      label: '_ CEX',
      children: _map.cex
    })
  }
  return group
})
const model = defineModel<string>()
const selected = computed(() => {
  if (model.value != null) {
    return props.list.find(chain => chain.chainName === model.value)
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
    v-bind="$attrs"
  >
    <SelectTrigger as-child>
      <div
        :class="cn('flex items-center p-[8px] border border-input bg-background rounded-[2px]', $attrs.class ?? '')"
      >
        <div
          class="flex items-center shrink-0 gap-[8px] pr-[15px] cursor-pointer"
          v-if="selected"
          @click="open = true"
        >
          <img
            class="w-[32px] h-[32px]"
            :src="CHAIN_IMAGE_MAP[selected.chainName as CHAIN]"
          >
          <p class="xl:text-[19px]">
            {{ selected.showName }}
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
      <SelectGroup
        v-for="group of CHAIN_GROUP"
        :key="group.label"
      >
        <SelectLabel>{{ group.label }}</SelectLabel>
        <SelectItem
          class="flex gap-[8px]"
          :value="chain.chainName"
          v-for="chain of group.children"
          :key="chain.chainName"
        >
          <img
            class="w-[24px] h-[24px]"
            :src="CHAIN_IMAGE_MAP[chain.chainName as CHAIN]"
          >
          <p>{{ chain.showName }}</p>
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
