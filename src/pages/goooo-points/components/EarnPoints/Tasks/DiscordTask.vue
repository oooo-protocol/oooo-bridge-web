<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query'
import { isFollowedDiscord, getDiscordAuthorizationUrl } from '@/request/api/task'
import Icon from 'oooo-components/ui/Icon.vue'
import { Button } from 'oooo-components/ui/button'
import TaskItem from '../TaskItem.vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from 'oooo-components/ui/dialog'
import { useToast } from 'oooo-components/ui/toast'
import { invokeAuthorizationLink } from '@/lib/utils'
import { useCreatePointConfetti } from '../../../hooks/use-create-point-confetti'
import useSignatureStore from '@/store/signature'

defineOptions({ name: 'TwitterTaskItem' })

const { toast } = useToast()

const isOpenFollowDialog = ref(false)
const isOpenErrorDialog = ref(false)

const signature = useSignatureStore()
const createPointConfetti = useCreatePointConfetti()

const disabled = computed(() => signature.signInfo == null)

watch(() => [signature.signInfo], ([signInfo]) => {
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
        createPointConfetti('GET 10 POINTS')
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
    hint="+10 Goooo"
    icon="discord1"
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
          @oooo ON DISCORD
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
        JOIN
      </Button>
    </div>
  </TaskItem>
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
        <TaskItem description="COMPLETE DISCORD FOLLOW, READ RULES AND COMPLETE VERIFICATION.">
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
        <TaskItem description="AUTHORIZE DISCORD TO ACCESS YOUR FOLLOW STATUS. ONLY REPLY THE TRANSLATED RESULT AND NOTHING ELSE.">
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
