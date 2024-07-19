<script setup lang="ts">
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from 'oooo-components/ui/carousel'
import { Button } from 'oooo-components/ui/button'
import Icon from 'oooo-components/ui/Icon.vue'
import { createFuncall } from 'vue-funcall'
import EnterOVoucherModal from './EnterOVoucherModal.vue'
import { useEVMWallet } from 'oooo-components/oooo-wallet'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { retrieveVoucherPacks, claimVoucherPack, checkVoucherPackIsClaimed } from '@/request/api/voucher'
import OVoucherPackPlaceholder from './OVoucherPackPlaceholder.vue'
import PageLoading from '@/components/PageLoading.vue'
import dayjs from 'dayjs'
import { ethers } from 'ethers'
import { useToast } from 'oooo-components/ui/toast'
import { type VoucherPackClaimConfig, type VoucherPack } from '@/entities/voucher'
import { CHAIN_CONFIG_MAP } from '@/lib/constants'
import { type CHAIN } from '@/entities/chain'
import useSignatureStore from '@/store/signature'
import { timeout } from '@/lib/utils'
import OVoucherPackDescriptionModal from './OVoucherPackDescriptionModal.vue'

const { address, getWalletInstance } = useEVMWallet()
const { toast } = useToast()
const queryClient = useQueryClient()
const signature = useSignatureStore()

const CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'eventName',
        type: 'string'
      }
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
]

const { isPending: loading, data: packs } = useQuery({
  queryKey: ['/voucher/pack/list', address],
  queryFn: async () => await retrieveVoucherPacks(address.value!)
})
const claiming = ref(false)

const activePackId = ref<number>()
const carouselApi = ref<CarouselApi>()

watch(activePackId, (id) => {
  if (packs.value == null) return
  const index = packs.value.findIndex((pack) => pack.packRecordId === id)
  if (index > -1) {
    carouselApi.value?.scrollTo(index)
  }
})
watch(packs, (packs) => {
  if (packs == null) return
  if (packs.length > 0) {
    activePackId.value = packs[0].packRecordId
  }
}, {
  immediate: true
})

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY/MM/DD HH:mm')
}

const onChainClaim = async (claimConfig: VoucherPackClaimConfig) => {
  const instance = getWalletInstance()
  const provider = new ethers.BrowserProvider(instance.provider)
  try {
    const CHAIN_CONFIG = CHAIN_CONFIG_MAP[claimConfig.claimChainName as CHAIN]
    if (CHAIN_CONFIG == null) throw new Error(`Chain ${claimConfig.claimChainName} not config`)
    await instance.switchToChain(CHAIN_CONFIG)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(claimConfig.contractAddress, CONTRACT_ABI, signer)
    const gasPrice = (await provider.getFeeData()).gasPrice
    const gas = await contract.claim.estimateGas('o-voucher')
    const { hash } = await contract.claim('o-voucher', {
      gasPrice,
      gasLimit: gas
    })
    return hash
  } finally {
    provider.destroy()
  }
}

const checkIsClaimed = async (packRecordId: number) => {
  let claimed = false
  const timestamp = +new Date()
  while (!claimed) {
    claimed = await checkVoucherPackIsClaimed({
      ...signature.signInfo!,
      packRecordId
    })
    if (!claimed) {
      const interval = +new Date() - timestamp
      // if response still return false after 3 minutes, then not request anymore;
      if (interval > 3 * 60 * 1000) {
        claimed = true
      } else {
        await timeout(3000)
      }
    }
  }
}

const onClaim = async () => {
  try {
    const selectedPack = packs.value?.find((pack) => pack.packRecordId === activePackId.value)
    if (selectedPack == null) return
    claiming.value = true
    let hash: string | undefined
    if (selectedPack.claimConfig != null) {
      hash = await onChainClaim(selectedPack.claimConfig)
    }
    const succeed = await claimVoucherPack({
      ...signature.signInfo!,
      claimTxnHash: hash,
      packRecordId: selectedPack.packRecordId
    })
    if (succeed) {
      await checkIsClaimed(selectedPack.packRecordId)
      queryClient.setQueryData(
        ['/voucher/pack/list', address],
        (old: VoucherPack[]) => old.filter((pack) => pack.packRecordId !== selectedPack.packRecordId)
      )
      void queryClient.invalidateQueries({ queryKey: ['/voucher/record/list'] })
    }
  } catch (e) {
    toast({
      description: (e as Error).message
    })
  } finally {
    claiming.value = false
  }
}

const onClickEnter = () => {
  createFuncall(EnterOVoucherModal, {
    modelValue: true
  })
}

const onClickDescription = (description: string) => {
  createFuncall(OVoucherPackDescriptionModal, {
    modelValue: true,
    description
  })
}
</script>

<template>
  <div>
    <PageLoading v-if="loading" />
    <OVoucherPackPlaceholder
      class="flex-col mx-auto text-center"
      v-else-if="!packs"
    >
      <p class="text-[14px] md:text-[16px] font-[500]">
        NO o-VOUCHER TO CALIM
      </p>
      <p class="mt-[8px] text-[12px]">
        YOU CAN ENTER THE o-VOUCHER CODE OR FOLLOW
        <a
          href="https://discord.com/invite/ooooprotocol"
          target="_blank"
        >
          <Icon
            class="inline text-[16px]"
            name="issue1"
          />
        </a>
        <a
          href="https://twitter.com/oooo_money"
          target="_blank"
        >
          <Icon
            class="ml-[8px] inline text-[16px]"
            name="issuebeifen"
          />
        </a>
        AND PARTICIPATE IN EVENTS TO GET.
      </p>
    </OVoucherPackPlaceholder>
    <Carousel
      @init-api="(val) => carouselApi = val"
      v-slot="{ scrollPrev, scrollNext }"
      class="md:px-[28px]"
      v-else
    >
      <CarouselContent>
        <CarouselItem
          v-for="pack in packs"
          :key="pack.packRecordId"
          class="basis-auto select-none"
        >
          <div
            class="o-voucher-pack flex flex-col"
            :class="{
              'o-voucher-pack--active': activePackId === pack.packRecordId
            }"
            @click="activePackId = pack.packRecordId"
          >
            <p class="text-[28px] md:text-[32px] font-[500] -tracking-tighter">
              {{ pack.title }}
            </p>
            <p class="text-[14px] md:text-[16px] font-[500] -tracking-tighter">
              o-VOUCHER PACK
            </p>
            <div class="mt-[16px] md:mt-[42px] flex justify-between items-end text-[10px]">
              <div>
                <p>CLAIM DURING</p>
                <p class="w-[160px] md:w-full">
                  {{ formatDate(pack.startTime) }} - {{ formatDate(pack.endTime) }}
                </p>
              </div>
              <Icon
                class="text-[18px] text-[#616161]"
                name="issue"
                @click="onClickDescription(pack.description)"
              />
            </div>
          </div>
        </CarouselItem>
      </CarouselContent>
      <Icon
        class="hidden md:block absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer text-[40px]"
        name="a-arrowleft"
        @click="scrollPrev"
      />
      <Icon
        class="hidden md:block absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 cursor-pointer text-[40px]"
        name="a-arrowleftbeifen"
        @click="scrollNext"
      />
    </Carousel>
    <div class="mt-[40px] flex flex-col items-center">
      <Button
        variant="outline"
        class="w-full md:w-[240px]"
        :disabled="activePackId == null"
        @click="onClaim"
        :loading="claiming"
      >
        {{ claiming ? 'CLAIM IN PROGRESS.' : 'CLAIM' }}
      </Button>
      <p
        class="mt-[16px] text-[14px] -tracking-tighter cursor-pointer underline"
        @click="onClickEnter"
      >
        ENTER o-VOUCHER CODE
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.o-voucher-pack {
  @apply mt-[8px] w-[220px] md:w-[310px] p-[16px] pr-[10px] bg-[#e4e7e5] rounded-md text-[#000000]/[0.85] cursor-pointer;
  box-shadow: 0 -16px 0 -8px #8b8b8b;
  transition: all 0.2s ease-in-out;

  &--active {
    @apply bg-[#bce4cd];
    box-shadow: 0 -16px 0 -8px #677d70;
  }
}
</style>
