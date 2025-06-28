<script setup lang="ts">
import { onMounted, ref, computed, watchEffect } from 'vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useStaffStore } from '@/stores/staff'
import { storeToRefs } from 'pinia'
import { getDaysInMonth } from 'date-fns'

const staffStore = useStaffStore()
const { staffList: staff, loading } = storeToRefs(staffStore)

const collections = ref<Record<number, Record<string, number>>>({})

const years = [2023, 2024, 2025] // Example years
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

const daysInMonth = computed(() => {
  const date = new Date(selectedYear.value, selectedMonth.value)
  return Array.from({ length: getDaysInMonth(date) }, (_, i) => i + 1)
})

const dailyTotals = computed(() => {
  const totals: Record<number, number> = {}
  daysInMonth.value.forEach(day => {
    if (collections.value[day]) {
      totals[day] = Object.values(collections.value[day]).reduce((sum, val) => sum + (Number(val) || 0), 0)
    } else {
      totals[day] = 0
    }
  })
  return totals
})

const staffTotals = computed(() => {
  const totals: Record<string, number> = {}
  if (!staff.value) return totals
  staff.value.forEach(s => {
    let total = 0
    daysInMonth.value.forEach(day => {
      total += Number(collections.value[day]?.[s.id]) || 0
    })
    totals[s.id] = total
  })
  return totals
})

const grandTotal = computed(() => {
  return Object.values(dailyTotals.value).reduce((sum, val) => sum + val, 0)
})

const initializeCollections = () => {
  const newCollections: Record<number, Record<string, number>> = {}
  daysInMonth.value.forEach(day => {
    newCollections[day] = {}
    if (staff.value) {
      staff.value.forEach(s => {
        newCollections[day][s.id] = 0
      })
    }
  })
  collections.value = newCollections
}

watchEffect(() => {
  if (staff.value.length > 0 && daysInMonth.value.length > 0) {
    initializeCollections()
  }
})

onMounted(() => {
  staffStore.fetchAllStaff()
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">
          Daily Collections
        </h2>
        <p class="text-sm text-muted-foreground">
          Here's a list of daily collections for this month.
        </p>
      </div>
      <div class="flex items-center space-x-4">
        <Select v-model="selectedMonth">
          <SelectTrigger class="w-[180px]">
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
          <SelectTrigger class="w-[180px]">
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
    <div class="mt-6">
      <div v-if="loading" class="text-center py-12">
        <p class="text-lg font-semibold">
          Loading staff...
        </p>
        <p class="text-muted-foreground">Please wait a moment.</p>
      </div>
      <Table v-else>
        <TableHeader>
          <TableRow>
            <TableHead class="w-[100px]">
              Date
            </TableHead>
            <TableHead v-for="s in staff" :key="s.id">
              {{ s.name.toUpperCase() }}
            </TableHead>
            <TableHead class="text-right">
              Total
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="day in daysInMonth" :key="day">
            <TableCell>{{ day }}</TableCell>
            <TableCell v-for="s in staff" :key="s.id">
              <Input type="number" class="w-20" v-model="collections[day][s.id]" />
            </TableCell>
            <TableCell class="font-bold text-right">{{ dailyTotals[day] }}</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell class="font-bold">Total</TableCell>
            <TableCell v-for="s in staff" :key="s.id" class="font-bold">
              {{ staffTotals[s.id] }}
            </TableCell>
            <TableCell class="font-bold text-right">
              {{ grandTotal }}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  </div>
</template>