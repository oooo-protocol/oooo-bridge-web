<script setup lang="ts">
import AppHeader from 'oooo-components/layout/AppHeader.vue'
import AppNav from 'oooo-components/layout/AppNav.vue'
import AppFooter from 'oooo-components/layout/AppFooter.vue'
import Icon from 'oooo-components/ui/Icon.vue'
import { AppCarousel } from './AppCarousel'
import WalletConnectButton from './WalletConnectButton.vue'
import AppNotification from './AppNotification.vue'

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

const navs = [
  {
    name: 'BRIDGE',
    icon: 'bridge',
    ...(import.meta.env.VITE_MODE === 'testnet'
      ? {
        tag: 'a',
        attributes: {
          href: 'https://bridge.oooo.money'
        }
      }
      : {
        tag: 'router-link',
        attributes: {
          to: '/'
        }
      })
  }, {
    name: 'Goooo',
    icon: 'Goooo',
    ...(import.meta.env.VITE_MODE === 'testnet'
      ? {
        tag: 'a',
        attributes: {
          href: 'https://bridge.oooo.money/goooo'
        }
      }
      : {
        tag: 'router-link',
        attributes: {
          to: '/goooo'
        }
      })
  }
]

const route = useRoute()

watch(route, (route) => {
  const name = route.name
  const appEl = document.querySelector('#app') as HTMLElement
  if (name === 'goooo') {
    appEl.style.background = '#000'
  } else {
    appEl.style.background = ''
  }
}, {
  immediate: true
})
</script>

<template>
  <AppHeader class="justify-between">
    <AppNav :menus="menus" />
    <component
      v-for="(nav, index) of navs"
      :key="nav.name"
      class="flex items-center gap-[8px] -tracking-tighter hover:text-[#bce4cd]"
      :class="{
        'md:ml-auto': index === 0,
        'hidden md:flex': nav.name === 'BRIDGE'
      }"
      :is="nav.tag"
      v-bind="nav.attributes"
    >
      <Icon
        class="text-[22px] text-[#ff961e]"
        :name="nav.icon"
      />
      {{ nav.name }}
    </component>
    <WalletConnectButton />
  </AppHeader>
  <AppCarousel v-if="route.name !== 'goooo'" />
  <AppNotification
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
  padding-top: 80px;
}
</style>
