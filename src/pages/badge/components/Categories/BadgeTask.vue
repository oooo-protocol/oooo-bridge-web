<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useEVMWallet } from '@/composables/oooo-wallet'
import { BadgeMintType, type Badge, type BadgeMintLimit } from '@/entities/badge'
import { type BadgeConfig } from '@/entities/config'
import { invokeAuthorizationLink } from '@/lib/utils'
import { getBadgeDiscordAuthorizationUrl, verifyBadgeLimit } from '@/request/api/badge'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import BadgeTaskCell from './BadgeTaskCell.vue'

const props = defineProps<{
  badgeId: Badge['id']
  task: BadgeMintLimit
}>()

const { address } = useEVMWallet()
const queryClient = useQueryClient()

/**
 * status - true: success, false: fail, undefined: wait to check
 */
const { isPending: loading, data: _status, mutate } = useMutation({
  mutationKey: ['/badge/mint/check', address.value, props.badgeId, props.task.id],
  mutationFn: async () => {
    const result = await verifyBadgeLimit({ walletAddress: address.value!, badgeId: props.badgeId, mintLimitId: props.task.id })
    if (props.task.type !== BadgeMintType.DISCORD) return result

    if (result) return result

    const url = await getBadgeDiscordAuthorizationUrl({ walletAddress: address.value!, badgeId: props.badgeId, mintLimitId: props.task.id })
    const succeed = await invokeAuthorizationLink(url)
    return succeed
  },
  onSuccess: (data) => {
    if (data) {
      queryClient.setQueryData(['/badge/configuration', address], (old: BadgeConfig | undefined) => {
        if (!old) return old
        return {
          ...old,
          badgeList: old.badgeList.map((item) => {
            if (item.id !== props.badgeId) return item
            return {
              ...item,
              mintLimit: item.mintLimit.map((limit) => {
                if (limit.id !== props.task.id) return limit
                return {
                  ...limit,
                  status: true
                }
              })
            }
          })
        }
      })
    }
  }
})
/**
 * if query status is undefined, check task status
 */
const status = computed(() => _status.value ?? props.task.status)
</script>

<template>
  <BadgeTaskCell
    :icon="task.icon"
    :title="task.title"
    :status="status"
  >
    <Button
      class="w-[90px]"
      size="sm"
      @click="mutate"
      :loading="loading"
    >
      CHECK
    </Button>
  </BadgeTaskCell>
</template>

<style lang="scss" scoped>

</style>
