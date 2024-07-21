<script setup lang="ts">
import { computed } from 'vue'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from 'oooo-components/ui/dropdown-menu'
import { Button } from 'oooo-components/ui/button'
import { formatHashWithEllipsis } from 'oooo-components/lib/utils'
import { WALLET, WALLET_CONFIG_MAP, WALLET_TYPE } from 'oooo-components/oooo-wallet'
import { useWallet } from '@/composables/hooks/use-wallet'
import { createFuncall } from 'vue-funcall'
import BybitWalletAlert from './BybitWalletAlert.vue'
import { WHITE_LIST } from '@/router'
import { useQuery } from '@tanstack/vue-query'
import { retrieveVoucherPacks } from '@/request/api/voucher'

const route = useRoute()
const router = useRouter()

const { name, address, walletType, onConnect, onLogout } = useWallet()

const isEthereumWallet = computed(() => address.value != null && walletType.value === WALLET_TYPE.ETHEREUM)
const { data: packs } = useQuery({
  queryKey: ['/voucher/pack/list', address],
  queryFn: async () => {
    return await retrieveVoucherPacks(address.value!)
  },
  enabled: isEthereumWallet
})
const hasAvailableVoucherPack = computed(() => packs.value ? packs.value.length > 0 : false)

const config = computed(() => name.value != null ? WALLET_CONFIG_MAP[name.value] : undefined)

const onClickLogout = () => {
  void onLogout()

  if (!WHITE_LIST.includes(route.name as string)) {
    void router.replace({ name: 'bridge' })
  }
}

const onClickOVoucher = () => {
  void router.push({
    name: 'o-voucher'
  })
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
        class="relative w-[196px] tracking-[1px] text-[#bce4cd] select-none"
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
        <div
          class="voucher-pack-hint"
          v-if="hasAvailableVoucherPack"
        >
          <img src="@/assets/images/redpack.gif">
          REWARD
        </div>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="px-0 py-[12px] border-none min-w-[var(--radix-popper-anchor-width)]">
      <DropdownMenuItem @click="onClickHistory">
        HISTORY
      </DropdownMenuItem>
      <DropdownMenuItem
        @click="onClickOVoucher"
        v-if="isEthereumWallet"
      >
        o-VOUCHER
        <span
          v-if="hasAvailableVoucherPack"
          class="ml-[6px] w-[10px] h-[10px] rounded-full bg-[#ff5402]"
        />
      </DropdownMenuItem>
      <DropdownMenuItem @click="onClickLogout">
        DISCONNECT
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style lang="scss" scoped>
.voucher-pack-hint {
  @apply absolute -top-[16px] -right-[8px] flex items-center gap-[2px] px-[4px] rounded-md text-[12px] -tracking-tighter font-[500] text-[#ff5300];
  background-image: linear-gradient(to bottom, #fff5c0, #ffd35d);

  > img {
    @apply w-[16px] h-[16px];
  }
}
</style>
