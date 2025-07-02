import { supabase } from '@/lib/supabaseClient'
import { startOfMonth, endOfMonth, formatISO } from 'date-fns'
import type { DailyCollection } from '@/types'

async function getCollectionsByMonth(year: number, month: number): Promise<DailyCollection[]> {
  const startDate = new Date(year, month, 1).toISOString()
  const endDate = new Date(year, month + 1, 0).toISOString()

  const { data, error } = await supabase
    .from('daily_collections')
    .select('*, staff:staff_id!inner(is_trackable)')
    .gte('date', startDate)
    .lte('date', endDate)
    .eq('staff.is_trackable', true)

  if (error) {
    console.error('Error fetching collections:', error)
    throw error
  }
  return data
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