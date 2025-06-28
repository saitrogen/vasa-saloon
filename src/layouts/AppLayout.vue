<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r">
      <div class="px-6 py-4">
        <RouterLink to="/dashboard" class="text-2xl font-bold text-gray-800">VASA Saloon</RouterLink>
      </div>
      <nav class="mt-6">
        <RouterLink to="/dashboard" class="flex items-center px-6 py-2 mt-4 text-gray-700 hover:bg-gray-200">
          Dashboard
        </RouterLink>
        <RouterLink to="/collections" class="flex items-center px-6 py-2 mt-4 text-gray-700 hover:bg-gray-200">
          Daily Collections
        </RouterLink>
        <RouterLink to="/expenses" class="flex items-center px-6 py-2 mt-4 text-gray-700 hover:bg-gray-200">
          Expenses
        </RouterLink>
        <RouterLink to="/payroll" class="flex items-center px-6 py-2 mt-4 text-gray-700 hover:bg-gray-200">
          Payroll
        </RouterLink>
        <RouterLink to="/summary" class="flex items-center px-6 py-2 mt-4 text-gray-700 hover:bg-gray-200">
          Summary
        </RouterLink>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="flex justify-between items-center p-4 bg-white border-b">
        <div>
          <!-- Placeholder for breadcrumbs or page title -->
          <h1 class="text-xl font-semibold">Dashboard</h1>
        </div>
        <div>
          <Button variant="outline">Logout</Button>
        </div>
      </header>
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>