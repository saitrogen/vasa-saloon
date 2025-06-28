<script setup lang="ts">
import { RouterView, RouterLink, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/composables/useAuth'
import ThemeToggle from '@/components/ThemeToggle.vue'

const { logout } = useAuth()
const router = useRouter()

const handleLogout = async () => {
  await logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="flex h-screen bg-background text-foreground">
    <!-- Sidebar -->
    <aside class="w-64 bg-card border-r border-border">
      <div class="px-6 py-4">
        <RouterLink to="/dashboard" class="text-2xl font-bold">VASA Saloon</RouterLink>
      </div>
      <nav class="mt-6">
        <RouterLink to="/dashboard"
          class="flex items-center px-6 py-2 mt-4 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
          Dashboard
        </RouterLink>
        <RouterLink to="/collections"
          class="flex items-center px-6 py-2 mt-4 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
          Daily Collections
        </RouterLink>
        <RouterLink to="/expenses"
          class="flex items-center px-6 py-2 mt-4 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
          Expenses
        </RouterLink>
        <RouterLink to="/payroll"
          class="flex items-center px-6 py-2 mt-4 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
          Payroll
        </RouterLink>
        <RouterLink to="/summary"
          class="flex items-center px-6 py-2 mt-4 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
          Summary
        </RouterLink>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="flex justify-between items-center p-4 bg-card border-b border-border">
        <div>
          <!-- Placeholder for breadcrumbs or page title -->
          <h1 class="text-xl font-semibold">Dashboard</h1>
        </div>
        <div class="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="outline" @click="handleLogout">Logout</Button>
        </div>
      </header>
      <main class="flex-1 overflow-hidden bg-background">
        <RouterView />
      </main>
    </div>
  </div>
</template>