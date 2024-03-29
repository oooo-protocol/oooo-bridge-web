<script setup lang="ts">
import { ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import Icon from '@/components/Icon.vue'
import AppNavItem from './AppNavItem.vue'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu'

const menus = [
  {
    name: 'CHEST CHASE',
    link: 'https://www.oooo.money/chestchase'
  },
  {
    name: 'BRIDGE',
    children: [
      {
        name: 'MAINNET',
        link: 'https://bridge.oooo.money'
      }, {
        name: 'TESTNET',
        link: 'https://testnet.bridge.oooo.money'
      }
    ]
  },
  {
    name: 'DOCS',
    link: 'https://docs.oooo.money/'
  }
]
const showMenubar = ref(false)
const { width } = useWindowSize()
</script>

<template>
  <template v-if="width > 1280">
    <ul class="app-nav__pc">
      <template
        v-for="menu of menus"
        :key="menu.name"
      >
        <DropdownMenu
          v-if="menu.children"
        >
          <DropdownMenuTrigger>
            <li class="app-nav__menu">
              {{ menu.name }}
            </li>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="px-0 py-[12px] border-none min-w-[var(--radix-popper-anchor-width)]">
            <DropdownMenuItem
              v-for="child of menu.children"
              :key="child.name"
              as-child
            >
              <a :href="child.link">{{ child.name }}</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <li
          class="app-nav__menu"
          v-else
        >
          <a :href="menu.link">{{ menu.name }}</a>
        </li>
      </template>
    </ul>
  </template>
  <template v-else>
    <Icon
      class="cursor-pointer text-[26px]"
      name="menu"
      @click="showMenubar = true"
    />
    <Teleport
      to="body"
      v-if="showMenubar"
    >
      <div class="app-nav">
        <div class="app-nav__header">
          <span
            class="app-nav__close"
            @click="showMenubar = false"
          >
            CLOSE
          </span>
        </div>
        <ul class="app-nav__content">
          <AppNavItem
            v-for="menu of menus"
            :menu="menu"
            :key="menu.name"
          />
        </ul>
      </div>
      <div
        class="app-nav__mask"
        @click="showMenubar = false"
      />
    </Teleport>
  </template>
</template>

<style lang="scss">
.app-nav {
  @apply z-20 absolute top-0 right-0 left-0 bg-[#1c1c1c];

  &__mask {
    @apply absolute top-0 left-0 w-[100vw] h-[100vh];
  }

  &__header {
    @apply py-[32px] px-[24px] md:px-[48px] border-b border-[#5a6960];
  }

  &__close {
    @apply cursor-pointer select-none text-[14px] leading-[1.14] tracking-[0.88] text-[#a4a4a4];
  }

  &__content {
    @apply py-[40px] px-[24px] md:px-[48px] space-y-[20px];
  }

  &__menu {
    @apply text-[14px] leading-[32px] tracking-[1px] text-[#bce4cd];
  }

  &__pc {
    @apply flex gap-[40px];
  }
}
</style>
