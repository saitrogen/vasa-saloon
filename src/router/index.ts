import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
    }
  ]
})

// Navigation guard to protect authenticated routes
router.beforeEach((to, from, next) => {
  // This is a placeholder. We will replace it with a real Supabase auth check later.
  const isAuthenticated = false 

  // If the route requires authentication and the user is not logged in
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    // Redirect to the login page
    next({ name: 'login' })
  } else {
    // Otherwise, allow the user to proceed
    next()
  }
})

export default router
 