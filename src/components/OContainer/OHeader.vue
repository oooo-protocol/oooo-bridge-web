<script setup lang="ts">
defineProps<{
  isClose?: boolean
  title?: string
}>()
defineEmits<{
  close: []
}>()
</script>

<template>
  <div class="relative border-b border-b-[#5a6960] py-[16px] px-[16px] md:px-[40px]">
    <p
      class="absolute text-[14px] md:text-[16px] text-[#a4a4a4] tracking-[1px] cursor-pointer"
      v-if="isClose"
      @click="$emit('close')"
    >
      CLOSE
    </p>
    <p class="text-[14px] xl:text-[16px] tracking-[1px] text-right">
      {{ title }}
    </p>
    <slot />
  </div>
</template>
