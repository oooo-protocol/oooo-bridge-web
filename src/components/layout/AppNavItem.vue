<script setup lang="ts">
defineOptions({
  name: 'AppNavItem'
})

interface Menu {
  name: string
  link?: string
  children?: Menu[]
}

defineProps<{
  menu: Menu
}>()
</script>

<template>
  <li
    class="app-nav-menu"
    :key="menu.name"
  >
    <component
      :is="menu.link ? 'a' : 'p'"
      :href="menu.link"
    >
      {{ menu.name }}
    </component>
    <ul
      class="app-nav-menu__children"
      v-if="menu.children"
    >
      <AppNavItem
        v-for="child of menu.children"
        :key="child.name"
        :menu="child"
      />
    </ul>
  </li>
</template>

<style lang="scss">
.app-nav-menu {
  @apply text-[14px] leading-[32px] tracking-[1px] text-[#bce4cd];
  &:not(:last-child) {
    @apply mb-[20px];
  }

  &__children {
    @apply px-[20px] pt-[20px];
  }
}
</style>
