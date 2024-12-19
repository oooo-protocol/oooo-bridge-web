import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Layout from '@/components/layout/Layout.vue'
import { useWallet } from '@/composables/hooks/use-wallet'

/**
 * 自定义 meta 元数据
 * - auth: 是否需要登录才可访问
 * - fullscreen: 是否全屏样式展示
 */
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
        component: async () => await import('@/pages/bridge/history.vue'),
        meta: {
          auth: true
        }
      }, {
        path: '/transaction/:chain/:hash',
        name: 'transaction-detail',
        component: async () => await import('@/pages/bridge/transaction-detail.vue'),
        meta: {
          auth: true
        },
        props: true
      }, {
        path: '/o-voucher',
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
    name: 'callback-twitter',
    component: async () => await import('@/pages/quest/callback/twitter.vue')
  }, {
    path: '/:page/callback/discord',
    name: 'callback-discord',
    component: async () => await import('@/pages/callback/discord.vue')
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
  router.addRoute('layout', {
    path: '/badges',
    name: 'badges',
    component: async () => await import('@/pages/badge/index.vue'),
    meta: {
      fullscreen: true
    }
  })
}

router.beforeEach((to, from, next) => {
  const { address } = useWallet()

  if (address.value != null) {
    next()
    return
  } else if (to.meta.auth !== true) {
    next()
    return
  }
  next({ name: 'bridge', replace: true })
})

export default router
