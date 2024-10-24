<script setup lang="ts">
const props = defineProps<{
  type: 'goooo' | 'gem'
}>()

const TAGS = {
  goooo: {
    img: '/assets/images/goooo.png',
    class: 'text-[#ff9700] bg-[#ff9700]/15',
    text: 'Goooo'
  },
  gem: {
    img: '/assets/images/gem.png',
    class: 'text-[#ff86f7] bg-[#ff86f7]/15',
    text: 'Gem'
  }
}

const current = computed(() => TAGS[props.type])
</script>

<template>
  <div
    class="flex items-center gap-[4px] rounded-[13px] py-[6px] px-[8px]"
    :class="current.class"
  >
    <img
      class="w-[14px] h-[14px]"
      :src="current.img"
    >
    <p class="ml-[4px] text-[12px] font-meidum">
      <slot /> {{ current.text }}
    </p>
  </div>
</template>

<style lang="scss" scoped>

</style>
