-- 1. discounts
CREATE TABLE IF NOT EXISTS discounts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
    value DECIMAL NOT NULL,
    usage_limit INTEGER, -- null means unlimited
    used_count INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for discounts
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Discounts are viewable by everyone" ON discounts
    FOR SELECT USING (true);

CREATE POLICY "Discounts are manageable by admins" ON discounts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- 2. returns
CREATE TABLE IF NOT EXISTS returns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'refunded')),
    reason TEXT NOT NULL,
    refund_amount DECIMAL,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for returns
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own returns" ON returns
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own returns" ON returns
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all returns" ON returns
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- 3. inventory_logs
CREATE TABLE IF NOT EXISTS inventory_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    change_amount INTEGER NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for inventory_logs
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inventory logs viewable by admins" ON inventory_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Inventory logs insertable by admins" ON inventory_logs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- 4. abandoned_carts
CREATE TABLE IF NOT EXISTS abandoned_carts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT, -- In case of guest
    cart_state JSONB NOT NULL,
    total_value DECIMAL NOT NULL,
    recovered BOOLEAN DEFAULT FALSE,
    recovery_email_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for abandoned_carts
ALTER TABLE abandoned_carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Abandoned carts viewable by admins" ON abandoned_carts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Abandoned carts insertable by users" ON abandoned_carts
    FOR ALL USING (true); -- We might need service role to insert or anon to insert on unmount, or update from API

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_discounts_code ON discounts(code);
CREATE INDEX IF NOT EXISTS idx_returns_order_id ON returns(order_id);
CREATE INDEX IF NOT EXISTS idx_returns_user_id ON returns(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_product_id ON inventory_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_user_id ON abandoned_carts(user_id);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_email ON abandoned_carts(email);
