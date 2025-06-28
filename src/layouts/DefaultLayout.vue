<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <nav class="container mx-auto px-6 py-3">
        <div class="flex justify-between items-center">
          <RouterLink to="/" class="text-xl font-semibold text-gray-700">VASA Saloon</RouterLink>
          <div>
            <RouterLink to="/" class="px-3 py-2 text-gray-700 rounded hover:bg-gray-200">Home</RouterLink>
            <RouterLink to="/login" class="px-3 py-2 text-gray-700 rounded hover:bg-gray-200">Login</RouterLink>
            <RouterLink to="/dashboard" class="px-3 py-2 text-gray-700 rounded hover:bg-gray-200">Dashboard</RouterLink>
          </div>
        </div>
      </nav>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>