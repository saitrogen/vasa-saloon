import { supabase } from '@/lib/supabaseClient'
import type { MonthlyRecord } from '@/types'

async function getOrCreateMonthlyRecord(year: number, month: number): Promise<MonthlyRecord> {
  // Check if a record for the given month and year already exists
  const { data: existingRecord, error: fetchError } = await supabase
    .from('monthly_records')
    .select('*')
    .eq('year', year)
    .eq('month', month)
    .single()

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = 0 rows
    console.error('Error fetching monthly record:', fetchError)
    throw fetchError
  }

  if (existingRecord) {
    return existingRecord
  }

  // If no record exists, create a new one
  const { data: newRecord, error: createError } = await supabase
    .from('monthly_records')
    .insert({ year, month, status: 'draft' })
    .select()
    .single()

  if (createError) {
    console.error('Error creating monthly record:', createError)
    throw createError
  }

  if (!newRecord) {
    throw new Error('Failed to create or retrieve monthly record.')
  }

  return newRecord
}

export const monthlyRecordService = {
  getOrCreateMonthlyRecord,
} 