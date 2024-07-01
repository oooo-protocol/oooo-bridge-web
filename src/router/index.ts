import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Layout from '@/components/layout/Layout.vue'
import { useWallet } from '@/composables/hooks/use-wallet'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layout',
    component: Layout,
    children: [
      {
        path: '',
        name: 'bridge',
        component: async () => await import('@/pages/bridge/index.vue')
      }, {
        path: '/bridge/history',
        name: 'bridge-history',
        component: async () => await import('@/pages/bridge/history.vue')
      }, {
        path: '/transaction/:chain/:hash',
        name: 'transaction-detail',
        component: async () => await import('@/pages/bridge/transaction-detail.vue'),
        props: true
      }
    ]
  }, {
    path: '/goooo/callback/twitter',
    name: 'CallbackTwitter',
    component: async () => await import('@/pages/goooo-points/callback/twitter.vue')
  }, {
    path: '/goooo/callback/discord',
    name: 'CallbackDiscord',
    component: async () => await import('@/pages/goooo-points/callback/discord.vue')
  }, {
    path: '/binance-pay',
    name: 'binance-pay',
    component: async () => await import('@/pages/bridge/binance-pay.vue'),
    props: true
  }, {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

if (import.meta.env.VITE_MODE === 'dev' || import.meta.env.VITE_MODE === 'livenet') {
  router.addRoute('layout', {
    path: '/goooo',
    name: 'goooo',
    component: async () => await import('@/pages/goooo-points/index.vue')
  })
}

export const WHITE_LIST = ['bridge', 'binance-pay', 'goooo']

router.beforeEach((to, from, next) => {
  const { address } = useWallet()

  if (address.value != null) {
    next()
    return
  } else if (WHITE_LIST.includes(to.name as string)) {
    next()
    return
  }
  next({ name: 'bridge', replace: true })
})

export default router
