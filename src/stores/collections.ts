import { defineStore } from 'pinia'
import { ref } from 'vue'
import { collectionService } from '@/services/collectionService'
import type { DailyCollection } from '@/types'

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
      const saved = await collectionService.saveCollections(collectionsToSave, year, month)
      // We can optionally merge the results back into our state
      console.log('Successfully saved:', saved)
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