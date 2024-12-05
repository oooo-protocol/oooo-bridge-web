<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

const open = defineModel<boolean>()
defineProps<{
  description: string
}>()
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <template #header>
        <DialogHeader>
          <DialogTitle>_ HELP</DialogTitle>
        </DialogHeader>
      </template>
      <p class="md:text-[19px] -tracking-tighter">
        Instructions
      </p>
      <p class="mt-[8px] -tracking-tighter text-[#a4a4a4]">
        {{ description }}
      </p>
    </DialogContent>
  </Dialog>
</template>

<style lang="scss" scoped>

</style>
