import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useCollectionStore } from './collections'
import { useExpenseStore } from './expense'
import { useProductSaleStore } from './productSales'

export const useSummaryStore = defineStore('summary', () => {
  const collectionStore = useCollectionStore()
  const expenseStore = useExpenseStore()
  const productSaleStore = useProductSaleStore()

  const loading = computed(() => collectionStore.loading || expenseStore.loading)
  const error = computed(() => collectionStore.error || expenseStore.error)

  const totalCollection = computed(() => {
    return collectionStore.collections.reduce((sum, item) => sum + item.amount, 0)
  })

  const totalExpenses = computed(() => {
    return expenseStore.expenses.reduce((sum, item) => sum + item.amount, 0)
  })
  
  const productSalesTotal = computed(() => {
    return productSaleStore.sales.reduce((sum, item) => sum + Number(item.amount), 0)
  })

  const totalSalary = computed(() => {
    return totalCollection.value * 0.5
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
    const totalIncome = totalCollection.value + productSalesTotal.value
    const totalDeductions = totalExpenses.value + totalSalary.value
    return totalIncome - totalDeductions
  })

  async function fetchSummaryData(year: number, month: number) {
    // This store now primarily computes based on other stores,
    // so we just need to trigger fetches in other stores.
    // The actual fetch calls are now in the view.
    await Promise.all([
      collectionStore.fetchCollections(year, month),
      expenseStore.fetchExpenses(year, month),
      expenseStore.fetchCategories(),
      productSaleStore.fetchSales(year, month),
    ])
  }

  return {
    loading,
    error,
    totalCollection,
    totalExpenses,
    totalSalary,
    productSalesTotal,
    expensesByCategory,
    finalBalance,
    fetchSummaryData,
  }
}) 