-- Drop existing SELECT policies on products
DROP POLICY IF EXISTS "Anyone can view available products" ON public.products;
DROP POLICY IF EXISTS "Farmers can view their own products" ON public.products;

-- Create PERMISSIVE policies (using PERMISSIVE keyword explicitly - default is permissive, but making it explicit)
-- Anyone can view available products (permissive - OR logic)
CREATE POLICY "Anyone can view available products" 
ON public.products 
FOR SELECT 
TO public
USING (is_available = true);

-- Farmers can view all their own products including unavailable ones (permissive - OR logic)
CREATE POLICY "Farmers can view their own products" 
ON public.products 
FOR SELECT 
TO authenticated
USING (auth.uid() = farmer_id);