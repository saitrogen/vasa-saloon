import { defineStore } from 'pinia'
import { ref } from 'vue'
import { collectionService } from '@/services/collectionService'
import { monthlyRecordService } from '@/services/monthlyRecordService'
import { salaryService } from '@/services/salaryService'
import { useStaffStore } from '@/stores/staff'
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

      if (recordsToSave.length > 0) {
         await collectionService.saveCollections(recordsToSave)
      }

      // --- New Salary Calculation Step ---
      const staffStore = useStaffStore()
      // Ensure staff list is available
      if (staffStore.staffList.length === 0) {
        await staffStore.fetchAllStaff()
      }
      const staffList = staffStore.staffList

      // Fetch all collections for the month to ensure we have the full picture
      const allMonthCollections = await collectionService.getCollectionsByMonth(year, month-1)
      
      const salariesToUpsert = staffList.map(staff => {
        const staffCollections = allMonthCollections.filter(c => c.staff_id === staff.id)
        const full_amount = staffCollections.reduce((sum, c) => sum + Number(c.amount), 0)
        const half_amount = full_amount * 0.5

        return {
          monthly_record_id: monthlyRecord.id,
          staff_id: staff.id,
          full_amount,
          half_amount,
        }
      })

      await salaryService.upsertSalaries(salariesToUpsert)
      // --- End of New Step ---

      // After saving, refresh the local data to get the latest state
      await fetchCollections(year, month - 1)
      console.log('Successfully saved collections and updated salaries.')

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