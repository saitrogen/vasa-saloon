import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
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

      const newExpense = await expenseService.createExpense(expenseToSave)
      expenses.value.push(newExpense)
    } catch (err: any) {
      console.error('Error in store addExpense:', err)
      error.value = err.message || 'Failed to add expense'
      // Re-throw the error if you want the component to handle it as well
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
  }
}) 