<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useExpenseStore } from '@/stores/expense'
import { useAuth } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import DatePicker from '@/components/ui/date-picker/DatePicker.vue'
import { format } from 'date-fns'

const expenseStore = useExpenseStore()
const authStore = useAuth()

const { expenses, categories, loading, error } = storeToRefs(expenseStore)

const newExpense = ref({
  date: new Date(),
  category_id: '',
  description: '',
  amount: null,
})

const selectedYear = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth())

onMounted(() => {
  expenseStore.fetchCategories()
  expenseStore.fetchExpenses(selectedYear.value, selectedMonth.value)
})

const handleAddExpense = async () => {
  if (!newExpense.value.category_id || !newExpense.value.amount) {
    alert('Please select a category and enter an amount.')
    return
  }
  if (!authStore.staffProfile) {
    alert('User profile not loaded. Cannot add expense.')
    return
  }

  const expenseToSave: NewExpense = {
    ...newExpense.value,
    date: format(newExpense.value.date, 'yyyy-MM-dd'),
    created_by: authStore.staffProfile.id,
  }

  try {
    await expenseStore.addExpense(expenseToSave)
    // Reset form after successful submission
    newExpense.value = {
      date: new Date(),
      category_id: '',
      description: '',
      amount: null,
    }
    alert('Expense added successfully!')
  } catch (err) {
    // The store now handles the console logging
    alert(`Error adding expense: ${(err as Error).message}`)
  }
}

const totalExpenses = computed(() => {
  return expenses.value.reduce((sum, expense) => sum + expense.amount, 0)
})
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
      <!-- Add Expense Form -->
      <Card class="w-full md:w-1/3">
        <CardHeader>
          <CardTitle>Add New Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <form class="space-y-4" @submit.prevent="handleAddExpense">
            <div class="space-y-2">
              <Label for="date">Date</Label>
              <DatePicker id="date" v-model="newExpense.date" />
            </div>
            <div class="space-y-2">
              <Label for="category">Category</Label>
              <Select v-model="newExpense.category_id">
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent :disable-portaled="true">
                  <SelectGroup>
                    <SelectItem v-for="cat in categories" :key="cat.id" :value="cat.id">
                      {{ cat.name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <Label for="description">Description</Label>
              <Input id="description" v-model="newExpense.description" placeholder="e.g., Water bottles" />
            </div>
            <div class="space-y-2">
              <Label for="amount">Amount</Label>
              <Input id="amount" v-model.number="newExpense.amount" type="number" placeholder="0.00" />
            </div>
            <Button type="submit" class="w-full" :disabled="loading">
              Add Expense
            </Button>
          </form>
        </CardContent>
      </Card>

      <!-- Expenses Table -->
      <div class="w-full md:w-2/3">
        <h2 class="text-2xl font-bold mb-4">Monthly Expenses</h2>
        <div class="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead class="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-if="loading">
                <TableRow>
                  <TableCell colspan="4" class="text-center h-24">Loading expenses...</TableCell>
                </TableRow>
              </template>
              <template v-else-if="expenses.length === 0">
                <TableRow>
                  <TableCell colspan="4" class="text-center h-24">No expenses recorded for this month.</TableCell>
                </TableRow>
              </template>
              <template v-else>
                <TableRow v-for="expense in expenses" :key="expense.id">
                  <TableCell>{{ format(new Date(expense.date), 'yyyy-MM-dd') }}</TableCell>
                  <TableCell>{{ expense.expense_categories?.name || 'N/A' }}</TableCell>
                  <TableCell>{{ expense.description }}</TableCell>
                  <TableCell class="text-right">{{ expense.amount.toFixed(2) }}</TableCell>
                </TableRow>
              </template>
            </TableBody>
          </Table>
        </div>
        <div class="flex justify-end mt-4">
          <p class="text-lg font-bold">Total: {{ totalExpenses.toFixed(2) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>