<script setup lang="ts">
import { Button } from 'oooo-components/ui/button'
import TaskItem from '../TaskItem.vue'
import { retrieveAccountInfo } from '@/request/api/task'
import useSignatureStore from '@/store/signature'
import { useQuery } from '@tanstack/vue-query'
import { useWallet } from '@/composables/hooks/use-wallet'
import { useClipboard } from '@/composables/hooks/use-clipboard'
import { useToast } from 'oooo-components/ui/toast'

const { address } = useWallet()
const signature = useSignatureStore()
const { copy } = useClipboard()
const { toast } = useToast()

const enabled = computed(() => signature.signInfo !== undefined)
const { data: account } = useQuery({
  queryKey: ['/point/account', address.value],
  queryFn: async () => await retrieveAccountInfo(signature.signInfo!),
  enabled
})
const pointInviteUrl = computed(() => account.value ? `${window.location.origin}/goooo-points?inviteCode=${account.value.inviteCode}` : undefined)

const onCopy = async (text: string) => {
  await copy(text)
  toast({
    description: '💌 Copied to clipboard! Send to friends to earn Goooo'
  })
}
</script>

<template>
  <TaskItem
    title="INVITE FRIENDS TO EARN MORE POINTS"
    description="THEY NEED TO COMPLETE TASKS FOR 𝕏 AND DISCORD, BOTH OF YOU WILL RECEIVE AN ADDITIONAL 10 POINTS."
    points="10"
    icon="giftbox"
  >
    <Button
      variant="ghost"
      size="icon"
      as="a"
      href=""
    >
      <Icon
        class="text-[22px]"
        name="twitter"
      />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      as="a"
      href=""
    >
      <Icon
        class="text-[22px]"
        name="telegram"
      />
    </Button>
    <Button
      variant="secondary"
      size="sm"
      :disabled="!pointInviteUrl"
      @click="onCopy(pointInviteUrl!)"
    >
      COPY URL
    </Button>
  </TaskItem>
</template>

<style lang="scss" scoped>

</style>
