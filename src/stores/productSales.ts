import { defineStore } from 'pinia'
import { ref } from 'vue'
import { productSaleService } from '@/services/productSaleService'
import type { ProductSale } from '@/types'

export const useProductSaleStore = defineStore('productSales', () => {
  const sales = ref<ProductSale[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function fetchSales(year: number, month: number) {
    loading.value = true
    error.value = null
    try {
      sales.value = await productSaleService.getSalesByMonth(year, month)
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  async function addSale(sale: Omit<ProductSale, 'id' | 'created_at' | 'updated_at'>) {
    loading.value = true
    error.value = null
    try {
      const newSale = await productSaleService.addSale(sale)
      sales.value.unshift(newSale) // Add to the top of the list
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateSale(id: string, updates: Partial<ProductSale>) {
    loading.value = true
    error.value = null
    try {
      const updatedSale = await productSaleService.updateSale(id, updates)
      const index = sales.value.findIndex(s => s.id === id)
      if (index !== -1) {
        sales.value[index] = updatedSale
      }
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteSale(id: string) {
    loading.value = true
    error.value = null
    try {
      await productSaleService.deleteSale(id)
      sales.value = sales.value.filter(s => s.id !== id)
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    sales,
    loading,
    error,
    fetchSales,
    addSale,
    updateSale,
    deleteSale,
  }
}) 