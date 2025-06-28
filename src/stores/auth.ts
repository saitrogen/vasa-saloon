import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<any>(null) // Replace 'any' with a proper session type later if needed

  const isAuthenticated = computed(() => !!user.value)

  function setUser(newUser: User | null) {
    user.value = newUser
  }

  function setSession(newSession: any) {
    session.value = newSession
  }

  async function login(email: string, password: string): Promise<void> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Error logging in:', error.message)
      throw error
    }

    if (data) {
      setUser(data.user)
      setSession(data.session)
    }
  }

  async function logout(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error logging out:', error.message)
      throw error
    }
    setUser(null)
    setSession(null)
  }

  return {
    user,
    session,
    isAuthenticated,
    setUser,
    setSession,
    login,
    logout,
  }
}) 