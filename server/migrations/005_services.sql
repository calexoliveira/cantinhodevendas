CREATE TABLE services (
  id uuid PRIMARY KEY,
  provider_type text NOT NULL CHECK (provider_type IN ('individual', 'company')),
  provider_name text NOT NULL,
  business_name text,
  document_number text NOT NULL,
  service_name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  phone text NOT NULL,
  city text NOT NULL,
  starting_price numeric(12, 2) CHECK (starting_price >= 0),
  legacy_key text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
