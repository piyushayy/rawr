-- SaaS CRM Module 1: Customer Data Platform (CDP) Core Foundation

-- 1. crm_customers (Unified Customer Profile)
CREATE TABLE IF NOT EXISTS crm_customers (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    lifetime_value DECIMAL DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    -- loyalty_tier UUID REFERENCES loyalty_tiers(id) -- Will be added in Module 4
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'banned')),
    tags JSONB DEFAULT '[]', -- Array of string tags ["VIP", "Frequent Returner"]
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for crm_customers
ALTER TABLE crm_customers ENABLE ROW LEVEL SECURITY;

-- Admins can view and manage all customers
CREATE POLICY "crm_customers admin ALL" ON crm_customers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Users can view their own CRM profile
CREATE POLICY "crm_customers user SELECT" ON crm_customers
    FOR SELECT USING (auth.uid() = id);

-- 2. customer_events (The Event Stream)
CREATE TABLE IF NOT EXISTS customer_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES crm_customers(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- e.g., 'PAGE_VIEW', 'ADD_TO_CART', 'PURCHASE', 'EMAIL_OPENED'
    event_data JSONB NOT NULL DEFAULT '{}', -- Context (e.g., {"product_id": "123", "value": 50})
    source TEXT, -- 'web', 'ios', 'system'
    url TEXT, -- The URL where the event occurred (optional)
    session_id TEXT, -- Optional, for anonymous tracking before login
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for customer_events
ALTER TABLE customer_events ENABLE ROW LEVEL SECURITY;

-- Admins can view all events
CREATE POLICY "customer_events admin SELECT" ON customer_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- System/Users can INSERT events
-- Need to allow anon inserts if we want to track pre-login behavior (with session_id)
-- For now, authenticated users can insert their own
CREATE POLICY "customer_events user INSERT" ON customer_events
    FOR INSERT WITH CHECK (
        auth.uid() = customer_id OR customer_id IS NULL
    );

-- Allow public inserts for anonymous tracking (if API allows it)
CREATE POLICY "customer_events anon INSERT" ON customer_events
    FOR INSERT WITH CHECK (true);

-- Indexes for performance (Massive scale required for events)
CREATE INDEX IF NOT EXISTS idx_customer_events_customer_id ON customer_events(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_events_event_type ON customer_events(event_type);
CREATE INDEX IF NOT EXISTS idx_customer_events_created_at ON customer_events(created_at);
CREATE INDEX IF NOT EXISTS idx_crm_customers_email ON crm_customers(email);
