import { supabase } from '@/lib/supabaseClient'
import type { Staff } from '@/types'

export const staffService = {
  async getAllStaff(): Promise<Staff[]> {
    const { data, error } = await supabase
      .from('staff')
      .select('*')

    if (error) {
      console.error('Error fetching staff:', error)
      throw error
    }
    return data || []
  },

  async getStaffById(id: string): Promise<Staff | null> {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error(`Error fetching staff with id ${id}:`, error)
      throw error
    }
    return data
  },

  async updateStaff(id: string, updates: Partial<Staff>): Promise<Staff | null> {
    const { data, error } = await supabase
      .from('staff')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating staff with id ${id}:`, error)
      throw error
    }
    return data
  },

  // Note: Create and Delete operations will be added in a later phase
  // as they involve more complex logic (e.g., creating auth users).
} 