<script setup lang="ts">
import Color from 'color'
import { type QuestTag } from '@/entities/quest'

const props = defineProps<{
  tag: QuestTag
}>()
const style = computed(() => ({
  color: props.tag.color ?? '#ff9700',
  borderColor: Color(props.tag.color).alpha(0.4).string(),
  background: Color(props.tag.color).alpha(0.06).string()
}))
</script>

<template>
  <div
    class="flex border rounded-[12px] p-[4px]"
    :style="style"
  >
    <img
      class="w-[14px] h-[14px]"
      :src="tag.icon"
    >
    <p class="ml-[4px] text-[10px] font-meidum">
      {{ tag.name }}
    </p>
  </div>
</template>

<style lang="scss" scoped>

</style>
