<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 10 }, (_, i) => currentYear - i)
const months = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
]

const selectedYear = ref(currentYear)
const selectedMonth = ref(new Date().getMonth() + 1)

</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Daily Collections</h1>
      <div class="flex items-center gap-4">
        <Select v-model="selectedMonth">
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Select a month" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Months</SelectLabel>
              <SelectItem v-for="month in months" :key="month.value" :value="String(month.value)">
                {{ month.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select v-model="selectedYear">
          <SelectTrigger class="w-[120px]">
            <SelectValue placeholder="Select a year" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Years</SelectLabel>
              <SelectItem v-for="year in years" :key="year" :value="String(year)">
                {{ year }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button>Load</Button>
      </div>
    </div>

    <div class="border rounded-lg">
      <Table>
        <TableCaption>A list of daily collections for the selected month.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead class="w-[100px]">Date</TableHead>
            <!-- Staff columns will be generated dynamically here -->
            <TableHead class="text-right">Daily Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <!-- Rows will be generated dynamically here -->
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell class="text-right">0.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>