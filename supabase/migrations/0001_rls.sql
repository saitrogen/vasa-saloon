-- This file contains all Row Level Security (RLS) policies for the application.

-- First, enable Row Level Security for all relevant tables.
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.summaries ENABLE ROW LEVEL SECURITY;

-- == POLICIES FOR 'staff' TABLE ==
-- These policies use the get_user_role() function (defined in 0002_functions.sql) to prevent infinite recursion.

-- SELECT Policy:
CREATE POLICY "Users can view their own staff record"
  ON public.staff FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins and managers can view all staff records"
  ON public.staff FOR SELECT
  USING (get_user_role(auth.uid()) IN ('admin', 'manager'));

-- INSERT Policy:
CREATE POLICY "Admins and managers can create staff records"
  ON public.staff FOR INSERT
  WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'manager'));

-- UPDATE Policy:
CREATE POLICY "Admins and managers can update staff records"
  ON public.staff FOR UPDATE
  USING (get_user_role(auth.uid()) IN ('admin', 'manager'));

-- DELETE Policy:
CREATE POLICY "Admins and managers can delete staff records"
  ON public.staff FOR DELETE
  USING (get_user_role(auth.uid()) IN ('admin', 'manager'));

-- == POLICIES FOR 'daily_collections' TABLE ==

CREATE POLICY "Allow admin and manager full access to daily_collections"
  ON public.daily_collections FOR ALL
  USING (get_user_role(auth.uid()) IN ('admin', 'manager'));

CREATE POLICY "Allow staff to view their own collections"
  ON public.daily_collections FOR SELECT
  USING (staff_id = (SELECT id FROM public.staff WHERE user_id = auth.uid()));

CREATE POLICY "Allow staff to insert their own collections"
  ON public.daily_collections FOR INSERT
  WITH CHECK (staff_id = (SELECT id FROM public.staff WHERE user_id = auth.uid()));

-- == GENERIC POLICIES FOR OTHER TABLES ==
-- A secure default where only Admins/Managers have access.

CREATE POLICY "Admin/Manager full access on expense_categories" ON public.expense_categories FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'manager'));
CREATE POLICY "Admin/Manager full access on monthly_records" ON public.monthly_records FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'manager'));
CREATE POLICY "Admin/Manager full access on expenses" ON public.expenses FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'manager'));
CREATE POLICY "Admin/Manager full access on salaries" ON public.salaries FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'manager'));
CREATE POLICY "Admin/Manager full access on summaries" ON public.summaries FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'manager'));

-- Allow all authenticated users to read data needed for UI elements like dropdowns.
CREATE POLICY "Allow authenticated read on monthly_records" ON public.monthly_records FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read on expense_categories" ON public.expense_categories FOR SELECT USING (auth.role() = 'authenticated'); 