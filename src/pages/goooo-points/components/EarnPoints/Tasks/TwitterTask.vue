<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { isFollowedTwitter, getTwitterAuthorizationUrl } from '@/request/api/task'
import Icon from 'oooo-components/ui/Icon.vue'
import { Button } from 'oooo-components/ui/button'
import TaskItem from '../TaskItem.vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from 'oooo-components/ui/dialog'
import { useToast } from 'oooo-components/ui/toast'
import { invokeAuthorizationLink } from '@/lib/utils'
import useSignatureStore from '@/store/signature'
import { useCreatePointConfetti } from '../../../hooks/use-create-point-confetti'

defineOptions({ name: 'TwitterTaskItem' })

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
      throw new Error('signature is not available, please re-connect wallet')
    }
    return await isFollowedTwitter(signature.signInfo)
  },
  onError: (e) => {
    toast({ description: e.message })
  }
})

const { mutate } = useMutation({
  mutationFn: async () => {
    if (signature.signInfo == null) {
      throw new Error('Wallet or signature is not available, please re-connect wallet')
    }
    const url = await getTwitterAuthorizationUrl(signature.signInfo)
    const succeed = await invokeAuthorizationLink(url, false)
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
  <TaskItem
    hint="+1 Goooo"
    icon="twitter2"
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
          @oooo ON X
        </a>
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
  </TaskItem>
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
        <TaskItem description="AUTHORIZE X TO ACCESS YOUR FOLLOW STATUS">
          <template #title>
            <p class="text-[#abeec4]">
              STEP 2
            </p>
          </template>
          <Button
            class="w-[90px]"
            size="sm"
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
          NO FOLLOW FOUND FOR X, PLEASE TRY AGAIN.
        </p>
        <p class="mt-[30px] text-[#abeec4]">
          1. CONFIRM THAT X HAS BEEN AUTHORIZED.
        </p>
        <p class="mt-[10px] text-[#abeec4]">
          2. THE X ACCOUNT HAS NOT BEEN USED BY ANY OTHER ADDRESS.
        </p>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style lang="scss" scoped>

</style>
