import { createFuncall } from 'vue-funcall'
import MintModal from '../components/MintModal.vue'
import MintSuccessModal from '../components/MintSuccessModal.vue'
import { sleep } from '@/lib/utils'
import { createConfetti } from '@/composables/confetti'
import { mintBadge, retrieveUserBadgeInfo } from '@/request/api/badge'
import { UserBadgeMintStatus } from '@/entities/badge'
import { useEVMWallet } from '@/composables/oooo-wallet'
import useSignatureStore from '@/store/signature'
import { ethers } from 'ethers'
import { CHAIN_CONFIG_MAP } from '@/lib/constants'
import { type CHAIN } from '@/entities/chain'
import { toast } from '@/components/ui/toast'
import { useQueryClient } from '@tanstack/vue-query'

const CONTRACT_ABI = [
  {
    inputs: [
      {
        components: [
          { name: 'to', type: 'address' },
          { name: 'tokenId', type: 'uint256' },
          { name: 'badgeId', type: 'uint256' },
          { name: 'chainId', type: 'uint256' }
        ],
        name: 'request',
        type: 'tuple'
      },
      { name: 'signature', type: 'bytes' }
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
]

interface MintData {
  badgeId: number
}

interface OnChainMintData extends MintData {
  to: string
  tokenId: number
  chainId: number
  contractAddress: string
  signature: string
  chainName: string
}

export const useMint = () => {
  const { getWalletInstance } = useEVMWallet()
  const signature = useSignatureStore()
  const queryClient = useQueryClient()

  const onChainMint = async (data: OnChainMintData) => {
    const { chainName, contractAddress, signature, ...onChainData } = data
    const instance = getWalletInstance()
    const provider = new ethers.BrowserProvider(instance.provider)
    try {
      const CHAIN_CONFIG = CHAIN_CONFIG_MAP[data.chainName as CHAIN]
      if (CHAIN_CONFIG == null) throw new Error(`Chain ${data.chainName} not config`)
      await instance.switchToChain(CHAIN_CONFIG)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(data.contractAddress, CONTRACT_ABI, signer)
      const gasPrice = (await provider.getFeeData()).gasPrice
      console.log(onChainData)
      const gas = await contract.mint.estimateGas(onChainData, signature)
      const { hash } = await contract.mint(onChainData, signature, {
        gasPrice,
        gasLimit: gas
      })
      return hash
    } finally {
      provider.destroy()
    }
  }

  const mint = async (data: MintData) => {
    const sign = await signature.getSignInfo()

    const { close: closeMintModal } = createFuncall(MintModal, {
      open: true
    })
    try {
      const userBadge = await retrieveUserBadgeInfo({
        ...sign,
        badgeId: data.badgeId
      })

      if (userBadge.status === UserBadgeMintStatus.UNMINT) {
        const txnHash = await onChainMint({
          chainName: userBadge.chainName,
          badgeId: userBadge.badgeId,
          to: userBadge.walletAddress,
          tokenId: userBadge.tokenId,
          chainId: userBadge.chainId,
          contractAddress: userBadge.contractAddress,
          signature: userBadge.signature
        })

        await mintBadge({
          ...sign,
          badgeId: userBadge.badgeId,
          txnHash
        })
      }

      await queryClient.invalidateQueries({
        queryKey: ['/badge/configuration', sign.walletAddress]
      })

      await closeMintModal()

      const { close: closeMintSuccessModal } = createFuncall(MintSuccessModal, {
        open: true,
        icon: 'https://bridge.oooo.money/static/nft/alphax.png'
      })

      await sleep(400)

      await createConfetti(3000)

      await closeMintSuccessModal()
    } catch (e) {
      await closeMintModal()
      toast({
        description: (e as Error).message
      })
    }
  }

  return {
    mint
  }
}
