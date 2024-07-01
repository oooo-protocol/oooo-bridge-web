<script setup lang="ts">
import B2_HONEY_IMAGE from '@/assets/images/goooo-points/b2.png'
import { useEVMWallet } from 'oooo-components/oooo-wallet'
import { ethers } from 'ethers'
import TaskItem from '../TaskItem.vue'
import { Button } from 'oooo-components/ui/button'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { useCreatePointConfetti } from '@/pages/goooo-points/hooks/use-create-point-confetti'
import { NETWORK } from '@/entities/chain'
import { useToast } from 'oooo-components/ui/toast'

const createPointConfetti = useCreatePointConfetti()

const { address, getWalletInstance } = useEVMWallet()
const queryClient = useQueryClient()

const { toast } = useToast()

const isChecking = ref(false)

const loading = ref(false)

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

const config = import.meta.env.VITE_NETWORK === NETWORK.LIVENET
  ? {
    CONTRACT_ADDRESS: '0xCC5AA43f4Ef7A48f95b54e0f1C53265b5b3e862A',
    CHAIN_CONFIG: {
      chainId: '0xdf',
      chainName: 'B2 Mainnet',
      rpcUrls: ['https://rpc.bsquared.network', 'https://b2-mainnet.alt.technology'],
      nativeCurrency: {
        name: 'BTC',
        symbol: 'BTC',
        decimals: 18
      },
      blockExplorerUrls: ['https://explorer.bsquared.network/']
    },
    RPC: 'https://rpc.bsquared.network'
  }
  : {
    CONTRACT_ADDRESS: '0xD612AD3Cc001950822f1b6701AFA282cC0bE7141',
    CHAIN_CONFIG: {
      chainId: '0x463',
      chainName: 'B2 Testnet',
      rpcUrls: ['https://b2-testnet.alt.technology'],
      nativeCurrency: {
        name: 'BTC',
        symbol: 'BTC',
        decimals: 18
      },
      blockExplorerUrls: ['https://testnet-explorer.bsquared.network']
    },
    RPC: 'https://b2-testnet.alt.technology'
  }

const onMint = async () => {
  loading.value = true
  const instance = getWalletInstance()
  const provider = new ethers.BrowserProvider(instance.provider)
  try {
    await instance.switchToChain(config.CHAIN_CONFIG)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(config.CONTRACT_ADDRESS, CONTRACT_ABI, signer)
    const gasPrice = (await provider.getFeeData()).gasPrice
    const gas = await contract.claim.estimateGas('B2_buzz')
    const hash: string = await contract.claim('B2_buzz', {
      gasPrice,
      gasLimit: gas
    })
    if (hash) {
      createPointConfetti('CLAIMED')
      queryClient.setQueryData(
        ['checkIsMinted', address],
        true
      )
    }
  } catch (e) {
    toast({
      description: (e as Error).message
    })
  } finally {
    loading.value = false
    provider.destroy()
  }
}

const checkIsMinted = async () => {
  if (address.value == null) return
  try {
    isChecking.value = true
    const jsonRpcProvider = new ethers.JsonRpcProvider(config.RPC)
    const logs = await jsonRpcProvider.getLogs({
      fromBlock: 'earliest',
      toBlock: 'latest',
      address: config.CONTRACT_ADDRESS,
      topics: [
        null,
        ethers.zeroPadValue(address.value, 32)
      ]
    })
    return logs.length > 0
  } finally {
    isChecking.value = false
  }
}

const enabled = computed(() => address.value !== undefined)
const { data: isMinted } = useQuery({
  queryKey: ['checkIsMinted', address],
  queryFn: checkIsMinted,
  enabled
})
</script>

<template>
  <TaskItem
    title="EXCLUSIVE AIRDROP OF B² HONEY - FOR BUZZ USERS AND BLOCKHEADZ HOLDERS"
    description="PLEASE CONFIRM THAT YOU ARE A B² BUZZ USER OR BLOCKHEADZ HOLDER BEFORE CLAIMING. AFTER THE CLAIM IS COMPLETED, YOUR GOOOO WILL BE UPDATED WITHIN 24 HOURS. PLEASE BE PATIENT AND REFRAIN FROM REPEATEDLY CLAIMING."
    :image="B2_HONEY_IMAGE"
    :succeed="isMinted"
  >
    <Button
      class="w-full md:w-[174px]"
      size="sm"
      @click="onMint"
      :disabled="isChecking"
      :loading="loading || isChecking"
    >
      {{ isChecking ? 'CHECKING' : 'CLAIM' }}
    </Button>
  </TaskItem>
</template>
