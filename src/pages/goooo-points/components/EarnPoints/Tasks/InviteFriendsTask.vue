<script setup lang="ts">
import { Button } from 'oooo-components/ui/button'
import TaskItem from '../TaskItem.vue'
import { retrieveAccountInfo } from '@/request/api/task'
import useSignatureStore from '@/store/signature'
import { useQuery } from '@tanstack/vue-query'
import { useWallet } from '@/composables/hooks/use-wallet'
import { useClipboard } from '@/composables/hooks/use-clipboard'
import { useToast } from 'oooo-components/ui/toast'
import Icon from 'oooo-components/ui/Icon.vue'

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
const telegramUrl = computed(() => `https://t.me/share/url?url=${pointInviteUrl.value}&text=Bridge%20to%20earn%20Goooo!%20oooo%20is%20the%20first%20modular%20omnichain%20interoperability%20protocol%20supporting%20bitcoin%20ecosystem.`)
const twitterUrl = computed(() => `https://twitter.com/intent/tweet?url=${pointInviteUrl.value}&text=Bridge%20to%20earn%20Goooo!%20oooo%20is%20the%20first%20modular%20omnichain%20interoperability%20protocol%20supporting%20bitcoin%20ecosystem.`)

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
    description="THEY NEED TO COMPLETE TASKS FOR 𝕏 AND DISCORD, YOU WILL RECEIVE 2 POINTS."
    icon="giftbox"
  >
    <div class="flex gap-[10px]">
      <Button
        variant="ghost"
        size="icon"
        as="a"
        :href="twitterUrl"
        target="_blank"
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
        :href="telegramUrl"
        target="_blank"
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
    </div>
  </TaskItem>
</template>

<style lang="scss" scoped>

</style>
