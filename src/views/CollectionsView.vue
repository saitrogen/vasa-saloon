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
import { Button } from '@/components/ui/button'
import { useStaffStore } from '@/stores/staff'
import { useCollectionStore } from '@/stores/collections'
import { storeToRefs } from 'pinia'
import { getDaysInMonth } from 'date-fns'

const staffStore = useStaffStore()
const { staffList: staff, loading: staffLoading } = storeToRefs(staffStore)

const collectionStore = useCollectionStore()
const { collections: fetchedCollections, loading } = storeToRefs(collectionStore)

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

const handleSave = async () => {
  const collectionsToSave = Object.entries(collections.value).flatMap(([day, staffData]) =>
    Object.entries(staffData).map(([staff_id, amount]) => ({
      day: Number(day),
      staff_id,
      amount: Number(amount) || 0,
    }))
  )
  // The store expects a 1-indexed month
  await collectionStore.saveCollections(selectedYear.value, selectedMonth.value + 1, collectionsToSave)
  // Explicitly fetch and re-initialize after save
  await collectionStore.fetchCollections(selectedYear.value, selectedMonth.value)
  initializeCollections()
}

const initializeCollections = () => {
  const newCollections: Record<number, Record<string, number>> = {}
  daysInMonth.value.forEach(day => {
    newCollections[day] = {}
    staff.value.forEach(s => {
      const foundCollection = fetchedCollections.value.find(c => {
        // Timezone-safe date comparison
        const [year, month, cDay] = c.date.split('-').map(Number)
        return year === selectedYear.value && month === (selectedMonth.value + 1) && cDay === day && c.staff_id === s.id
      })
      newCollections[day][s.id] = foundCollection ? foundCollection.amount : 0
    })
  })
  collections.value = newCollections
}

// Effect to fetch data when dependencies change
watchEffect(() => {
  if (staff.value.length > 0) {
    collectionStore.fetchCollections(selectedYear.value, selectedMonth.value)
  }
})

// Effect to rebuild the UI grid when its data changes
watchEffect(() => {
  if (staff.value.length > 0 && daysInMonth.value.length > 0 && fetchedCollections.value) {
    initializeCollections()
  }
})

onMounted(() => {
  staffStore.fetchAllStaff()
})
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Page Header -->
    <div class="p-2 sm:p-4 md:p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
        <div>
          <h2 class="text-xl md:text-3xl font-bold tracking-tight">
            Daily Collections
          </h2>
          <p class="text-xs md:text-sm text-muted-foreground">
            Here's a list of daily collections for this month.
          </p>
        </div>
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
          <Button @click="handleSave" :disabled="loading || staffLoading" class="w-full sm:w-auto h-9 px-3 text-sm">
            Save Collections
          </Button>
        </div>
      </div>
    </div>

    <!-- Mobile Card/List View -->
    <div class="flex-1 px-2 block md:hidden overflow-y-auto">
      <div v-if="loading || staffLoading" class="text-center py-12">
        <p class="text-base font-semibold">Loading data...</p>
        <p class="text-xs text-muted-foreground">Please wait a moment.</p>
      </div>
      <div v-else class="space-y-3">
        <div v-for="day in daysInMonth" :key="day" class="rounded-lg border p-3 bg-background">
          <div class="flex items-center justify-between mb-2">
            <span class="font-semibold">{{ months[selectedMonth].label }} {{ day }}, {{ selectedYear }}</span>
            <span class="text-xs text-muted-foreground">Day {{ day }}</span>
          </div>
          <div class="space-y-2">
            <div v-for="s in staff" :key="s.id" class="flex items-center justify-between">
              <span class="text-sm">{{ s.name }}</span>
              <Input type="number" class="w-20 text-xs" v-model.number="collections[day][s.id]" />
            </div>
          </div>
          <div class="flex justify-between items-center mt-2 pt-2 border-t">
            <span class="font-medium text-xs">Total</span>
            <span class="font-bold">{{ dailyTotals[day] }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop Table View -->
    <div class="flex-1 overflow-y-auto px-2 sm:px-6 hidden md:block">
      <div v-if="loading || staffLoading" class="text-center py-12">
        <p class="text-base md:text-lg font-semibold">
          Loading data...
        </p>
        <p class="text-xs md:text-sm text-muted-foreground">Please wait a moment.</p>
      </div>
      <div v-else class="w-full overflow-x-auto">
        <Table class="min-w-[600px]">
          <TableHeader class="sticky top-0 bg-background">
            <TableRow>
              <TableHead class="w-[80px] md:w-[100px]">Date</TableHead>
              <TableHead v-for="s in staff" :key="s.id">
                {{ s.name.toUpperCase() }}
              </TableHead>
              <TableHead class="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="day in daysInMonth" :key="day">
              <TableCell>{{ day }}</TableCell>
              <TableCell v-for="s in staff" :key="s.id">
                <Input type="number" class="w-16 md:w-20 text-xs md:text-base"
                  v-model.number="collections[day][s.id]" />
              </TableCell>
              <TableCell class="font-bold text-right">{{ dailyTotals[day] }}</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter class="sticky bottom-0 bg-background">
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
  </div>
</template>