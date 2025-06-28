<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { useAuth } from '@/stores/auth'
import { useTheme } from '@/composables/useTheme'

const route = useRoute()
const authStore = useAuth()
useTheme() // Initialize theme management

const layout = computed(() => {
  if (route.meta.layout === 'App') {
    return AppLayout
  }
  return DefaultLayout
})

// Check authentication status when the app loads
onMounted(() => {
  authStore.checkAuth()
})
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<style scoped></style>
