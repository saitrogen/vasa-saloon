import { defineStore } from 'pinia'
import { ref } from 'vue'
import { collectionService } from '@/services/collectionService'
import { monthlyRecordService } from '@/services/monthlyRecordService'
import type { DailyCollection } from '@/types'
import { formatISO } from 'date-fns'

export const useCollectionStore = defineStore('collections', () => {
  const collections = ref<DailyCollection[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function fetchCollections(year: number, month: number) {
    loading.value = true
    error.value = null
    try {
      collections.value = await collectionService.getCollectionsByMonth(year, month)
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  async function saveCollections(year: number, month: number, collectionsToSave: any[]) {
    loading.value = true
    error.value = null
    try {
      const monthlyRecord = await monthlyRecordService.getOrCreateMonthlyRecord(year, month)

      const recordsToSave = collectionsToSave
        .filter(c => c.amount > 0) // Only save records with an amount
        .map(c => ({
          staff_id: c.staff_id,
          amount: c.amount,
          date: formatISO(new Date(year, month - 1, c.day), { representation: 'date' }),
          monthly_record_id: monthlyRecord.id,
        }))

      if (recordsToSave.length === 0) {
        console.log('No new collection data to save.')
        loading.value = false
        return
      }

      await collectionService.saveCollections(recordsToSave)

      // After saving, refresh the local data to get the latest state
      await fetchCollections(year, month)
      console.log('Successfully saved and refreshed collections.')

    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  return {
    collections,
    loading,
    error,
    fetchCollections,
    saveCollections,
  }
}) 