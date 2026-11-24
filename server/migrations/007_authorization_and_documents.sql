DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM users
    WHERE document_number IS NOT NULL
    GROUP BY document_number
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Há CPF/CNPJ duplicado em users; resolva as duplicidades antes da migração 007.';
  END IF;
  IF EXISTS (
    SELECT 1 FROM services
    GROUP BY document_number
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Há CPF/CNPJ duplicado em services; resolva as duplicidades antes da migração 007.';
  END IF;
END $$;

CREATE UNIQUE INDEX users_document_number_uidx
  ON users (document_number)
  WHERE document_number IS NOT NULL;

CREATE UNIQUE INDEX services_document_number_uidx
  ON services (document_number);

ALTER TABLE stores
  ADD COLUMN is_approved boolean NOT NULL DEFAULT false;

UPDATE stores SET is_approved = true;

ALTER TABLE services
  ADD COLUMN owner_id uuid REFERENCES users(id) ON DELETE SET NULL;

CREATE FUNCTION enforce_store_owner_is_merchant() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.owner_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM users WHERE id = NEW.owner_id AND account_type = 'merchant'
  ) THEN
    RAISE EXCEPTION 'A loja deve pertencer a uma conta de lojista.'
      USING ERRCODE = '23514', CONSTRAINT = 'stores_owner_merchant_check';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER stores_owner_merchant_check
  BEFORE INSERT OR UPDATE OF owner_id ON stores
  FOR EACH ROW EXECUTE FUNCTION enforce_store_owner_is_merchant();

CREATE FUNCTION enforce_service_owner() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.owner_id IS NULL THEN
    RAISE EXCEPTION 'O cadastro de serviço exige uma conta autenticada.'
      USING ERRCODE = '23514', CONSTRAINT = 'services_owner_required_check';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER services_owner_required_check
  BEFORE INSERT ON services
  FOR EACH ROW EXECUTE FUNCTION enforce_service_owner();

CREATE FUNCTION enforce_approved_product_store() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.store_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM stores WHERE id = NEW.store_id AND is_approved
  ) THEN
    RAISE EXCEPTION 'A loja precisa ser aprovada antes de publicar produtos.'
      USING ERRCODE = '23514', CONSTRAINT = 'products_store_approval_check';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER products_store_approval_check
  BEFORE INSERT OR UPDATE OF store_id ON products
  FOR EACH ROW EXECUTE FUNCTION enforce_approved_product_store();
