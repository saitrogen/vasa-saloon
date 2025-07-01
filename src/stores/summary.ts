import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCollectionStore } from './collections'
import { useExpenseStore } from './expense'
import { useSalaryStore } from './salary'
import type { ExpenseCategory } from '@/types'

export const useSummaryStore = defineStore('summary', () => {
  const collectionStore = useCollectionStore()
  const expenseStore = useExpenseStore()
  const salaryStore = useSalaryStore()

  const loading = ref(false)
  const error = ref<Error | null>(null)
  const productSales = ref(0)

  const totalCollection = computed(() => {
    return collectionStore.collections.reduce((sum, item) => sum + item.amount, 0)
  })

  const totalExpenses = computed(() => {
    return expenseStore.expenses.reduce((sum, item) => sum + item.amount, 0)
  })

  const totalSalary = computed(() => {
    return salaryStore.salaries.reduce((sum, item) => sum + item.half_amount, 0)
  })

  const expensesByCategory = computed(() => {
    const categoryMap: { [key: string]: { name: string, total: number } } = {}

    for (const expense of expenseStore.expenses) {
      const category = expenseStore.categories.find(c => c.id === expense.category_id)
      const categoryName = category ? category.name : 'Uncategorized'

      if (!categoryMap[expense.category_id]) {
        categoryMap[expense.category_id] = { name: categoryName, total: 0 }
      }
      categoryMap[expense.category_id].total += expense.amount
    }

    return Object.values(categoryMap).sort((a, b) => b.total - a.total)
  })

  const finalBalance = computed(() => {
    const totalIncome = totalCollection.value + productSales.value
    const totalDeductions = totalExpenses.value + totalSalary.value
    return totalIncome - totalDeductions
  })

  async function fetchSummaryData(year: number, month: number) {
    loading.value = true
    error.value = null
    productSales.value = 0
    try {
      await Promise.all([
        collectionStore.fetchCollections(year, month),
        expenseStore.fetchExpenses(year, month),
        expenseStore.fetchCategories(),
        salaryStore.fetchSalaries(year, month),
      ])
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    totalCollection,
    totalExpenses,
    totalSalary,
    productSales,
    expensesByCategory,
    finalBalance,
    fetchSummaryData,
  }
}) 