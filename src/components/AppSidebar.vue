<script setup lang="ts">
import { GalleryVerticalEnd } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  type SidebarProps,
  // SidebarRail,
} from '@/components/ui/sidebar'

const props = defineProps<SidebarProps>()

const navMain = [
  {
    title: 'Dashboard',
    url: '/dashboard',
  },
  {
    title: 'Daily Collections',
    url: '/collections',
  },
  {
    title: 'Expenses',
    url: '/expenses',
  },
  {
    title: 'Product Sales',
    url: '/sales',
  },
  {
    title: 'Payroll',
    url: '/payroll',
  },
  {
    title: 'Summary',
    url: '/summary',
  },
]
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <RouterLink to="/dashboard">
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd class="size-4" />
              </div>
              <div class="flex flex-col gap-0.5 leading-none">
                <span class="font-medium">VASA Saloon</span>
              </div>
            </RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem v-for="item in navMain" :key="item.title">
            <SidebarMenuButton as-child>
              <RouterLink :to="item.url" class="font-medium">
                {{ item.title }}
              </RouterLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    <!-- <SidebarRail /> -->
  </Sidebar>
</template>
