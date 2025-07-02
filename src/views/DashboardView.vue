<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSummaryStore } from '@/stores/summary'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const summaryStore = useSummaryStore()
const {
  totalCollection,
  totalExpenses,
  finalBalance,
  loading,
} = storeToRefs(summaryStore)

onMounted(() => {
  const now = new Date()
  summaryStore.fetchSummaryData(now.getFullYear(), now.getMonth())
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 2,
  }).format(value)
}
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
    </div>

    <div v-if="loading" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card v-for="i in 3" :key="i">
        <CardHeader>
          <Skeleton class="h-6 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton class="h-8 w-1/2" />
        </CardContent>
      </Card>
    </div>

    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Collection</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-3xl font-bold text-green-500">{{ formatCurrency(totalCollection) }}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-3xl font-bold text-red-500">{{ formatCurrency(totalExpenses) }}</p>
        </CardContent>
      </Card>
      <Card :class="finalBalance >= 0 ? 'border-green-500' : 'border-red-500'">
        <CardHeader>
          <CardTitle>Final Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-3xl font-bold" :class="finalBalance >= 0 ? 'text-green-500' : 'text-red-500'">
            {{ formatCurrency(finalBalance) }}
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>