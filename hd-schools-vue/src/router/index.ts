import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: {
      title: '数据概览',
      icon: 'DataBoard'
    }
  },
  {
    path: '/admission',
    name: 'admission',
    component: () => import('../views/AdmissionView.vue'),
    meta: {
      title: '招生咨询',
      icon: 'UserFilled'
    }
  },
  {
    path: '/admission-ai',
    name: 'admissionAI',
    component: () => import('../views/AdmissionAI.vue'),
    meta: {
      title: 'AI智能咨询',
      icon: 'Robot'
    }
  },
  {
    path: '/communication',
    name: 'communication',
    component: () => import('../views/CommunicationView.vue'),
    meta: {
      title: '家校沟通',
      icon: 'ChatDotRound'
    }
  },
  {
    path: '/academic',
    name: 'academic',
    component: () => import('../views/AcademicView.vue'),
    meta: {
      title: '学业反馈',
      icon: 'TrendCharts'
    }
  },
  {
    path: '/guidance',
    name: 'guidance',
    component: () => import('../views/GuidanceView.vue'),
    meta: {
      title: '升学指导',
      icon: 'Guide'
    }
  },
  {
    path: '/teacher-dashboard',
    name: 'teacherDashboard',
    component: () => import('../views/TeacherDashboard/index-collaborative.vue'),
    meta: {
      title: '教师工作台',
      icon: 'Monitor',
      requiresAuth: true
    }
  },
  {
    path: '/teacher-dashboard-simple',
    name: 'teacherDashboardSimple',
    component: () => import('../views/TeacherDashboard/index-simple.vue'),
    meta: {
      title: '教师工作台（简化版）',
      icon: 'Monitor',
      requiresAuth: true
    }
  },
  {
    path: '/teacher-dashboard-full',
    name: 'teacherDashboardFull',
    component: () => import('../views/TeacherDashboard/index.vue'),
    meta: {
      title: '教师工作台（完整版）',
      icon: 'Monitor',
      requiresAuth: true
    },
    redirect: '/teacher-dashboard-full/overview',
    children: [
      {
        path: 'overview',
        name: 'TeacherDashboardFullOverview',
        component: () => import('../views/TeacherDashboard/components/DashboardOverview.vue'),
        meta: {
          title: '工作概览'
        }
      },
      {
        path: 'students',
        name: 'TeacherDashboardFullStudents',
        component: () => import('../views/TeacherDashboard/components/StudentList.vue'),
        meta: {
          title: '学生管理'
        }
      },
      {
        path: 'pathway',
        name: 'TeacherDashboardFullPathway',
        component: () => import('../views/TeacherDashboard/components/PathwayManagement.vue'),
        meta: {
          title: '升学路径'
        }
      },
      {
        path: 'milestones',
        name: 'TeacherDashboardFullMilestones',
        component: () => import('../views/TeacherDashboard/components/MilestoneTracker.vue'),
        meta: {
          title: '里程碑'
        }
      },
      {
        path: 'collaboration',
        name: 'TeacherDashboardFullCollaboration',
        component: () => import('../views/TeacherDashboard/components/CollaborationHub.vue'),
        meta: {
          title: '协同中心'
        }
      },
      {
        path: 'calendar',
        name: 'TeacherDashboardFullCalendar',
        component: () => import('../views/TeacherDashboard/components/CalendarView.vue'),
        meta: {
          title: '日程管理'
        }
      },
      {
        path: 'teacher-invitation',
        name: 'TeacherDashboardFullInvitation',
        component: () => import('../views/TeacherDashboard/components/TeacherInvitation.vue'),
        meta: {
          title: '邀请教师'
        }
      },
      {
        path: 'meetings',
        name: 'TeacherDashboardFullMeetings',
        component: () => import('../views/TeacherDashboard/components/MeetingManagement.vue'),
        meta: {
          title: '会议管理'
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
    meta: {
      title: '页面未找到'
    }
  }
]

const router = createRouter({
  history: createWebHistory('/schoolbiportal/'),
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
