<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import Icon from '@/components/Icon.vue'
import { cn } from '@/lib/utils'
import { CHAIN } from '@/entities/chain'
import { CHAIN_IMAGE_MAP } from '@/lib/constants'
import ChainSelectItem from './ChainSelectItem.vue'
import { type Chain } from '@/entities/bridge'
import { SERVER_CHAIN_TYPE } from '@/entities/server'
import LoadingIcon from '@/components/LoadingIcon.vue'

const props = defineProps<{
  list: Chain[]
  loading?: boolean
}>()
const enum TAB {
  ALL = 'tab_all',
  BITCOIN = SERVER_CHAIN_TYPE.BITCOIN_L2,
  ETHEREUM = SERVER_CHAIN_TYPE.ETHEREUM_L2,
  CEX = SERVER_CHAIN_TYPE.CEX,
  APTOS = SERVER_CHAIN_TYPE.APTOS
}
const tabs = [
  {
    label: 'ALL',
    value: TAB.ALL
  }, {
    label: 'BITCOIN & L2',
    value: TAB.BITCOIN
  }, {
    label: 'ETHEREUM & L2',
    value: TAB.ETHEREUM
  }, {
    label: 'CEX',
    value: TAB.CEX
  }, {
    label: 'APTOS',
    value: TAB.APTOS
  }
]
const currentTab = ref<TAB>(TAB.ALL)

const list = computed(() => {
  let filterList = props.list
  if (search.value != null && search.value.length > 0) {
    filterList = filterList.filter(item => item.showName.toUpperCase().includes((search.value ?? '').toUpperCase()))
  }
  if (currentTab.value !== TAB.ALL) {
    filterList = filterList.filter(item => item.type === (currentTab.value as unknown as SERVER_CHAIN_TYPE))
  }
  return filterList
})
const CHAIN_GROUP = computed(() => {
  const _map = list.value.reduce<{
    chain: Chain[]
    cex: Chain[]
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
const search = ref<string>()

const onChainClick = (chain: Chain) => {
  model.value = chain.chainName
  open.value = false
}
</script>

<template>
  <div
    :class="cn('flex items-center p-[8px] border border-input bg-background rounded-[2px]', $attrs.class ?? '')"
  >
    <LoadingIcon
      class="my-[4px]"
      v-if="loading"
    />
    <template v-else>
      <div
        class="flex items-center shrink-0 gap-[8px] pr-[15px] cursor-pointer"
        v-if="selected"
        @click="open = true"
      >
        <img
          class="w-[32px] h-[32px]"
          :src="CHAIN_IMAGE_MAP[selected.chainName as CHAIN]"
        >
        <p>
          {{ selected.showName }}
        </p>
        <Icon
          name="a-arrowdown"
          class="text-[24px]"
        />
      </div>
    </template>
    <slot name="suffix" />
    <Dialog v-model:open="open">
      <DialogContent
        class="h-[80%]"
        @pointer-down-outside.prevent
        @escape-key-down.prevent
      >
        <template #header>
          <DialogHeader>
            <DialogTitle>_ SELECT A CHAIN</DialogTitle>
          </DialogHeader>
        </template>
        <template #content>
          <div class="flex-1 h-0 flex flex-col px-[16px] py-[24px] md:px-[40px] md:py-[32px]">
            <div class="flex items-center gap-[20px] border-b border-[#bce4cd]/0.6 overflow-x-auto">
              <p
                class="py-[8px] cursor-pointer text-nowrap"
                :class="currentTab === tab.value ? 'text-[#bce4cd]' : 'text-[#616161]'"
                v-for="tab of tabs"
                :key="tab.value"
                @click="currentTab = tab.value"
              >
                {{ tab.label }}
              </p>
            </div>
            <div class="mt-[16px] relative w-full items-center">
              <Input
                placeholder="SEARCH"
                class="pl-10"
                v-model="search"
              />
              <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                <Icon
                  class="size-6 text-muted-foreground"
                  name="search"
                />
              </span>
            </div>
            <div class="flex-1 h-0 py-[32px] overflow-y-auto">
              <template
                v-for="group of CHAIN_GROUP"
                :key="group.label"
              >
                <div
                  class=""
                  v-if="group.children.length > 0"
                >
                  <p>{{ group.label }}</p>
                  <div class="">
                    <ChainSelectItem
                      class="mt-[8px]"
                      v-for="item of group.children"
                      :key="item.chainName"
                      :chain="item"
                      @click="onChainClick(item)"
                    />
                  </div>
                </div>
              </template>
              <p
                v-if="list.length === 0"
                class="text-center text-[#616161]"
              >
                NONE
              </p>
            </div>
          </div>
        </template>
      </DialogContent>
    </Dialog>
  </div>
</template>
