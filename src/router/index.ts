import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { supabase } from '@/lib/supabaseClient'

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
      component: () => import('../views/LoginView.vue')
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
    }
  ]
})

// Navigation guard to protect authenticated routes
router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !session) {
    // If route requires auth and there is no session, redirect to login
    next({ name: 'login' })
  } else if (!requiresAuth && session && to.name === 'login') {
    // If user is logged in and tries to access login page, redirect to dashboard
    next({ name: 'dashboard'})
  }
  else {
    // Otherwise, proceed
    next()
  }
})

export default router
 