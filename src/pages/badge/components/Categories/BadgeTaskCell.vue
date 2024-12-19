<script setup lang="ts">
import Icon from '@/components/Icon.vue'
import { Button } from '@/components/ui/button'
import { useEVMWallet } from '@/composables/oooo-wallet'
import { BadgeMintType, type Badge, type BadgeMintLimit } from '@/entities/badge'
import { invokeAuthorizationLink } from '@/lib/utils'
import { getBadgeDiscordAuthorizationUrl, verifyBadgeLimit } from '@/request/api/badge'
import { useMutation } from '@tanstack/vue-query'

const props = defineProps<{
  badgeId: Badge['id']
  task: BadgeMintLimit
}>()
const emits = defineEmits<(e: 'succeed') => void>()

const { address } = useEVMWallet()

/**
 * status - true: success, false: fail, undefined: wait to check
 */
const { isPending: loading, data: status, mutate } = useMutation({
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
      emits('succeed')
    }
  }
})
</script>

<template>
  <div class="flex items-center gap-[8px] px-[8px] py-[10px] border boreder-[#5a6960] rounded-[2px]">
    <img
      class="w-[32px] h-[32px]"
      :src="task.icon"
    >
    <p
      class="text-[14px]"
      v-html="task.title"
    />
    <div
      class="ml-auto"
      v-if="address"
    >
      <Icon
        name="Finish"
        class="text-[22px] text-[#abeec4]"
        v-if="status"
      />
      <Icon
        name="close1"
        class="text-[22px] text-[#787878]"
        v-else-if="status === false"
      />
      <Button
        v-else
        class="w-[90px]"
        size="sm"
        @click="mutate"
        :loading="loading"
      >
        CHECK
      </Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
