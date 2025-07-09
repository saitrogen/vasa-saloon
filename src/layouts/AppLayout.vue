<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/stores/auth'
import ThemeToggle from '@/components/ThemeToggle.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { Menu } from 'lucide-vue-next'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

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
  <div class="flex min-h-screen w-full">
    <!-- Desktop Sidebar: shown on lg screens and up -->
    <div class="hidden lg:block border-r bg-background">
      <AppSidebar />
    </div>

    <!-- Main Content -->
    <div class="flex flex-1 flex-col">
      <!-- Header -->
      <header class="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <div class="flex items-center gap-4">
            <!-- Mobile Sidebar: Hamburger menu shown on screens smaller than lg -->
            <Sheet>
                <SheetTrigger as-child>
                    <Button variant="outline" size="icon" class="lg:hidden">
                        <Menu class="h-6 w-6" />
                        <span class="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" class="p-0">
                    <AppSidebar />
                </SheetContent>
            </Sheet>
            <h1 class="text-xl font-semibold">Dashboard</h1>
        </div>

        <div class="flex items-center gap-4">
          <ThemeToggle />
          <Button @click="handleLogout" variant="outline">Logout</Button>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-4 sm:px-6 sm:py-4">
        <RouterView />
      </main>
    </div>
  </div>
</template>
