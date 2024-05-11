<script setup lang="ts">
import copy from 'copy-text-to-clipboard'
import { Button } from 'oooo-components/ui/button'
import Icon from 'oooo-components/ui/Icon.vue'
import { useToast } from 'oooo-components/ui/toast'

const { toast } = useToast()

const props = defineProps<{
  text: string | number
  description?: string
}>()

const container = ref<HTMLDivElement | null>(null)

const onClick = () => {
  const success = copy(String(props.text), {
    target: container.value!
  })
  if (success) {
    toast({
      description: '💌 Copied to clipboard!'
    })
  }
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
