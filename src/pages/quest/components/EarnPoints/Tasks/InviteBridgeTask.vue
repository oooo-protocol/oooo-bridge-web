<script setup lang="ts">
import Icon from '@/components/Icon.vue'
import { Button } from '@/components/ui/button'
import { retrieveAccountInfo } from '@/request/api/task'
import useSignatureStore from '@/store/signature'
import { useQuery } from '@tanstack/vue-query'
import { useWallet } from '@/composables/hooks/use-wallet'
import { useClipboard } from '@/composables/hooks/use-clipboard'
import { useToast } from '@/components/ui/toast'
import { type Quest } from '@/entities/quest'
import LinkImage from '@/assets/images/quest/link.png'
import { QuestItem } from '../../../../../components/QuestItem'

const quest: Quest = {
  icon: LinkImage,
  title: 'INVITE FRIENDS TO COMPLETED MAINNET BRIDGE TRANSACTION',
  subTitle: '6 Goooo Points PER TRANSACTION',
  tags: [
    {
      icon: '/assets/images/goooo.png',
      name: '+6 Goooo',
      color: '#ff9700'
    }
  ]
}

const { address } = useWallet()
const signature = useSignatureStore()
const { copy } = useClipboard()
const { toast } = useToast()

const enabled = computed(() => signature.signInfo !== undefined)
const { data: account } = useQuery({
  queryKey: ['/point/account', address],
  queryFn: async () => await retrieveAccountInfo(signature.signInfo!),
  enabled
})
const pointInviteUrl = computed(() => account.value ? `${window.location.origin}?inviteCode=${account.value.inviteCode}` : undefined)
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
  <QuestItem
    :quest="quest"
  >
    <div class="flex gap-[10px]">
      <Button
        variant="ghost"
        size="icon"
        as="a"
        :href="twitterUrl"
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
  </QuestItem>
</template>

<style lang="scss" scoped>

</style>
