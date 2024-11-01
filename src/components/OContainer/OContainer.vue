<script setup lang="ts">
</script>

<template>
  <div
    class="o-container my-[12px] md:mt-[10px] md:mb-[16px] w-full bg-[#1c1c1c] text-[#ffffff] rounded-[2px]"
    v-bind="$attrs"
  >
    <slot />
  </div>
  <p
    class="mt-[6px] text-[#a4a4a4] text-center text-[13px] md:text-[16px]"
  >
    Powered by oooo.money
  </p>
</template>
