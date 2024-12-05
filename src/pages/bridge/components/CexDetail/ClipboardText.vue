<script setup lang="ts">
import { useClipboard } from '@/composables/hooks/use-clipboard'
import { Button } from '@/components/ui/button'
import Icon from '@/components/Icon.vue'
import { useToast } from '@/components/ui/toast'

const { toast } = useToast()
const { copy } = useClipboard()

const props = defineProps<{
  text: string | number
  description?: string
}>()

const container = ref<HTMLDivElement | null>(null)

const onClick = async () => {
  await copy(String(props.text), container.value!)
  toast({
    description: '💌 Copied to clipboard!'
  })
}
</script>

<template>
  <div
    ref="container"
    class="flex items-center justify-between gap-[8px]"
  >
    <div
      class="space-y-[2px] md:text-right"
    >
      <p
        class="-tracking-tighter"
      >
        {{ text }}
      </p>
      <p
        v-if="description"
        class="text-[14px] text-[#616161] -tracking-tighter"
      >
        {{ description }}
      </p>
    </div>
    <Button
      variant="ghost"
      size="icon"
      @click="onClick"
    >
      <Icon
        class="text-[#a4a4a4]"
        name="copy"
      />
    </Button>
  </div>
</template>
