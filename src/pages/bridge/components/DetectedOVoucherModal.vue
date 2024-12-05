<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import OVoucherPackPlaceholder from '@/pages/o-voucher/components/OVoucherPackPlaceholder.vue'
import { Button, buttonVariants } from '@/components/ui/button'

const open = defineModel<boolean>()
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent
      @pointer-down-outside.prevent
    >
      <template #header>
        <DialogHeader>
          <DialogTitle>_ CHOOSE o-VOUCHER</DialogTitle>
        </DialogHeader>
      </template>
      <p class="mb-[30px] md:mb-[38px] text-[16px] md:text-[20px] -tracking-tighter">
        YOU HAVE o-VOUCHER TO CLAIM
      </p>
      <OVoucherPackPlaceholder class="mx-auto">
        <p class="text-[20px]">
          o-VOUCHER PACK
        </p>
      </OVoucherPackPlaceholder>
      <div class="mt-[38px] flex flex-col-reverse md:flex-row gap-[10px]">
        <Button
          class="w-full md:w-[204px]"
          variant="secondary"
          @click="open = false"
        >
          CLAMIM LATER
        </Button>
        <RouterLink
          class="w-full md:w-[204px]"
          :class="buttonVariants({ variant: 'default' })"
          to="/o-voucher"
          @click="open = false"
        >
          GO TO CLAIM
        </RouterLink>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style lang="scss" scoped>

</style>
