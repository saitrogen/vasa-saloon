import { supabase } from '@/lib/supabaseClient'
import type { Salary } from '@/types'

type SalaryPayload = Omit<Salary, 'id'>

async function upsertSalaries(salaries: SalaryPayload[]): Promise<Salary[]> {
  const { data, error } = await supabase
    .from('salaries')
    .upsert(salaries, {
      onConflict: 'monthly_record_id, staff_id',
      ignoreDuplicates: false,
    })
    .select()

  if (error) {
    console.error('Error upserting salaries:', error)
    throw error
  }
  return data
}

export const salaryService = {
  upsertSalaries,
} 