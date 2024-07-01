<script setup lang="ts">
import { computed } from 'vue'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from 'oooo-components/ui/dropdown-menu'
import { Button } from 'oooo-components/ui/button'
import { formatHashWithEllipsis } from 'oooo-components/lib/utils'
import { WALLET, WALLET_CONFIG_MAP } from 'oooo-components/oooo-wallet'
import { useWallet } from '@/composables/hooks/use-wallet'
import { createFuncall } from 'vue-funcall'
import BybitWalletAlert from './BybitWalletAlert.vue'
import { WHITE_LIST } from '@/router'

const route = useRoute()
const router = useRouter()

const { name, address, onConnect, onLogout } = useWallet()

const config = computed(() => name.value != null ? WALLET_CONFIG_MAP[name.value] : undefined)

const onClickLogout = () => {
  void onLogout()

  if (!WHITE_LIST.includes(route.name as string)) {
    void router.replace({ name: 'bridge' })
  }
}

const onClickHistory = () => {
  void router.push({
    name: 'bridge-history'
  })
}

watch(name, (name) => {
  if (name === WALLET.BYBIT || name === WALLET.BYBIT_BITCOIN) {
    createFuncall(BybitWalletAlert, {
      modelValue: true
    })
  }
})
</script>

<template>
  <Button
    class="w-[196px] tracking-[1px] text-[#bce4cd] select-none"
    variant="outline"
    @click="onConnect()"
    v-if="!config"
  >
    CONNECT WALLET
  </Button>
  <DropdownMenu v-else>
    <DropdownMenuTrigger as-child>
      <Button
        class="w-[196px] tracking-[1px] text-[#bce4cd] select-none"
        variant="outline"
      >
        <div
          class="flex items-center gap-[8px]"
        >
          <img
            class="w-[24px] h-[24px]"
            :src="config.image"
          >
          <p>{{ formatHashWithEllipsis(address!) }}</p>
        </div>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="px-0 py-[12px] border-none min-w-[var(--radix-popper-anchor-width)]">
      <DropdownMenuItem @click="onClickHistory">
        HISTORY
      </DropdownMenuItem>
      <DropdownMenuItem @click="onClickLogout">
        DISCONNECT
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style lang="scss" scoped>

</style>
