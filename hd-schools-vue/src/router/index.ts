import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: '数据概览',
      icon: 'DataBoard'
    }
  },
  {
    path: '/admission',
    name: 'admission',
    component: () => import('@/views/AdmissionView.vue'),
    meta: {
      title: '招生咨询',
      icon: 'UserFilled'
    }
  },
  {
    path: '/communication',
    name: 'communication',
    component: () => import('@/views/CommunicationView.vue'),
    meta: {
      title: '家校沟通',
      icon: 'ChatDotRound'
    }
  },
  {
    path: '/academic',
    name: 'academic',
    component: () => import('@/views/AcademicView.vue'),
    meta: {
      title: '学业反馈',
      icon: 'TrendCharts'
    }
  },
  {
    path: '/guidance',
    name: 'guidance',
    component: () => import('@/views/GuidanceView.vue'),
    meta: {
      title: '升学指导',
      icon: 'Guide'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: '页面未找到'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 智慧校园门户`
  }
  
  next()
})

router.afterEach((to, from) => {
  // 路由切换后的处理
  console.log(`路由从 ${String(from.name)} 切换到 ${String(to.name)}`)
})

export default router
