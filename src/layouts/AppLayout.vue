<script setup lang="ts">
import { RouterView, RouterLink, useRouter } from 'vue-router'
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
      <header class="flex h-16 shrink-0 items-center gap-2 px-4">
        <SidebarTrigger class="-ml-1" />
        <div>
          <h1 class="text-xl font-semibold">Dashboard</h1>
        </div>
        <div class="flex flex-1 justify-end items-center gap-4">
          <ThemeToggle />
          <Button @click="handleLogout" variant="outline">Logout</Button>
        </div>
      </header>
      <!-- 
      <div class="flex h-screen bg-background text-foreground">
        <div class="flex-1 flex flex-col overflow-hidden">
          <header class="flex justify-between items-center p-4 bg-card border-b border-border">
            <div>
              
              <h1 class="text-xl font-semibold">Dashboard</h1>
            </div>
            <div class="flex items-center gap-4">
              <ThemeToggle />
              <Button @click="handleLogout" variant="ghost">Logout</Button>
            </div>
          </header>
          <main class="flex-1 overflow-hidden bg-background">
            
          </main>
        </div>
      </div>
 -->
      <RouterView />
    </SidebarInset>
  </SidebarProvider>


</template>