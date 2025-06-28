-- Add a unique constraint to prevent duplicate daily collection entries
ALTER TABLE public.daily_collections
ADD CONSTRAINT daily_collections_monthly_record_id_staff_id_date_key
UNIQUE (monthly_record_id, staff_id, date); 