import { supabase } from '@/lib/supabaseClient'
import { startOfMonth, endOfMonth, formatISO } from 'date-fns'
import type { Expense, ExpenseCategory } from '@/types'

// == Category Functions ==

async function getAllCategories(): Promise<ExpenseCategory[]> {
  const { data, error } = await supabase
    .from('expense_categories')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching expense categories:', error)
    throw error
  }
  return data || []
}


// == Expense Functions ==

async function getExpensesByMonth(year: number, month: number): Promise<Expense[]> {
  const startDate = formatISO(startOfMonth(new Date(year, month)), { representation: 'date' })
  const endDate = formatISO(endOfMonth(new Date(year, month)), { representation: 'date' })

  const { data, error } = await supabase
    .from('expenses')
    .select('*, expense_categories ( name )')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching expenses:', error)
    throw error
  }
  return data as any[] || []
}

async function createExpense(expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Promise<Expense> {
  const { data, error } = await supabase
    .from('expenses')
    .insert(expense)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating expense:', error)
    throw error
  }
  return data
}

export const expenseService = {
  getAllCategories,
  getExpensesByMonth,
  createExpense,
} 