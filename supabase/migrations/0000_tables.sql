-- Create the Staff table
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  hire_date DATE NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager', 'staff')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the ExpenseCategory table
CREATE TABLE expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the MonthlyRecord table
CREATE TABLE monthly_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INT NOT NULL,
  month INT NOT NULL,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'locked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(year, month)
);

-- Create the DailyCollection table
CREATE TABLE daily_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monthly_record_id UUID NOT NULL REFERENCES monthly_records(id),
  staff_id UUID NOT NULL REFERENCES staff(id),
  date DATE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  entered_by UUID REFERENCES staff(id),
  entered_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the Expense table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monthly_record_id UUID NOT NULL REFERENCES monthly_records(id),
  category_id UUID NOT NULL REFERENCES expense_categories(id),
  date DATE NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  created_by UUID REFERENCES staff(id)
);

-- Create the Salary table
CREATE TABLE salaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monthly_record_id UUID NOT NULL REFERENCES monthly_records(id),
  staff_id UUID NOT NULL REFERENCES staff(id),
  full_amount DECIMAL(10, 2) NOT NULL,
  half_amount DECIMAL(10, 2) NOT NULL
);

-- Create the Summary table
CREATE TABLE summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monthly_record_id UUID NOT NULL REFERENCES monthly_records(id) UNIQUE,
  total_collection DECIMAL(10, 2) DEFAULT 0.00,
  total_salaries DECIMAL(10, 2) DEFAULT 0.00,
  total_expenses DECIMAL(10, 2) DEFAULT 0.00,
  ijas_salary DECIMAL(10, 2) DEFAULT 0.00,
  flat_rental DECIMAL(10, 2) DEFAULT 0.00,
  product_sales DECIMAL(10, 2) DEFAULT 0.00,
  final_balance DECIMAL(10, 2) DEFAULT 0.00
);

-- Note: BulkImport table is excluded for now as it's part of a later phase. 