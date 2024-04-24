<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from 'oooo-components/ui/dropdown-menu'
import { Button } from 'oooo-components/ui/button'
import { CHAIN_LIST, WALLET_MAP } from '@/lib/constants'
import Icon from 'oooo-components/ui/Icon.vue'
import { useWallet } from '@/composables/hooks/use-wallet'
import { formatHashWithEllipsis } from 'oooo-components/lib/utils'
import WalletConnectModal from '@/components/wallet-connect/WalletConnectModal.vue'
import { createFunctionCall } from '../wallet-connect/function-call'
import { type CHAIN } from '@/entities/chain'

const route = useRoute()
const router = useRouter()
const { wallet, onLogout } = useWallet()

const onConnect = async (chain: CHAIN) => {
  createFunctionCall(WalletConnectModal, {
    chain
  })
}

const onClickHistory = () => {
  void router.push({
    name: 'bridge-history'
  })
}

const onClickLogout = () => {
  void onLogout()
  if (route.name !== 'bridge') {
    void router.replace({ name: 'bridge' })
  }
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        class="w-[196px] tracking-[1px] text-[#bce4cd] select-none"
        variant="outline"
      >
        <div
          class="flex items-center gap-[8px]"
          v-if="wallet"
        >
          <img
            class="w-[24px] h-[24px]"
            :src="WALLET_MAP[wallet.name].image"
          >
          <p>{{ formatHashWithEllipsis(wallet.address) }}</p>
          <Icon
            class="text-[24px]"
            name="a-arrowdown"
          />
        </div>
        <template v-else>
          CONNECT WALLET
        </template>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="px-0 py-[12px] border-none min-w-[var(--radix-popper-anchor-width)]">
      <!-- Wallet connected -->
      <template v-if="wallet">
        <DropdownMenuItem @click="onClickHistory">
          HISTORY
        </DropdownMenuItem>
        <DropdownMenuItem @click="onClickLogout">
          DISCONNECT
        </DropdownMenuItem>
      </template>
      <!-- Wallet disconnect -->
      <template
        v-else
        v-for="item of CHAIN_LIST"
      >
        <DropdownMenuItem
          class="flex items-center gap-[8px]"
          v-if="!item.disabled && !item.hide"
          :key="item.value"
          @click="onConnect(item.value)"
        >
          <img
            class="w-[24px] h-[24px]"
            :src="item.image"
          >
          {{ item.name }}
        </DropdownMenuItem>
      </template>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
