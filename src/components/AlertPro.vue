<script setup lang="ts">
import {
  Dialog,
  DialogContent
} from 'oooo-components/ui/dialog'
import { Button } from 'oooo-components/ui/button'

const open = defineModel<boolean>()

withDefaults(defineProps<{
  description?: string
  showConfirmButton?: boolean
  confirmButtonText?: string
}>(), {
  description: undefined,
  showConfirmButton: true,
  confirmButtonText: 'CONFIRM'
})

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()

const onConfirm = () => {
  open.value = false
  emit('confirm')
}
</script>

<template>
  <Dialog
    v-model:open="open"
  >
    <DialogContent
      @pointer-down-outside.prevent
      @escape-key-down.prevent
    >
      <p
        class="-tracking-tighter"
        v-if="description"
      >
        {{ description }}
      </p>
      <div class="mt-[24px] md:mt-[32px]">
        <Button
          class="w-full md:w-[120px]"
          @click="onConfirm"
        >
          {{ confirmButtonText }}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
