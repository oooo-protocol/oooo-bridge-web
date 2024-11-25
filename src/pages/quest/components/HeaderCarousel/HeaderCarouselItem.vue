<script setup lang="ts">
const props = defineProps<{
  imageMobile?: string
  imagePC: string
  link?: string
}>()
</script>

<template>
  <a
    class="header-carousel__item"
    :class="{
      'cursor-pointer': props.link != null
    }"
    :href="props.link"
    target="_blank"
  />
</template>

<style lang="scss" scoped>
.header-carousel__item {
  display: block;
  height: 0;
  width: 100%;
  background: no-repeat center/cover;

  padding-bottom: 520px;
  background-image: v-bind("`url('${props.imagePC}')`");

  @media (max-width: 768px) {
    padding-bottom: 66.7%;
    background-image: v-bind("`url('${props.imageMobile ?? props.imagePC}')`");
  }
}
</style>
