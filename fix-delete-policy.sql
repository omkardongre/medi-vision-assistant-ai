-- Fix missing DELETE policy for health_records table
-- Run this in your Supabase SQL Editor

-- Add the missing DELETE policy for health_records
CREATE POLICY "Users can delete own health records" ON public.health_records
  FOR DELETE USING (auth.uid() = user_id);

-- Verify the policy was created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'health_records' AND cmd = 'DELETE';
