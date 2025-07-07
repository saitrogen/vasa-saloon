import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (LoginView.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: LoginView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true, layout: 'App' }
    },
    {
      path: '/collections',
      name: 'collections',
      component: () => import('../views/CollectionsView.vue'),
      meta: { requiresAuth: true, layout: 'App' }
    },
    {
      path: '/expenses',
      name: 'expenses',
      component: () => import('../views/ExpensesView.vue'),
      meta: { requiresAuth: true, layout: 'App' }
    },
    {
      path: '/summary',
      name: 'summary',
      component: () => import('../views/SummaryView.vue'),
      meta: { requiresAuth: true, layout: 'App' }
    },
    {
      path: '/payroll',
      name: 'payroll',
      component: () => import('../views/PayrollView.vue'),
      meta: { requiresAuth: true, layout: 'App' }
    },
    {
      path: '/sales',
      name: 'sales',
      component: () => import('../views/SalesView.vue'),
      meta: { requiresAuth: true, layout: 'App' }
    }
  ]
})

// Navigation guard to protect authenticated routes
router.beforeEach((to, _from, next) => {
  // We need to ensure the auth store is initialized before we can use it.
  // This is a bit tricky outside of a component setup.
  // For now, we assume it's initialized by App.vue
  // A more robust solution might involve a plugin or initializing the store here.
  const authStore = useAuth()
  const isLoggedIn = authStore.isLoggedIn

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !isLoggedIn) {
    // If route requires auth and user is not logged in, redirect to login
    next({ name: 'login' })
  } else if (to.name === 'login' && isLoggedIn) {
    // If user is logged in and tries to access login page, redirect to dashboard
    next({ name: 'dashboard' })
  } else {
    // Otherwise, proceed
    next()
  }
})

export default router
 