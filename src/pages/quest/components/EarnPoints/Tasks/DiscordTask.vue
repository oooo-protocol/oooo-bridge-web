<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { isFollowedDiscord, getDiscordAuthorizationUrl } from '@/request/api/task'
import Icon from '@/components/Icon.vue'
import { Button } from '@/components/ui/button'
import TaskItem from '../TaskItem.vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast'
import { invokeAuthorizationLink } from '@/lib/utils'
import { useCreatePointConfetti } from '../../../hooks/use-create-point-confetti'
import useSignatureStore from '@/store/signature'
import { type Quest } from '@/entities/quest'
import DiscordImage from '@/assets/images/quest/discord.png'
import { QuestItem } from '../../../../../components/QuestItem'

defineOptions({ name: 'TwitterTaskItem' })

const quest: Quest = {
  icon: DiscordImage,
  tags: [
    {
      icon: '/assets/images/goooo.png',
      name: '+1 Goooo',
      color: '#ff9700'
    }
  ]
}

const { toast } = useToast()

const isOpenFollowDialog = ref(false)
const isOpenErrorDialog = ref(false)

const signature = useSignatureStore()
const createPointConfetti = useCreatePointConfetti()
const queryClient = useQueryClient()

const disabled = computed(() => signature.signInfo == null)

watch(() => [signature.signInfo], ([signInfo]) => {
  if (disabled.value) return
  void check()
})

onBeforeMount(() => {
  if (disabled.value) return
  void check()
})

const { isPending: isChecking, data: succeed, mutateAsync: check } = useMutation({
  mutationFn: async () => {
    if (signature.signInfo == null) {
      throw new Error('SIGNATURE IS NOT AVAILABLE, PLEASE RE-CONNECT WALLET')
    }
    return await isFollowedDiscord(signature.signInfo)
  },
  onError: (e) => {
    toast({ description: e.message })
  }
})

const { isPending: loading, mutate } = useMutation({
  mutationFn: async () => {
    if (signature.signInfo == null) {
      throw new Error('SIGNATURE IS NOT AVAILABLE, PLEASE RE-CONNECT WALLET')
    }
    const url = await getDiscordAuthorizationUrl(signature.signInfo)
    const succeed = await invokeAuthorizationLink(url)
    if (succeed) {
      isOpenFollowDialog.value = false
      const succeed = await check()
      if (succeed) {
        createPointConfetti('GET 1 POINTS')
        void queryClient.invalidateQueries({ queryKey: ['/point/account', signature.signInfo.walletAddress] })
      }
    } else {
      isOpenErrorDialog.value = true
    }
  },
  onError: (e) => {
    toast({ description: e.message })
  }
})
</script>

<template>
  <QuestItem
    :quest="quest"
    :succeed="succeed"
  >
    <template #title>
      <p>
        FOLLOW
        <a
          class="underline"
          href="https://discord.gg/ooooprotocol"
          target="_blank"
        >
          @oooo
        </a>
        ON DISCORD
      </p>
    </template>
    <div class="flex gap-[10px]">
      <Button
        variant="ghost"
        size="icon"
        @click="check"
        :disabled="isChecking || disabled"
      >
        <Icon
          :class="{
            'animate-spin-reverse': isChecking
          }"
          name="refresh"
        />
      </Button>
      <Button
        class="w-[90px]"
        size="sm"
        :disabled="disabled"
        @click="isOpenFollowDialog = !isOpenFollowDialog"
      >
        JOIN
      </Button>
    </div>
  </QuestItem>
  <Dialog v-model:open="isOpenFollowDialog">
    <DialogContent>
      <template #header>
        <DialogHeader>
          <DialogTitle>
            JOIN @oooo ON DISCORD AND VERIFIED
          </DialogTitle>
        </DialogHeader>
      </template>
      <div class="space-y-[16px]">
        <TaskItem description="COMPLETE DISCORD FOLLOW, READ RULES AND COMPLETE VERIFICATION">
          <template #title>
            <p class="text-[#abeec4]">
              STEP 1
            </p>
          </template>
          <Button
            class="w-[90px]"
            size="sm"
            as="a"
            href="https://discord.gg/ooooprotocol"
            target="_blank"
          >
            JOIN
          </Button>
        </TaskItem>
        <TaskItem description="AUTHORIZE DISCORD TO ACCESS YOUR FOLLOW STATUS">
          <template #title>
            <p class="text-[#abeec4]">
              STEP 2
            </p>
          </template>
          <Button
            class="w-[90px]"
            size="sm"
            :loading="loading"
            @click="mutate"
          >
            AUTH
          </Button>
        </TaskItem>
      </div>
    </DialogContent>
  </Dialog>
  <Dialog v-model:open="isOpenErrorDialog">
    <DialogContent>
      <template #header>
        <DialogHeader>
          <DialogTitle>
            _ OOPS
          </DialogTitle>
        </DialogHeader>
      </template>
      <div class="font-light tracking-[0.8px]">
        <p>
          NO FOLLOW FOUND FOR DISCORD, TRY AGAIN.
        </p>
        <p class="mt-[30px] text-[#abeec4]">
          1. COMPLETE DISCORD FOLLOW, READ RULES AND COMPLETE VERIFICATION.
        </p>
        <p class="mt-[10px] text-[#abeec4]">
          2. CONFIRM DISCORD ACCOUNT HAS BEEN AUTHORIZED.
        </p>
        <p class="mt-[10px] text-[#abeec4]">
          3. THE DISCORD ACCOUNT HAS NOT BEEN USED BY ANY OTHER ADDRESS.
        </p>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style lang="scss" scoped>

</style>
