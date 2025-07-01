<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription,  CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const email = ref('') // Default for easier testing
const password = ref('') // Default for easier testing
// const loading = ref(false)
const router = useRouter()
const authStore = useAuth()
const errorMessage = ref<string | null>(null)

const handleLogin = async () => {
  errorMessage.value = null
  try {
    await authStore.login(email.value, password.value)
    router.push({ name: 'dashboard' })
  } catch (error: any) {
    console.error('Login failed:', error)
    errorMessage.value = error.message || 'An unexpected error occurred.'
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl">
          Login
        </CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleLogin">
          <div class="grid gap-4">
            <div class="grid gap-2">
              <Label for="email">Email</Label>
              <Input id="email" v-model="email" type="email" placeholder="m@example.com" required />
            </div>
            <div class="grid gap-2">
              <Label for="password">Password</Label>
              <Input id="password" v-model="password" type="password" required />
            </div>
            <Button type="submit" class="w-full">Login</Button>
            <div v-if="errorMessage" class="text-red-500 text-sm mt-2 text-center">{{ errorMessage }}</div>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>