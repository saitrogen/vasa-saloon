import { defineStore } from 'pinia'
import { ref} from 'vue'
import { expenseService } from '@/services/expenseService'
import { monthlyRecordService } from '@/services/monthlyRecordService'
import type { Expense, ExpenseCategory, NewExpense } from '@/types'

export const useExpenseStore = defineStore('expenses', () => {
  const expenses = ref<Expense[]>([])
  const categories = ref<ExpenseCategory[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchExpenses(year: number, month: number) {
    loading.value = true
    error.value = null
    try {
      expenses.value = await expenseService.getExpensesByMonth(year, month)
    } catch (e) {
      error.value = e as string
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    // No loading state for this as it's a background task
    try {
      categories.value = await expenseService.getAllCategories()
    } catch (e) {
      // Handle error silently or log it
      console.error('Failed to fetch expense categories:', e)
    }
  }
  
  const addExpense = async (expense: NewExpense) => {
    loading.value = true
    error.value = null
    try {
      // Get the year and month from the expense date
      const expenseDate = new Date(expense.date)
      const year = expenseDate.getFullYear()
      const month = expenseDate.getMonth() + 1 // JS months are 0-indexed

      // Get or create the monthly record
      const monthlyRecord = await monthlyRecordService.getOrCreateMonthlyRecord(year, month)

      const expenseToSave: NewExpense = {
        ...expense,
        monthly_record_id: monthlyRecord.id,
      }

      const newExpenseData = await expenseService.createExpense(expenseToSave)
      
      // Manually add category name to avoid re-fetch.
      // The service now returns the joined category name.
      const newExpenseWithCategory = {
        ...newExpenseData,
      }

      expenses.value.push(newExpenseWithCategory)
    } catch (err: any) {
      console.error('Error in store addExpense:', err)
      error.value = err.message || 'Failed to add expense'
      // Re-throw the error if you want the component to handle it as well
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateExpense(id: string, updates: Partial<Expense>) {
    loading.value = true
    error.value = null
    try {
      const updatedExpense = await expenseService.updateExpense(id, updates)
      const index = expenses.value.findIndex(e => e.id === id)
      if (index !== -1) {
        expenses.value[index] = { ...expenses.value[index], ...updatedExpense }
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to update expense'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteExpense(id: string) {
    loading.value = true
    error.value = null
    try {
      await expenseService.deleteExpense(id)
      expenses.value = expenses.value.filter(e => e.id !== id)
    } catch (err: any) {
      error.value = err.message || 'Failed to delete expense'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    expenses,
    categories,
    loading,
    error,
    fetchExpenses,
    fetchCategories,
    addExpense,
    updateExpense,
    deleteExpense,
  }
}) 