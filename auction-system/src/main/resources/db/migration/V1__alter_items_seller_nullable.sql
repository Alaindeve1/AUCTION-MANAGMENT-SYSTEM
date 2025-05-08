-- Make seller_id nullable in items table
ALTER TABLE items ALTER COLUMN seller_id DROP NOT NULL; 