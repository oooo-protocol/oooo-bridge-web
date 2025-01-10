<script setup lang="ts">
import EVMWalletConnectButton from '@/components/EVMWalletConnectButton.vue'
import { useEVMWallet } from '@/composables/oooo-wallet'
import { Button } from '@/components/ui/button'
import { QuestTag } from '@/components/QuestItem'
import { useMint } from '../../hooks/use-mint'
import { type MintedBadge, type UnmintBadge } from './Badge.vue'
import { UserBadgeMintStatus } from '@/entities/badge'
import { CHAIN_BLOCK_EXPLORER_URL_MAP } from '@/lib/constants'
import { combineURLs, formatDate } from '@/lib/utils'
import BadgeTaskCell from './BadgeTaskCell.vue'
import DialogPro from '@/components/DialogPro.vue'
import { useStorage } from '@vueuse/core'
import X_IMAGE from '@/assets/images/badge/x.png'
import { toast } from '@/components/ui/toast'

const open = defineModel<boolean>('open')

const props = defineProps<{
  badge: MintedBadge | UnmintBadge
}>()

const { address } = useEVMWallet()
const { mint } = useMint()

interface BadgeStore {
  walletAddress?: string
  isFollowChecked?: boolean
  isPostChecked?: boolean
}

const state = useStorage<BadgeStore>(
  `oooo-badge-${props.badge.id}`,
  { walletAddress: address.value, isFollowChecked: undefined, isPostChecked: undefined },
  localStorage,
  {
    mergeDefaults: (value, defaults) => {
      if (value != null && value.walletAddress !== address.value) return defaults
      return value
    }
  }
)

const mintable = computed(() => {
  if (props.badge.status !== UserBadgeMintStatus.UNMINT) return false
  return state.value.isFollowChecked && state.value.isPostChecked
})

const txnUrl = computed(() => {
  if (props.badge.status === UserBadgeMintStatus.UNMINT) return
  const explorer = CHAIN_BLOCK_EXPLORER_URL_MAP[props.badge.chainName]
  return combineURLs(explorer, `/tx/${props.badge.txnHash}`)
})

const onMint = async () => {
  open.value = false
  await mint({
    badgeId: props.badge.id
  })
}

enum ACTION {
  FOLLOW,
  POST
}

const actions: Record<ACTION, boolean> = {
  [ACTION.FOLLOW]: false,
  [ACTION.POST]: false
}

const onClickTask = (action: ACTION) => {
  switch (action) {
    case ACTION.FOLLOW:
      window.open('https://x.com/oooo_money', '_blank', 'popup, width=600, height=800')
      break
    case ACTION.POST:
      window.open('https://x.com/oooo_money/status/1877550117143851429', '_blank', 'popup, width=600, height=800')
      break
  }
  actions[action] = true
}

const onCheck = (action: ACTION) => {
  const status = actions[action]
  switch (action) {
    case ACTION.FOLLOW:
      if (status) state.value.isFollowChecked = true
      else toast({ description: 'No X follow found, please click Follow again to check if the follow was successful.' })
      break
    case ACTION.POST:
      if (status) state.value.isPostChecked = true
      else toast({ description: 'No results found for Retweet, comment, and like Badge\'s X post, please click the X Post button again to check if successful.' })
      break
  }
}
</script>

<template>
  <DialogPro
    v-bind="$attrs"
    v-model:open="open"
    title="&nbsp;"
    header-close
  >
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
        <p
          class="mt-[16px] text-[12px] text-[#787878]"
          v-html="badge.description"
        />
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
      <div class="mt-[7px] md:mt-[20px] space-y-[8px]">
        <BadgeTaskCell
          :icon="X_IMAGE"
          title="Follow @oooo on X"
          :status="state.isFollowChecked"
        >
          <div class="flex flex-col md:flex-row gap-[8px]">
            <Button
              variant="outline"
              @click="onClickTask(ACTION.FOLLOW)"
            >
              FOLLOW
            </Button>
            <Button @click="onCheck(ACTION.FOLLOW)">
              CHECK
            </Button>
          </div>
        </BadgeTaskCell>
        <BadgeTaskCell
          :icon="X_IMAGE"
          title="Retweet, comment, and like Badge’s X post."
          :status="state.isPostChecked"
        >
          <div class="flex flex-col md:flex-row gap-[8px]">
            <Button
              variant="outline"
              @click="onClickTask(ACTION.POST)"
            >
              X POST
            </Button>
            <Button @click="onCheck(ACTION.POST)">
              CHECK
            </Button>
          </div>
        </BadgeTaskCell>
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
  </DialogPro>
</template>

<style lang="scss" scoped>

</style>
