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
      }, {
        path: 'o-voucher',
        name: 'o-voucher',
        component: async () => await import('@/pages/o-voucher/index.vue')
      }
    ]
  }, {
    path: '/goooo/:pathMatch(.*)*',
    redirect: (to) => {
      const pathMatch = typeof to.params.pathMatch === 'string' ? to.params.pathMatch : to.params.pathMatch.join('/')
      return pathMatch !== '' ? `/quest/${pathMatch}` : '/quest'
    }
  }, {
    path: '/quest/callback/twitter',
    name: 'CallbackTwitter',
    component: async () => await import('@/pages/quest/callback/twitter.vue')
  }, {
    path: '/quest/callback/discord',
    name: 'CallbackDiscord',
    component: async () => await import('@/pages/quest/callback/discord.vue')
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
    path: '/quest',
    name: 'quest',
    component: async () => await import('@/pages/quest/index.vue'),
    meta: {
      fullscreen: true
    }
  })
}

export const WHITE_LIST = ['bridge', 'binance-pay', 'quest', 'o-voucher']

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
