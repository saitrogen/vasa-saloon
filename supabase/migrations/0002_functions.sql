-- This file contains all custom database functions for the application.

-- This function safely retrieves a user's role from the 'staff' table
-- without causing infinite recursion in RLS policies. It is defined with
-- SECURITY DEFINER to run with the privileges of the user who defined it.
CREATE OR REPLACE FUNCTION get_user_role(p_user_id uuid)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
-- Set a secure search path for this function to prevent hijacking.
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT role
    FROM public.staff
    WHERE user_id = p_user_id
  );
END;
$$; 