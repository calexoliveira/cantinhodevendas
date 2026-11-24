ALTER TABLE services
  ADD COLUMN is_approved boolean NOT NULL DEFAULT false;

UPDATE services SET is_approved = true;
