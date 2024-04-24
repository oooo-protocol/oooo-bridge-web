<script setup lang="ts">
import AppHeader from 'oooo-components/layout/AppHeader.vue'
import AppNav from 'oooo-components/layout/AppNav.vue'
import AppFooter from 'oooo-components/layout/AppFooter.vue'
import Icon from 'oooo-components/ui/Icon.vue'
import { buttonVariants } from 'oooo-components/ui/button'
import WalletSelect from './WalletSelect.vue'
import AppNavbar from './AppNavbar.vue'

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

</script>

<template>
  <AppHeader>
    <AppNav :menus="menus" />
    <a
      class="hidden md:block md:ml-auto text-[14px] -tracking-tighter text-[#bce4cd] hover:text-[#7c9486]"
      href="https://bridge.oooo.money"
    >
      BRIDGE
    </a>
    <a
      class="ml-auto md:ml-0 gap-[8px] text-[#ff961e] hover:text-[#ff961e]"
      :class="buttonVariants({ variant: 'ghost' })"
      href="https://oooo.money/goooo"
    >
      <Icon
        class="text-[20px]"
        name="Goooo"
      />
      Goooo
    </a>
    <WalletSelect />
  </AppHeader>
  <AppNavbar />
  <!-- 不设置默认key，以文件名区分(Vue默认)，确保复用最外层容器 -->
  <RouterView v-slot="{ Component }">
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
