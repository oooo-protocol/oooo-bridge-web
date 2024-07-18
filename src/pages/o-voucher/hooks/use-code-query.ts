import { type VoucherPack } from '@/entities/voucher'
import { redeemVoucherPack } from '@/request/api/voucher'
import useSignatureStore from '@/store/signature'
import { getArrayFirst } from '@preflower/utils'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useEVMWallet } from 'oooo-components/oooo-wallet'
import { useToast } from 'oooo-components/ui/toast'

export const useCodeQuery = () => {
  const route = useRoute()
  const code = getArrayFirst(route.query.code)
  const { address } = useEVMWallet()
  const signature = useSignatureStore()
  const queryClient = useQueryClient()

  const { toast } = useToast()

  const { mutate } = useMutation({
    mutationFn: redeemVoucherPack,
    onSuccess: (pack) => {
      queryClient.setQueryData(
        ['/voucher/pack/list', address],
        (old?: VoucherPack[]) => old ? [pack, ...old] : [pack]
      )
    },
    onError: (e) => {
      toast({
        description: e.message
      })
    }
  })

  watchEffect(() => {
    if (code == null || signature.signInfo == null) return
    mutate({
      ...signature.signInfo,
      packCode: code
    })
  })
}
