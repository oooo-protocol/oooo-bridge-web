<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useWallet } from '@/composables/hooks/use-wallet'
import CountdownTimer from './components/CountdownTimer.vue'
import AirdropResultModal from './components/AirdropResultModal.vue'
import { Button } from '@/components/ui/button'

import { getAirdropEligibility, type AirdropEligibility } from '@/request/api/airdrop'

const { address, onConnect } = useWallet()

const countdownEndTime = Date.now() + 30 * 24 * 60 * 60 * 1000

const walletAddressInput = ref('')
const showResultModal = ref(false)
const checkLoading = ref(false)
const airdropResult = ref<AirdropEligibility | null>(null)

// Sync wallet address when connected
watchEffect(() => {
  if (address.value != null) {
    walletAddressInput.value = address.value
  }
})

const handleCheck = async () => {
  if (!walletAddressInput.value) return

  try {
    checkLoading.value = true
    const res = await getAirdropEligibility(walletAddressInput.value)
    airdropResult.value = res
    showResultModal.value = true
  } catch (e) {
    console.error(e)
  } finally {
    checkLoading.value = false
  }
}
</script>

<template>
  <div class="airdrop-page">
    <!-- Background -->
    <div class="airdrop-page__header flex justify-center items-center h-[520px]">
      <h1 class="text-4xl md:text-[64px]">
        Claim Your <span class="md:text-[128px] font-semibold">$oooo</span>
      </h1>
    </div>

    <div class="py-[60px] px-4 max-w-[1000px] mx-auto">
      <!-- Countdown -->
      <div class="mb-[60px]">
        <p class="text-lg md:text-[32px] mb-6 md:mb-10">
          CLAIMING STARTS IN
        </p>
        <CountdownTimer :time="countdownEndTime" />
      </div>

      <!-- Check Airdrop -->
      <h2 class="text-2xl md:text-[32px] font-medium mb-1">
        CHECK YOUR AIRDROP
      </h2>
      <p class="max-w-[666px] text-[#9e9e9e] mb-6 md:mb-4 text-sm md:text-base ">
        This check verifies your connected wallet address and returns your airdrop availability.
      </p>

      <div class="bg-[#121314] p-6 md:p-10 border-[0.5px] border-[#28292a] rounded-[3px]">
        <label class="block text-xs md:text-base text-[#a4a4a4] mb-2">WALLET ADDRESS</label>
        <div class="flex items-center gap-5 mb-4">
          <input
            v-model="walletAddressInput"
            type="text"
            placeholder="0X... WALLET ADDRESS (AUTO-FILLED AFTER CONNECT)"
            class="flex-1 bg-[#212322] rounded-[2px] px-3 h-10 text-sm outline-none placeholder-[#616161] border-[0.5px] border-[#5a6960]"
            :disabled="!!address"
          >
          <Button
            v-if="!address"
            @click="onConnect()"
          >
            CONNECT WALLET
          </Button>
        </div>

        <p class="max-w-[730px] text-xs md:text-base text-[#616161] mb-6">
          Use the same wallet you used for Bridge / Quest activity. Only EVM addresses are supported.
        </p>

        <Button
          @click="handleCheck"
          :loading="checkLoading"
          variant="outline"
          class="w-[240px] bg-[rgba(188,228,205,0.2)] text-[#fff]/50"
        >
          CHECK
        </Button>
      </div>
    </div>

    <AirdropResultModal
      v-model:open="showResultModal"
      :data="airdropResult"
    />
  </div>
</template>

<style scoped lang="scss">
.airdrop-page {
   &__header {
      background: url('@/assets/images/airdrop/background.png') no-repeat center / cover;
   }
}
</style>
