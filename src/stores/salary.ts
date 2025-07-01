import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'

import type { Salary } from '@/types'
import { monthlyRecordService } from '@/services/monthlyRecordService'

interface SalaryWithStaff extends Salary {
  staff: { name: string } | null
}

export const useSalaryStore = defineStore('salary', () => {
  const salaries = ref<SalaryWithStaff[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function fetchSalaries(year: number, month: number) {
    loading.value = true
    error.value = null
    try {
      const monthlyRecord = await monthlyRecordService.getOrCreateMonthlyRecord(year, month)
      if (!monthlyRecord) {
        salaries.value = []
        return
      }

      const { data, error: fetchError } = await supabase
        .from('salaries')
        .select('*, staff:staff_id ( name )')
        .eq('monthly_record_id', monthlyRecord.id)

      if (fetchError) throw fetchError

      salaries.value = data || []
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  return {
    salaries,
    loading,
    error,
    fetchSalaries,
  }
}) 