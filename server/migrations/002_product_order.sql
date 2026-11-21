ALTER TABLE products ADD COLUMN created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE products SET created_at = TIMESTAMPTZ 'epoch' WHERE image LIKE 'demo:%';
