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
  <div class="p-6 space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
      <h1 class="text-3xl font-bold tracking-tight">Payroll</h1>
      <div class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Select v-model="selectedMonth">
          <SelectTrigger class="w-full sm:w-[180px]">
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
          <SelectTrigger class="w-full sm:w-[180px]">
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
    <div class="border rounded-lg overflow-x-auto">
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