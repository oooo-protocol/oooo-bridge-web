<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

defineProps<{
  title?: string
  headerClose?: boolean
}>()

defineSlots()
</script>

<template>
  <Dialog>
    <DialogContent
      @pointer-down-outside.prevent
      @escape-key-down.prevent
    >
      <template
        v-if="title"
        #header
      >
        <DialogHeader :closable="headerClose">
          <DialogTitle>{{ title }}</DialogTitle>
        </DialogHeader>
      </template>
      <template
        v-for="itemSlot in (Object.keys($slots) as {})"
        :key="itemSlot"
        #[itemSlot]="temp"
      >
        <slot
          :name="itemSlot"
          v-bind="temp"
        />
      </template>
    </DialogContent>
  </Dialog>
</template>

<style lang="scss" scoped>

</style>
