<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useExpenseStore } from '@/stores/expense'
import { useAuth } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import DatePicker from '@/components/ui/date-picker/DatePicker.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { MoreHorizontal } from 'lucide-vue-next'
import { format} from 'date-fns'
import type { Expense, NewExpense } from '@/types'

const expenseStore = useExpenseStore()
const authStore = useAuth()

const { expenses, categories, loading } = storeToRefs(expenseStore)

const newExpense = ref<{
  date: Date,
  category_id: string,
  description: string,
  amount: number | undefined,
}>({
  date: new Date(),
  category_id: '',
  description: '',
  amount: undefined,
})

const selectedExpense = ref<Expense | null>(null)
const isEditDialogOpen = ref(false)
const isDeleteDialogOpen = ref(false)

// New ref for the edit form to avoid type conflicts
const editFormData = ref<{
  id: string,
  date: string,
  category_id: string,
  description: string,
  amount: number,
}>({
  id: '',
  date: '',
  category_id: '',
  description: '',
  amount: 0,
})

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
const selectedCategoryFilter = ref<string>('all')

watch([selectedYear, selectedMonth], () => {
  expenseStore.fetchExpenses(selectedYear.value, selectedMonth.value)
  selectedCategoryFilter.value = 'all' // Reset filter on month change
}, { immediate: true })

onMounted(() => {
  expenseStore.fetchCategories()
})

const handleAddExpense = async () => {
  if (!newExpense.value.category_id || newExpense.value.amount == null) {
    alert('Please select a category and enter an amount.')
    return
  }
  if (!authStore.staffProfile) {
    alert('User profile not loaded. Cannot add expense.')
    return
  }

  const expenseToSave: NewExpense = {
    category_id: newExpense.value.category_id,
    amount: newExpense.value.amount,
    date: format(newExpense.value.date, 'yyyy-MM-dd'),
    created_by: authStore.staffProfile.id,
    description: newExpense.value.description,
    monthly_record_id: '', // This will be set in the store
  }

  try {
    await expenseStore.addExpense(expenseToSave)
    newExpense.value = {
      date: new Date(),
      category_id: '',
      description: '',
      amount: 0,
    }
    alert('Expense added successfully!')
  } catch (err) {
    alert(`Error adding expense: ${(err as Error).message}`)
  }
}

const openEditDialog = (expense: Expense) => {
  selectedExpense.value = expense
  // Populate the new form data ref
  editFormData.value = {
    id: expense.id,
    date: expense.date, // Already a string in 'yyyy-MM-dd' format
    category_id: expense.category_id,
    description: expense.description || '',
    amount: expense.amount,
  }
  isEditDialogOpen.value = true
}

const handleUpdateExpense = async () => {
  if (!editFormData.value) return

  // The editFormData is now clean and ready for the service
  const { id, ...updates } = editFormData.value

  try {
    await expenseStore.updateExpense(id, updates)
    isEditDialogOpen.value = false
    alert('Expense updated successfully!')
  } catch (err) {
    alert(`Error updating expense: ${(err as Error).message}`)
  }
}

const openDeleteDialog = (expense: Expense) => {
  selectedExpense.value = expense
  isDeleteDialogOpen.value = true
}

const handleDeleteExpense = async () => {
  if (!selectedExpense.value) return
  try {
    await expenseStore.deleteExpense(selectedExpense.value.id)
    isDeleteDialogOpen.value = false
    selectedExpense.value = null
    alert('Expense deleted successfully!')
  } catch (err) {
    alert(`Error deleting expense: ${(err as Error).message}`)
  }
}

const filteredExpenses = computed(() => {
  if (selectedCategoryFilter.value === 'all') {
    return expenses.value
  }
  return expenses.value.filter(e => e.category_id === selectedCategoryFilter.value)
})

const totalExpenses = computed(() => {
  return filteredExpenses.value.reduce((sum, expense) => sum + expense.amount, 0)
})
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold tracking-tight">Expenses</h1>
      <div class="flex items-center space-x-4">
        <Select v-model="selectedCategoryFilter">
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Filter by category..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Category</SelectLabel>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
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
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-if="loading && filteredExpenses.length === 0">
                <TableRow>
                  <TableCell colspan="5" class="text-center h-24">Loading expenses...</TableCell>
                </TableRow>
              </template>
              <template v-else-if="filteredExpenses.length === 0">
                <TableRow>
                  <TableCell colspan="5" class="text-center h-24">No expenses recorded for this month.</TableCell>
                </TableRow>
              </template>
              <template v-else>
                <TableRow v-for="expense in filteredExpenses" :key="expense.id">
                  <TableCell>{{ format(new Date(expense.date), 'yyyy-MM-dd') }}</TableCell>
                  <TableCell>{{ expense.expense_categories?.name || 'N/A' }}</TableCell>
                  <TableCell>{{ expense.description }}</TableCell>
                  <TableCell class="text-right">{{ expense.amount.toFixed(2) }}</TableCell>
                  <TableCell class="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <Button variant="ghost" class="h-8 w-8 p-0">
                          <span class="sr-only">Open menu</span>
                          <MoreHorizontal class="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem @click="openEditDialog(expense)">Edit</DropdownMenuItem>
                        <DropdownMenuItem @click="openDeleteDialog(expense)" class="text-red-600">Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
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

    <!-- Edit Expense Dialog -->
    <Dialog :open="isEditDialogOpen" @update:open="isEditDialogOpen = $event">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
          <DialogDescription>
            Make changes to your expense here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="space-y-2">
            <Label for="edit-date">Date</Label>
            <DatePicker id="edit-date" :model-value="new Date(editFormData.date)"
              @update:model-value="val => { if(val)editFormData.date = format(val, 'yyyy-MM-dd') }"/>
          </div>
          <div class="space-y-2">
            <Label for="edit-category">Category</Label>
            <Select id="edit-category" v-model="editFormData.category_id">
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  <SelectItem v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <Label for="edit-description">Description</Label>
            <Input id="edit-description" v-model="editFormData.description" placeholder="e.g., Office supplies" />
          </div>
          <div class="space-y-2">
            <Label for="edit-amount">Amount</Label>
            <Input id="edit-amount" type="number" v-model.number="editFormData.amount" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose as-child>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button @click="handleUpdateExpense">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <AlertDialog :open="isDeleteDialogOpen" @update:open="isDeleteDialogOpen = $event">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the expense record from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction @click="handleDeleteExpense" :disabled="loading" class="bg-red-600 hover:bg-red-700">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

  </div>
</template>