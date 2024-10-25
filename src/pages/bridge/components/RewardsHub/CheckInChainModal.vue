<script setup lang="ts">
import DialogPro from '@/components/DialogPro.vue'
import { useCreatePointConfetti } from '@/composables/hooks/use-create-point-confetti'
import { type CHAIN } from '@/entities/chain'
import { CHECK_IN_STATUS, type CheckInChain } from '@/entities/quest'
import { CHAIN_CONFIG_MAP } from '@/lib/constants'
import { formatEtherError } from '@/lib/utils'
import { checkIn, retireveCheckInChainList, retrieveCheckInDays } from '@/request/api/quest'
import useSignatureStore from '@/store/signature'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ethers, type EthersError } from 'ethers'
import { useEVMWallet } from 'oooo-components/oooo-wallet'
import Icon from 'oooo-components/ui/Icon.vue'
import { Input } from 'oooo-components/ui/input'
import { useToast } from 'oooo-components/ui/toast'

const { address, getWalletInstance } = useEVMWallet()
const createPointConfetti = useCreatePointConfetti()
const { toast } = useToast()
const signature = useSignatureStore()
const queryClient = useQueryClient()

const open = defineModel<boolean>()

const search = ref<string>()

const { data } = useQuery({
  queryKey: ['/gem/checkin/chain/list'],
  queryFn: retireveCheckInChainList
})

const list = computed(() => {
  if (data.value == null) return undefined
  let filterList = data.value
  if (search.value != null && search.value.length > 0) {
    filterList = filterList.filter(item => item.showName.toUpperCase().includes((search.value ?? '').toUpperCase()))
  }
  return filterList
})

const { isPending: loading, mutate } = useMutation({
  mutationFn: async () => {
    const { lists } = await retrieveCheckInDays({ walletAddress: address.value })
    const today = lists[3]
    const status = today.status
    if (status !== CHECK_IN_STATUS.CHECKED) {
      throw new Error('Today checking status is not update')
    }
    return today
  },
  onSuccess (data) {
    createPointConfetti(`GET ${data.gemAmount} GEM`)
    open.value = false
    void queryClient.invalidateQueries({
      queryKey: ['/gem/checkin/daily', address]
    })
    void queryClient.invalidateQueries({
      queryKey: ['/point/account', address]
    })
  },
  onError (e) {
    toast({
      description: e.message
    })
  },
  retry: true,
  retryDelay: 2 * 1000
})

const CONTRACT_ABI = [
  {
    inputs: [
      {
        name: 'date',
        type: 'uint256'
      }
    ],
    name: 'checkIn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
]

const checking = ref(false)

const onCheckIn = async (item: CheckInChain) => {
  console.log('start checkin: ', performance.now())
  const instance = getWalletInstance()
  const config = CHAIN_CONFIG_MAP[item.chainName as CHAIN]
  if (config == null) throw new Error(`Chain ${item.chainName} not config`)
  console.log('before switch chain: ', performance.now())
  await instance.switchToChain(config)
  console.log('after switch chain: ', performance.now())
  const provider = new ethers.BrowserProvider(instance.provider)

  try {
    checking.value = true
    console.log('before signature: ', performance.now())
    const signInfo = await signature.getSignInfo()
    console.log('after signature: ', performance.now())
    console.log('before get signer: ', performance.now())
    const signer = await provider.getSigner()
    console.log('after get signer: ', performance.now())
    const contract = new ethers.Contract(item.contractAddress, CONTRACT_ABI, signer)
    const date = +new Date()
    console.log('before checkIn: ', performance.now())
    const { hash } = await contract.checkIn(date)
    console.log('after checkIn: ', performance.now())
    await checkIn({
      ...signInfo,
      chainName: item.chainName,
      txnHash: hash
    })
    mutate()
  } catch (e) {
    console.log('error time: ', performance.now())
    const message = formatEtherError(e as EthersError).message
    toast({
      description: message
    })
  } finally {
    checking.value = false
    provider.destroy()
  }
}
</script>

<template>
  <DialogPro
    v-model:open="open"
    title="_ DAILY CHECK-IN"
    header-close
  >
    <template #content>
      <div
        v-if="checking"
        class="flex flex-col items-center py-[40px] md:py-[60px]"
      >
        <img
          class="h-[180px]"
          src="@/assets/images/transfer-loading.dark.gif"
        >
        <p class="mt-[40px] text-[#bce4cd] -tracking-tighter">
          CHECK-IN PROGRESSING
        </p>
        <p class="mt-[8px] text-[14px] text-[#a4a4a4] -tracking-tighter">
          REQUIRES YOUR OPERATION IN THE WALLET
        </p>
      </div>
      <div
        v-else-if="loading"
        class="flex flex-col items-center py-[40px] md:py-[60px]"
      >
        <img
          class="h-[180px]"
          src="@/assets/images/transfer-loading.dark.gif"
        >
        <p class="mt-[40px] text-[#bce4cd] -tracking-tighter">
          CONFIRMING CHECK-IN STATUS
        </p>
        <p class="mt-[8px] text-[14px] text-[#a4a4a4] -tracking-tighter">
          WAITING FOR THE TRANSACTION TO CONFIRM
        </p>
      </div>
      <div
        v-else
        class="flex-1 h-0 flex flex-col px-[16px] py-[24px] md:px-[40px] md:py-[32px]"
      >
        <p class="text-[14px] -tracking-tighter">
          CHOOSE CHAIN
        </p>
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
        <div class="flex-1 h-0 py-[16px] overflow-y-auto">
          <div
            v-if="list"
            v-for="item of list"
            :key="item.chainName"
            class="flex items-center gap-[8px] p-[8px] hover:bg-[#3c4840] transition-colors cursor-pointer"
            @click="onCheckIn(item)"
          >
            <img
              class="w-[24px] h-[24px]"
              :src="item.icon"
            >
            <p class="-tracking-tighter">
              {{ item.showName }}
            </p>
          </div>
          <p
            v-if="list == null || list.length === 0"
            class="text-center text-[#616161]"
          >
            NONE
          </p>
        </div>
      </div>
    </template>
  </DialogPro>
</template>

<style lang="scss" scoped>

</style>
