<script setup lang="ts">
const links = [
  {
    name: 'X.com',
    link: 'https://twitter.com/oooo_money'
  },
  // {
  //   name: 'Telegram',
  //   link: ''
  // },
  {
    name: 'Medium',
    link: 'https://medium.com/@oooo-prot'
  },
  {
    name: 'Discord',
    link: 'https://discord.gg/ooooprotocol'
  }
]
</script>

<template>
  <ul class="flex flex-wrap gap-[24px] justify-center pt-[40px] px-[24px] pb-[40px] xl:pl-[48px] text-[14px] md:text-base tracking-[2px] normal-case">
    <li
      v-for="link in links"
      :key="link.name"
    >
      <a :href="link.link">{{ link.name }}</a>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.oooo {
  &-logo {
    width: 140px;
    height: 64px;

    @media (min-width: 768px) {
      width: 266px;
      height: 70px;
    }

    @media (min-width: 1280px) {
      width: 302px;
      height: 80px;
    }
  }
}
</style>
