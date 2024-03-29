import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import '@/assets/iconfont/iconfont.js'
import '@/assets/index.css'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { initSentry } from './composables/sentry'

const pinia = createPinia()
pinia
  .use(piniaPluginPersistedstate)

const app = createApp(App)

initSentry(app)

app
  .use(router)
  .use(pinia)
  .use(VueQueryPlugin)
  .mount('#app')
