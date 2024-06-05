<script setup lang="ts">
import AppHeader from 'oooo-components/layout/AppHeader.vue'
import AppNav from 'oooo-components/layout/AppNav.vue'
import AppFooter from 'oooo-components/layout/AppFooter.vue'
import Icon from 'oooo-components/ui/Icon.vue'
import { AppCarousel } from './AppCarousel'
import WalletConnectButton from './WalletConnectButton.vue'
import AppNotification from './AppNotification.vue'
import { NETWORK } from '@/entities/chain'

const menus = [
  {
    name: 'CHEST CHASE',
    tag: 'a',
    attributes: {
      href: 'https://oooo.money/chestchase'
    }
  },
  {
    name: 'BRIDGE',
    children: [
      {
        name: 'MAINNET',
        tag: 'a',
        attributes: {
          href: 'https://bridge.oooo.money'
        }
      }, {
        name: 'TESTNET',
        tag: 'a',
        attributes: {
          href: 'https://testnet.bridge.oooo.money'
        }
      }
    ]
  },
  {
    name: 'DOCS',
    tag: 'a',
    attributes: {
      href: 'https://docs.oooo.money/'
    }
  },
  {
    name: 'GITHUB',
    tag: 'a',
    attributes: {
      href: 'https://github.com/oooo-protocol'
    }
  },
  {
    name: 'MEDIA KIT',
    tag: 'a',
    attributes: {
      href: 'https://oooo.money/assets/media-kit/logo.zip',
      download: 'oooo-media-kit.zip'
    },
    closable: true
  }
]

const isSupportNotification = import.meta.env.VITE_NETWORK === NETWORK.LIVENET
</script>

<template>
  <AppHeader class="justify-between">
    <AppNav :menus="menus" />
    <a
      class="hidden md:flex gap-[8px] md:ml-auto -tracking-tighter hover:text-[#bce4cd]"
      href="https://bridge.oooo.money"
    >
      <Icon
        class="text-[22px] text-[#ff961e]"
        name="bridge"
      />
      BRIDGE
    </a>
    <a
      class="flex items-center gap-[8px] -tracking-tighter hover:text-[#bce4cd]"
      href="https://oooo.money/goooo"
    >
      <Icon
        class="text-[20px] text-[#ff961e]"
        name="Goooo"
      />
      Goooo
    </a>
    <WalletConnectButton />
  </AppHeader>
  <AppCarousel />
  <AppNotification
    v-if="isSupportNotification"
    class="mt-[20px]"
  />
  <!-- 不设置默认key，以文件名区分(Vue默认)，确保复用最外层容器 -->
  <RouterView v-slot="{ Component }">
    <!-- Romove KeepAlive to ensure child page is latest data -->
    <!-- <KeepAlive> -->
    <component
      :is="Component"
    />
    <!-- </KeepAlive> -->
  </RouterView>
  <p
    class="text-[#a4a4a4] text-center text-[13px] md:text-[16px]"
  >
    Powered by oooo.money
  </p>
  <AppFooter />
</template>

<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  overflow-y: scroll;
  background: url('@/assets/images/background.jpg') top/cover no-repeat;
}
</style>
