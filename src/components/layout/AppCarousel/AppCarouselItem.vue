<script setup lang="ts">
const props = defineProps<{
  imageMobile: string
  imagePC: string
  link?: string
}>()
</script>

<template>
  <a
    class="app-carousel__item"
    :class="{
      'cursor-pointer': props.link != null
    }"
    :href="props.link"
    target="_blank"
  />
</template>

<style lang="scss" scoped>
.app-carousel__item {
  display: block;
  height: 0;
  width: 100%;
  background: no-repeat center/contain;

  padding-bottom: 22.63%;
  background-image: v-bind("`url('${props.imageMobile}')`");

  @media (min-width: 768px) {
    padding-bottom: 15.625%;
    background-image: v-bind("`url('${props.imagePC}')`");
  }
}
</style>
