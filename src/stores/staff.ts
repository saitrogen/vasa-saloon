import { defineStore } from 'pinia'
import { ref } from 'vue'
import { staffService } from '@/services/staffService'
import type { Staff } from '@/types'

export const useStaffStore = defineStore('staff', () => {
  const staffList = ref<Staff[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function fetchAllStaff() {
    loading.value = true
    error.value = null
    try {
      staffList.value = await staffService.getAllStaff()
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  return {
    staffList,
    loading,
    error,
    fetchAllStaff
  }
}) 