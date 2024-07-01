<script setup lang="ts">
import Icon from 'oooo-components/ui/Icon.vue'
import WalletConnectButton from '../../components/WalletConnectButton.vue'
import { useEVMWallet } from 'oooo-components/oooo-wallet'

defineOptions({ name: 'TaskItem' })

defineProps<{
  icon?: string
  image?: string
  title?: string
  description?: string
  hint?: string
  succeed?: boolean
}>()

const { address } = useEVMWallet()
</script>

<template>
  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-[24px] md:gap-[40px] px-[16px] py-[26px] min-h-[110px] rounded-[2px] border border-[#28292a]">
    <div class="flex items-start md:items-center">
      <Icon
        v-if="icon"
        class="shrink-0 mr-[16px] text-[44px]"
        :name="icon"
      />
      <img
        v-if="image"
        class="shrink-0 mr-[16px] w-[44px]"
        :src="image"
      >
      <div class="text-[14px] font-medium -tracking-tighter">
        <slot name="title">
          {{ title }}
        </slot>
        <slot name="description">
          <p
            v-if="description"
            class="mt-[4px] text-[12px] font-light text-[#787878] tracking-[0.6px]"
          >
            {{ description }}
          </p>
        </slot>
        <p
          class="mt-[8px] text-[#abeec4]"
          v-if="hint"
        >
          {{ hint }}
        </p>
      </div>
    </div>
    <div class="shrink-0 flex flex-col justify-end gap-[8px]">
      <template
        v-if="address"
      >
        <Icon
          v-if="succeed"
          name="Finish"
          class="text-[22px] text-[#abeec4]"
        />
        <slot
          v-else
        />
      </template>
      <WalletConnectButton
        class="w-full md:w-[172px]"
        v-else
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
