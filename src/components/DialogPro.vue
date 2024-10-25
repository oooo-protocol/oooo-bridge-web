<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle } from 'oooo-components/ui/dialog'

defineProps<{
  title?: string
  headerClose?: boolean
}>()

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
        v-for="itemSlot in Object.keys($slots)"
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
