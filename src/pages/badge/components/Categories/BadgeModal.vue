<script setup lang="ts">
import EVMWalletConnectButton from '@/components/EVMWalletConnectButton.vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useEVMWallet } from '@/composables/oooo-wallet'
import { Button } from '@/components/ui/button'
import { QuestTag } from '@/components/QuestItem'
import { useMint } from '../../hooks/use-mint'
import { type MintedBadge, type UnmintBadge } from './Badge.vue'
import { UserBadgeMintStatus } from '@/entities/badge'
import { CHAIN_BLOCK_EXPLORER_URL_MAP } from '@/lib/constants'
import { combineURLs, formatDate } from '@/lib/utils'
import BadgeTaskCell from './BadgeTaskCell.vue'

const open = defineModel<boolean>('open')

const props = defineProps<{
  badge: MintedBadge | UnmintBadge
}>()

const { address } = useEVMWallet()
const { mint } = useMint()

const limits = ref<boolean[]>((() => {
  if (props.badge.status !== UserBadgeMintStatus.UNMINT) return []
  return props.badge.mintLimit.map(_ => false)
})())
const mintable = computed(() => limits.value.every((item) => item))

const txnUrl = computed(() => {
  if (props.badge.status === UserBadgeMintStatus.UNMINT) return
  const explorer = CHAIN_BLOCK_EXPLORER_URL_MAP[props.badge.chainName]
  return combineURLs(explorer, `/tx/${props.badge.txnHash}`)
})

watch(() => props.badge, () => {
  if (props.badge.status !== UserBadgeMintStatus.UNMINT) return
  limits.value = props.badge.mintLimit.map(_ => false)
})

const onMint = async () => {
  open.value = false
  await mint({
    badgeId: props.badge.id
  })
}
</script>

<template>
  <Dialog
    v-bind="$attrs"
    v-model:open="open"
  >
    <DialogContent
      @pointer-down-outside.prevent
      @escape-key-down.prevent
    >
      <template #header>
        <DialogHeader>
          <DialogTitle>&nbsp;</DialogTitle>
        </DialogHeader>
      </template>
      <div class="flex flex-col md:flex-row items-center gap-[8px] md:gap-[30px]">
        <img
          class="w-[120px] h-[120px] md:w-[160px] md:h-[160px]"
          :src="badge.icon"
        >
        <div>
          <p class="text-[16px] md:text-[24px] font-[500]">
            {{ badge.name }}
          </p>
          <div class="mt-[16px] md:mt-[8px] flex justify-center md:justify-normal gap-[4px]">
            <QuestTag
              v-for="tag of badge.tags"
              :tag="tag"
              :key="tag.name"
            />
          </div>
          <p class="mt-[16px] text-[12px] text-[#787878]">
            {{ badge.description }}
          </p>
          <template v-if="badge.status === UserBadgeMintStatus.MINTED">
            <p class="mt-[16px] text-[12px] leading-[1.5] text-[#a4a4a4]">
              MINTED ON
            </p>
            <p class="mt-[4px] text-[14px] leading-[1.3]">
              {{ formatDate(badge.mintTime, 'MM DD, YYYY') }}
            </p>
          </template>
        </div>
      </div>
      <template v-if="badge.status === UserBadgeMintStatus.UNMINT">
        <p class="mt-[32px] text-[12px] md:text-[14px] text-[#bce4cd]">
          MINT REQUIREMENTS
        </p>
        <div class="mt-[7px] md:mt-[20px]">
          <BadgeTaskCell
            v-for="(task, i) of badge.mintLimit"
            :key="task.id"
            :task="task"
            :badge-id="badge.id"
            @succeed="() => limits[i] = true"
          />
        </div>
      </template>
      <div class="mt-[30px] md:mt-[40px]">
        <EVMWalletConnectButton
          class="w-full"
          v-if="!address"
        />
        <Button
          class="w-full bg-gradient-to-r from-[#e66dff] to-[#00ff5b] text-[#000] hover:text-accent"
          variant="outline"
          @click="onMint"
          v-else-if="badge.status === UserBadgeMintStatus.UNMINT"
          :disabled="!mintable"
        >
          MINT NOW
        </Button>
        <Button
          class="w-full"
          variant="outline"
          as="a"
          target="_blank"
          :href="txnUrl"
          v-else
        >
          VIEW ON EXPLORER
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style lang="scss" scoped>

</style>
