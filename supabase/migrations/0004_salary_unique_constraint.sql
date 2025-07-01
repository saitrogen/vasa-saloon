ALTER TABLE public.salaries
ADD CONSTRAINT salaries_monthly_record_id_staff_id_key UNIQUE (monthly_record_id, staff_id); 