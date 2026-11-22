ALTER TABLE stores
  ADD COLUMN logo text,
  ADD COLUMN website text,
  ADD COLUMN social_links text[] NOT NULL DEFAULT '{}';
