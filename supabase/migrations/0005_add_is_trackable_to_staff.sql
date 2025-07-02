-- Add the new column to the staff table
ALTER TABLE public.staff
ADD COLUMN is_trackable BOOLEAN DEFAULT TRUE NOT NULL;

-- Add a comment for clarity
COMMENT ON COLUMN public.staff.is_trackable IS 'Determines if the staff member should be included in financial tracking (collections, payroll, etc.)';

-- Set the admin user to be non-trackable
UPDATE public.staff
SET is_trackable = FALSE
WHERE role = 'admin'; 