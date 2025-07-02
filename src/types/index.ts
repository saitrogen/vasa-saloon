export interface Staff {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  hire_date: string; // Using string to represent date from DB
  role: 'admin' | 'manager' | 'staff';
  is_active: boolean;
  is_trackable: boolean;
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

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string
  monthly_record_id: string
  category_id: string
  date: string // YYYY-MM-DD
  description?: string
  amount: number
  created_by: string // staff.id
  created_at: string
  updated_at: string
  expense_categories: { name: string } | null
}

export type NewExpense = Omit<Expense, 'id' | 'created_at' | 'updated_at' | 'expense_categories'>

export interface MonthlyRecord {
  id: string
  year: number
  month: number
  status: 'draft' | 'completed' | 'locked'
  created_at: string
  updated_at: string
}

export interface Salary {
  id: string;
  monthly_record_id: string;
  staff_id: string;
  full_amount: number;
  half_amount: number;
}

export interface ProductSale {
  id: string;
  monthly_record_id: string;
  name: string;
  description?: string;
  amount: number;
  date: string; // YYYY-MM-DD
  created_at: string;
  updated_at: string;
}
