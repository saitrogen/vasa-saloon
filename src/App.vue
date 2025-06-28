<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { useAuth } from '@/composables/useAuth'
import { supabase } from '@/lib/supabaseClient'
import { useTheme } from '@/composables/useTheme'

const route = useRoute()
const { setUser, setSession } = useAuth()
useTheme() // Initialize theme management

const layout = computed(() => {
  if (route.meta.layout === 'App') {
    return AppLayout
  }
  return DefaultLayout
})

// Listen for auth state changes
onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    setSession(data.session)
    setUser(data.session?.user ?? null)
  })

  supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session)
    setUser(session?.user ?? null)
  })
})
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<style scoped></style>
