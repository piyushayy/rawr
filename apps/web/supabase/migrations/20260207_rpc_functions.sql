-- RPC Functions for Stock Management (Variants)

-- Decrement Variant Stock (Atomic)
CREATE OR REPLACE FUNCTION decrement_variant_stock(p_variant_id UUID, p_quantity INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    current_stock INTEGER;
BEGIN
    -- Lock the row
    SELECT stock_quantity INTO current_stock
    FROM public.product_variants
    WHERE id = p_variant_id
    FOR UPDATE;

    IF current_stock IS NULL THEN
        RETURN FALSE; -- Variant not found
    END IF;

    IF current_stock < p_quantity THEN
        RETURN FALSE; -- Insufficient stock
    END IF;

    UPDATE public.product_variants
    SET stock_quantity = stock_quantity - p_quantity
    WHERE id = p_variant_id;

    RETURN TRUE;
END;
$$;

-- Increment Variant Stock (Rollback/Restock)
CREATE OR REPLACE FUNCTION increment_variant_stock(p_variant_id UUID, p_quantity INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE public.product_variants
    SET stock_quantity = stock_quantity + p_quantity
    WHERE id = p_variant_id;

    RETURN TRUE;
END;
$$;
