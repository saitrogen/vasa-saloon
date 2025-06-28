<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AppLayout from '@/layouts/AppLayout.vue'

const route = useRoute()

const layout = computed(() => {
  if (route.meta.layout === 'App') {
    return AppLayout
  }
  return DefaultLayout
})
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<style scoped></style>
