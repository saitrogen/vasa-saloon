import { supabase } from '@/lib/supabaseClient'
import type { ProductSale } from '@/types'
import { startOfMonth, endOfMonth, formatISO } from 'date-fns'

async function getSalesByMonth(year: number, month: number): Promise<ProductSale[]> {
  const startDate = formatISO(startOfMonth(new Date(year, month)), { representation: 'date' })
  const endDate = formatISO(endOfMonth(new Date(year, month)), { representation: 'date' })

  const { data, error } = await supabase
    .from('product_sales')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching product sales:', error)
    throw error
  }
  return data || []
}

async function addSale(sale: Omit<ProductSale, 'id' | 'created_at' | 'updated_at'>): Promise<ProductSale> {
  const { data, error } = await supabase
    .from('product_sales')
    .insert(sale)
    .select()
    .single()

  if (error) {
    console.error('Error adding product sale:', error)
    throw error
  }
  return data
}

async function updateSale(id: string, updates: Partial<ProductSale>): Promise<ProductSale> {
  const { data, error } = await supabase
    .from('product_sales')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[productSaleService] Error updating product sale:', error)
    throw error
  }
  return data
}

async function deleteSale(id: string): Promise<void> {
  const { error } = await supabase
    .from('product_sales')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting product sale:', error)
    throw error
  }
}

export const productSaleService = {
  getSalesByMonth,
  addSale,
  updateSale,
  deleteSale,
} 