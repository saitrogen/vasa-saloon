export interface Staff {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  hire_date: string; // Using string to represent date from DB
  role: 'admin' | 'manager' | 'staff';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DailyCollection {
  id: string;
  monthly_record_id: string;
  date: string; // YYYY-MM-DD
  staff_id: string;
  amount: number;
  created_at: string;
  updated_at: string;
} 