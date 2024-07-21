<script setup lang="ts">
</script>

<template>
  <div
    class="o-voucher-pack-placeholder"
  >
    <div class="o-voucher-pack-placeholder__content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.o-voucher-pack-placeholder {
  @apply relative  w-full md:w-[310px];

  &::before {
    @apply block mt-[8px] w-full h-0 pb-[53.22%];
    content: '';
    background: url('@/assets/images/o-voucher/placeholder.png') no-repeat center/contain;
    box-shadow: 0 -16px 0 -8px #8b8b8b;
  }

  &__content {
    @apply absolute left-0 top-0 w-full h-full px-[32px] flex flex-col justify-center items-center text-[#000];
  }
}
</style>
