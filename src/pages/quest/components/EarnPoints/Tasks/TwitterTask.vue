<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { isFollowedTwitter, verifyTwitter } from '@/request/api/task'
import Icon from '@/components/Icon.vue'
import { Button } from '@/components/ui/button'
import TaskItem from '../TaskItem.vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast'
import useSignatureStore from '@/store/signature'
import { useCreatePointConfetti } from '../../../hooks/use-create-point-confetti'
import { type Quest } from '@/entities/quest'
import { QuestItem } from '../../../../../components/QuestItem'
import TwitterImage from '@/assets/images/quest/x.png'

defineOptions({ name: 'TwitterTaskItem' })

const quest: Quest = {
  icon: TwitterImage,
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
      throw new Error('signature is not available, please re-connect wallet')
    }
    return await isFollowedTwitter(signature.signInfo)
  },
  onError: (e) => {
    toast({ description: e.message })
  }
})

let lastClickVerifyTimestamp: number

const onVerify = async () => {
  try {
    if (signature.signInfo == null) {
      throw new Error('Wallet or signature is not available, please re-connect wallet')
    }
    const current = +new Date()
    if (lastClickVerifyTimestamp == null) {
      lastClickVerifyTimestamp = current
    }
    if (current - lastClickVerifyTimestamp < 3000) {
      toast({ description: "No Follow found, X's Follow data is being synchronized, please wait a few seconds and click Verify again." })
      return
    }
    const verified = await verifyTwitter(signature.signInfo)
    if (verified) {
      isOpenFollowDialog.value = false
      const succeed = await check()
      if (succeed) {
        createPointConfetti('GET 1 POINTS')
        void queryClient.invalidateQueries({ queryKey: ['/point/account', signature.signInfo.walletAddress] })
      }
    }
  } catch (e) {
    toast({ description: (e as Error).message })
  }
}
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
          href="https://twitter.com/intent/follow?screen_name=oooo_money"
          target="_blank"
        >
          @oooo
        </a>
        ON X
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
        FOLLOW
      </Button>
    </div>
  </QuestItem>
  <Dialog v-model:open="isOpenFollowDialog">
    <DialogContent>
      <template #header>
        <DialogHeader>
          <DialogTitle>
            FOLLOW @oooo ON X AND VERIFIED
          </DialogTitle>
        </DialogHeader>
      </template>
      <div class="space-y-[16px]">
        <TaskItem description="FOLLOW @oooo ON X">
          <template #title>
            <p class="text-[#abeec4]">
              STEP 1
            </p>
          </template>
          <Button
            class="w-[90px]"
            size="sm"
            as="a"
            href="https://twitter.com/intent/follow?screen_name=oooo_money"
            target="_blank"
          >
            FOLLOW
          </Button>
        </TaskItem>
        <TaskItem description="VERIFY YOUR FOLLOW STATUS">
          <template #title>
            <p class="text-[#abeec4]">
              STEP 2
            </p>
          </template>
          <Button
            class="w-[90px]"
            size="sm"
            @click="onVerify"
          >
            VERIFY
          </Button>
        </TaskItem>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style lang="scss" scoped>

</style>
