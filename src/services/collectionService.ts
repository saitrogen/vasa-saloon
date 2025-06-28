import { supabase } from '@/lib/supabaseClient'
import { startOfMonth, endOfMonth, formatISO } from 'date-fns'
import type { DailyCollection } from '@/types'

async function getCollectionsByMonth(year: number, month: number): Promise<DailyCollection[]> {
  const startDate = formatISO(startOfMonth(new Date(year, month)), { representation: 'date' })
  const endDate = formatISO(endOfMonth(new Date(year, month)), { representation: 'date' })

  const { data, error } = await supabase
    .from('daily_collections')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)

  if (error) {
    console.error('Error fetching collections:', error)
    throw error
  }

  // Supabase may return null even without an error
  return data || []
}

async function saveCollections(collections: Omit<DailyCollection, 'id' | 'created_at' | 'updated_at'>[]): Promise<DailyCollection[]> {

  const { data, error } = await supabase
    .from('daily_collections')
    .upsert(collections, { onConflict: 'monthly_record_id, staff_id, date' })
    .select()

  if (error) {
    console.error('Error saving collections:', error)
    throw error
  }
  return data || []
}

export const collectionService = {
  getCollectionsByMonth,
  saveCollections,
} 