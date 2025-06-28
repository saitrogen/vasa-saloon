import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { staffService } from '@/services/staffService'
import type { User } from '@supabase/supabase-js'
import type { Staff } from '@/types'

export const useAuth = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const staffProfile = ref<Staff | null>(null)
  const loading = ref(true)

  const isLoggedIn = computed(() => !!user.value)

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    if (data.user) {
      user.value = data.user
      try {
        staffProfile.value = await staffService.getStaffProfileByUserId(data.user.id)
      } catch (err) {
        console.error('Failed to fetch user profile on login:', err)
        staffProfile.value = null
      }
    }
    return data
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    user.value = null
    staffProfile.value = null
  }

  const checkAuth = async () => {
    loading.value = true
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      user.value = session.user
      try {
        staffProfile.value = await staffService.getStaffProfileByUserId(session.user.id)
      } catch (err) {
        console.error('Failed to fetch user profile on auth check:', err)
        staffProfile.value = null
      }
    } else {
      user.value = null
      staffProfile.value = null
    }
    loading.value = false
  }
  
  // This listener will handle auth state changes from other browser tabs or token refreshes
  supabase.auth.onAuthStateChange((event, session) => {
    checkAuth()
  })

  return { user, staffProfile, loading, isLoggedIn, login, logout, checkAuth }
}) 