<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel
} from 'oooo-components/ui/select'
import { SelectTrigger } from 'radix-vue'
import { CHAIN_LIST } from '@/lib/constants'
import Icon from 'oooo-components/ui/Icon.vue'
import { type Chain } from '@/entities/bridge'
import { cn } from 'oooo-components/lib/utils'
import { CHAIN } from '@/entities/chain'

const props = defineProps<{
  list?: Chain[]
}>()
const SUPPORT_CHAIN_LIST = computed(() => {
  const supportChainName = (props.list ?? []).map(item => item.chainName)
  return CHAIN_LIST.filter(chain => supportChainName.includes(chain.value))
})
const CHAIN_GROUP = computed(() => {
  const _map = SUPPORT_CHAIN_LIST.value.reduce<{
    chain: Array<typeof CHAIN_LIST[number]>
    cex: Array<typeof CHAIN_LIST[number]>
  }>((pre, cur) => {
    if (cur.value === CHAIN.BINANCE_CEX) {
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
      <SelectGroup
        v-for="group of CHAIN_GROUP"
        :key="group.label"
      >
        <SelectLabel>{{ group.label }}</SelectLabel>
        <SelectItem
          class="flex gap-[8px]"
          :value="chain.value"
          v-for="chain of group.children"
          :key="chain.value"
          :disabled="chain.disabled"
        >
          <img
            class="w-[24px] h-[24px]"
            :src="chain.image"
          >
          <p>{{ chain.name }}</p>
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
  <p
    class="oooo-bridge__error mt-[16px] flex items-center gap-[8px] font-[300] leading-[1.14] tracking-[0.88px] text-sm text-[#FF961E]"
    v-if="selected?.description"
  >
    <Icon
      class="shrink-0 text-[16px]"
      name="imp"
    />
    {{ selected.description }}
  </p>
</template>
