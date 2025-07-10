<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSalaryStore } from '@/stores/salary'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectLabel } from '@/components/ui/select'

const salaryStore = useSalaryStore()
const { salaries, loading } = storeToRefs(salaryStore)

const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)
const months = [
  { value: 0, label: 'January' },
  { value: 1, label: 'February' },
  { value: 2, label: 'March' },
  { value: 3, label: 'April' },
  { value: 4, label: 'May' },
  { value: 5, label: 'June' },
  { value: 6, label: 'July' },
  { value: 7, label: 'August' },
  { value: 8, label: 'September' },
  { value: 9, 'label': 'October' },
  { value: 10, label: 'November' },
  { value: 11, label: 'December' },
]

const selectedYear = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth())

watch([selectedYear, selectedMonth], () => {
  salaryStore.fetchSalaries(selectedYear.value, selectedMonth.value + 1)
}, { immediate: true })

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 2,
  }).format(value)
}
</script>

<template>
  <div class="p-2 sm:p-4 md:p-6 space-y-4 md:space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
      <h1 class="text-xl md:text-3xl font-bold tracking-tight">Payroll</h1>
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-4">
        <Select v-model="selectedMonth">
          <SelectTrigger class="w-full sm:w-[140px] h-9 text-sm">
            <SelectValue placeholder="Select a month" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Months</SelectLabel>
              <SelectItem v-for="month in months" :key="month.value" :value="month.value">
                {{ month.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select v-model="selectedYear">
          <SelectTrigger class="w-full sm:w-[110px] h-9 text-sm">
            <SelectValue placeholder="Select a year" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Years</SelectLabel>
              <SelectItem v-for="year in years" :key="year" :value="year">
                {{ year }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Mobile Card/List View -->
    <div class="w-full md:hidden space-y-3 mt-6">
      <h2 class="text-lg font-bold mb-2">Payroll for {{ months[selectedMonth].label }} {{ selectedYear }}</h2>
      <div v-if="loading" class="text-center h-24 flex items-center justify-center">Loading payroll...</div>
      <div v-else-if="!salaries.length" class="text-center h-24 flex items-center justify-center">No salary data found for this month.</div>
      <div v-else>
        <div v-for="salary in salaries" :key="salary.id" class="rounded-lg border p-3 bg-background flex flex-col gap-1">
          <div class="flex justify-between items-center mb-1">
            <span class="text-sm font-medium">{{ salary.staff?.name || 'N/A' }}</span>
            <span class="text-xs text-muted-foreground">Full: {{ formatCurrency(salary.full_amount) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="font-medium text-xs">Salary (50%)</span>
            <span class="font-bold">{{ formatCurrency(salary.half_amount) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop Table View -->
    <div class="border rounded-lg hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Staff Name</TableHead>
            <TableHead class="text-right">Total Collection (Full Amount)</TableHead>
            <TableHead class="text-right">Salary (50%)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="loading">
            <TableRow>
              <TableCell colspan="3" class="text-center h-24">Loading payroll...</TableCell>
            </TableRow>
          </template>
          <template v-else-if="salaries.length === 0">
            <TableRow>
              <TableCell colspan="3" class="text-center h-24">No salary data found for this month.</TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow v-for="salary in salaries" :key="salary.id">
              <TableCell>{{ salary.staff?.name || 'N/A' }}</TableCell>
              <TableCell class="text-right">{{ formatCurrency(salary.full_amount) }}</TableCell>
              <TableCell class="text-right font-bold">{{ formatCurrency(salary.half_amount) }}</TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>
  </div>
</template>