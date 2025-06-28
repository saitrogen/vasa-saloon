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

async function saveCollections(collections: Omit<DailyCollection, 'id' | 'created_at' | 'updated_at' | 'monthly_record_id'>[], year: number, month: number): Promise<DailyCollection[]> {
  // This is a placeholder for now. We need to get or create a monthly_record_id
  const monthlyRecordId = '00000000-0000-0000-0000-000000000000' // FIXME

  const recordsToUpsert = collections.map(c => ({
    ...c,
    monthly_record_id: monthlyRecordId,
    date: formatISO(new Date(year, month, c.date as any), { representation: 'date' })
  }))

  const { data, error } = await supabase
    .from('daily_collections')
    .upsert(recordsToUpsert, { onConflict: 'date, staff_id' })
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