-- Add enabled column with default value true
ALTER TABLE users ADD COLUMN enabled BOOLEAN DEFAULT true NOT NULL; 