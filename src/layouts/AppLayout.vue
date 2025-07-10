<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/stores/auth'
import ThemeToggle from '@/components/ThemeToggle.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

const router = useRouter()
const authStore = useAuth()

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push({ name: 'login' })
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<template>
  <!-- Sidebar -->
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header
        class="flex h-14 md:h-16 shrink-0 items-center gap-2 px-2 sm:px-4 shadow-sm z-20 bg-background sticky top-0">
        <SidebarTrigger
          class="-ml-1 md:hidden flex items-center justify-center h-10 w-10 rounded hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary" />
        <div class="flex-1 flex items-center gap-2">
          <h1 class="text-lg md:text-xl font-semibold">Dashboard</h1>
        </div>
        <div class="flex items-center gap-2 md:gap-4">
          <ThemeToggle />
          <Button @click="handleLogout" variant="outline" class="h-9 px-3 text-sm">Logout</Button>
        </div>
      </header>
      <main class="flex-1 min-h-0 overflow-y-auto bg-background">
        <RouterView />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>