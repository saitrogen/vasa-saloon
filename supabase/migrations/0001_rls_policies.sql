-- First, enable Row Level Security (RLS) for all relevant tables.
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.summaries ENABLE ROW LEVEL SECURITY;

-- == POLICIES FOR 'staff' TABLE ==

-- 1. Admins/Managers can see and do anything with staff records.
CREATE POLICY "Allow admin and manager full access to staff"
  ON public.staff
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.staff s
      WHERE s.user_id = auth.uid() AND s.role IN ('admin', 'manager')
    )
  );

-- 2. Staff can view their own record.
CREATE POLICY "Allow staff to view their own record"
  ON public.staff
  FOR SELECT
  USING (user_id = auth.uid());


-- == POLICIES FOR 'daily_collections' TABLE ==

-- 1. Admins/Managers can see and do anything with daily collections.
CREATE POLICY "Allow admin and manager full access to daily_collections"
  ON public.daily_collections
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.staff s
      WHERE s.user_id = auth.uid() AND s.role IN ('admin', 'manager')
    )
  );

-- 2. Staff can view their own collections.
CREATE POLICY "Allow staff to view their own collections"
  ON public.daily_collections
  FOR SELECT
  USING (
    staff_id = (SELECT id FROM public.staff WHERE user_id = auth.uid())
  );

-- 3. Staff can insert their own collections.
CREATE POLICY "Allow staff to insert their own collections"
  ON public.daily_collections
  FOR INSERT
  WITH CHECK (
    staff_id = (SELECT id FROM public.staff WHERE user_id = auth.uid())
  );

-- == GENERIC POLICIES FOR OTHER TABLES ==
-- For now, only Admins/Managers have access to other tables.
-- This provides a secure default. We will add more granular policies later.

CREATE POLICY "Admin/Manager full access on expense_categories" ON public.expense_categories FOR ALL USING (EXISTS (SELECT 1 FROM public.staff s WHERE s.user_id = auth.uid() AND s.role IN ('admin', 'manager')));
CREATE POLICY "Admin/Manager full access on monthly_records" ON public.monthly_records FOR ALL USING (EXISTS (SELECT 1 FROM public.staff s WHERE s.user_id = auth.uid() AND s.role IN ('admin', 'manager')));
CREATE POLICY "Admin/Manager full access on expenses" ON public.expenses FOR ALL USING (EXISTS (SELECT 1 FROM public.staff s WHERE s.user_id = auth.uid() AND s.role IN ('admin', 'manager')));
CREATE POLICY "Admin/Manager full access on salaries" ON public.salaries FOR ALL USING (EXISTS (SELECT 1 FROM public.staff s WHERE s.user_id = auth.uid() AND s.role IN ('admin', 'manager')));
CREATE POLICY "Admin/Manager full access on summaries" ON public.summaries FOR ALL USING (EXISTS (SELECT 1 FROM public.staff s WHERE s.user_id = auth.uid() AND s.role IN ('admin', 'manager')));

-- Allow all authenticated users to view monthly records and expense categories, which are needed for forms.
CREATE POLICY "Allow authenticated read on monthly_records" ON public.monthly_records FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read on expense_categories" ON public.expense_categories FOR SELECT USING (auth.role() = 'authenticated'); 