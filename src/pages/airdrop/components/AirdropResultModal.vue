<script setup lang="ts">
import { Button } from '@/components/ui/button'
import DialogPro from '@/components/DialogPro.vue'
import Icon from '@/components/Icon.vue'
import type { AirdropEligibility } from '@/request/api/airdrop'

defineProps<{
  data: AirdropEligibility | null
}>()

const open = defineModel<boolean>('open')

const handleClose = () => {
  open.value = false
}
</script>

<template>
  <DialogPro
    v-model:open="open"
    header-close
  >
    <div class="result-modal">
      <div class="result-modal__header mb-[35px]">
        <h3 class="text-[21px] uppercase">
          Airdrop Results
        </h3>
        <div class="h-[1px] bg-[#404943] mt-2 w-full" />
      </div>

      <!-- Wallet Address -->
      <div class="flex justify-between items-start">
        <span class="text-[#a4a4a4] uppercase">Wallet Address</span>
        <span class="text-white font-mono text-xs sm:text-base text-right break-all max-w-[60%]">
          {{ data?.walletAddress || 'N/A' }}
        </span>
      </div>

      <!-- Airdrop Amount -->
      <div class="mt-4 flex justify-between items-start">
        <span class="text-[#a4a4a4] text-base uppercase">Airdrop Amount</span>
        <span class="text-white font-mono text-sm sm:text-base">
          {{ data?.airdropAmount ?? '-' }} $oooo
        </span>
      </div>

      <!-- Warning/Info Messages -->
      <div class="mt-4 flex items-center gap-2">
        <Icon
          class="text-[#ff5402]"
          name="imp"
        />
        <span class="text-[#ff961e] text-sm">
          No airdrop available for this address.
        </span>
      </div>

      <!-- Close Button -->
      <div class="mt-6 flex justify-center">
        <Button
          @click="handleClose"
          class="w-full max-w-[240px]"
        >
          CLOSE
        </Button>
      </div>
    </div>
  </DialogPro>
</template>

<style scoped>
</style>
