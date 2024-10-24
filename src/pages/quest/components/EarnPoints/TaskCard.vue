<script setup lang="ts">
defineOptions({ name: 'TaskCard' })

defineProps<{
  title: string
}>()
</script>

<template>
  <div class="p-[16px] md:py-[30px] md:px-[40px] rounded-[2px] bg-[#121314]">
    <div>
      <p class="md:text-[22px] font-medium -tracking-tighter">
        {{ title }}
      </p>
      <slot name="suffix" />
    </div>
    <div class="mt-[10px] md:mt-[16px] flex items-start gap-[16px]">
      <div class="w-full space-y-[8px] md:space-y-[16px]">
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
