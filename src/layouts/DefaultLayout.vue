<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <header class="bg-card shadow border-b border-border">
      <nav class="container mx-auto px-6 py-3">
        <div class="flex justify-between items-center">
          <RouterLink to="/" class="text-xl font-semibold">VASA Saloon</RouterLink>
          <div>
            <RouterLink to="/" class="px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground">Home</RouterLink>
            <RouterLink to="/login" class="px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground">Login
            </RouterLink>
            <RouterLink to="/dashboard" class="px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground">Dashboard
            </RouterLink>
          </div>
        </div>
      </nav>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>