ALTER TABLE products DROP CONSTRAINT products_condition_check;
ALTER TABLE products ADD CONSTRAINT products_condition_check
  CHECK (condition IN ('novo', 'seminovo', 'usado', 'recondicionado'));

ALTER TABLE products
  ADD COLUMN model text,
  ADD COLUMN color text,
  ADD COLUMN size text,
  ADD COLUMN gtin text,
  ADD COLUMN weight_kg numeric(10, 3),
  ADD COLUMN package_length_cm numeric(10, 2),
  ADD COLUMN package_width_cm numeric(10, 2),
  ADD COLUMN package_height_cm numeric(10, 2),
  ADD COLUMN discount_percent numeric(5, 2),
  ADD COLUMN image_data bytea,
  ADD COLUMN image_type text,
  ADD COLUMN is_bazaar boolean NOT NULL DEFAULT false;

UPDATE products SET is_bazaar = true WHERE condition IS NOT NULL;
