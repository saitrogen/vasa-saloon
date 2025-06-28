import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

export const useAuth = () => {
  const authStore = useAuthStore()

  const { user, isAuthenticated } = storeToRefs(authStore)
  const { login, logout, setUser, setSession } = authStore

  return {
    // State
    user,
    isAuthenticated,

    // Actions
    login,
    logout,
    setUser,
    setSession
  }
} 