<script setup lang="ts">
import AppContainer from './AppContainer.vue'
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'
import AppNavbar from './AppNavbar.vue'

</script>

<template>
  <AppContainer>
    <AppHeader />
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
      class="text-[#a4a4a4] text-center text-[13px] md:text-[16px] normal-case"
    >
      Powered by oooo.money
    </p>
    <AppFooter />
  </AppContainer>
</template>

<style lang="scss" scoped>

</style>
