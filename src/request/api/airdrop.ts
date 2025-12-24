import axios from '../axios'

export interface AirdropEligibility {
  walletAddress: string
  eligible: boolean
  airdropAmount: number
}

export const getAirdropEligibility = async (walletAddress: string) => {
  return await axios<AirdropEligibility>({
    url: '/activity/airdrop/eligibility',
    params: { walletAddress }
  })
}
