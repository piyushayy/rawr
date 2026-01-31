
-- Secure Inventory Management
CREATE OR REPLACE FUNCTION decrement_stock(p_id UUID, quantity INT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  current_stock INT;
BEGIN
  -- Lock the row for update to prevent race conditions
  SELECT stock INTO current_stock FROM products WHERE id = p_id FOR UPDATE;

  IF current_stock >= quantity THEN
    UPDATE products SET stock = stock - quantity WHERE id = p_id;
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION increment_stock(p_id UUID, quantity INT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE products SET stock = stock + quantity WHERE id = p_id;
END;
$$;
