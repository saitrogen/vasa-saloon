-- Enable the moddatetime extension to automatically update 'updated_at' timestamps
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions; 
-- Create the product_sales table
CREATE TABLE public.product_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    monthly_record_id UUID NOT NULL REFERENCES public.monthly_records(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comments for clarity
COMMENT ON TABLE public.product_sales IS 'Stores records of individual product sales for a given month.';

-- RLS Policies for product_sales table
ALTER TABLE public.product_sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow full access for admin and manager roles"
ON public.product_sales
FOR ALL
USING (auth.uid() IN (SELECT user_id FROM public.staff WHERE role IN ('admin', 'manager')))
WITH CHECK (auth.uid() IN (SELECT user_id FROM public.staff WHERE role IN ('admin', 'manager')));

-- Trigger to automatically update the 'updated_at' timestamp
CREATE TRIGGER handle_updated_at
BEFORE UPDATE ON public.product_sales
FOR EACH ROW
EXECUTE PROCEDURE moddatetime (updated_at); 