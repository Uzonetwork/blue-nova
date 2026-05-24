-- =============================================================================
-- BLUE NOVA — Migration 002: Row Level Security
-- Run after 001_schema.sql
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Enable RLS on all tables
-- ---------------------------------------------------------------------------

ALTER TABLE profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders     ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- PROFILES
-- Users manage only their own row; service role bypasses RLS for the trigger.
-- ---------------------------------------------------------------------------

CREATE POLICY "profiles: owner can read"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles: owner can update"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- INSERT is handled by the auth trigger running as SECURITY DEFINER,
-- so no INSERT policy is needed for regular users.

-- ---------------------------------------------------------------------------
-- PRODUCTS
-- Public read, admin-only writes (use Supabase dashboard or service role key).
-- ---------------------------------------------------------------------------

CREATE POLICY "products: public read"
  ON products FOR SELECT
  USING (TRUE);

CREATE POLICY "products: service role insert"
  ON products FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "products: service role update"
  ON products FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "products: service role delete"
  ON products FOR DELETE
  USING (auth.role() = 'service_role');

-- ---------------------------------------------------------------------------
-- ORDERS
-- Users can create and read their own orders; only service role can mutate
-- status (e.g. from a Stripe webhook handler using the service role key).
-- ---------------------------------------------------------------------------

CREATE POLICY "orders: owner can read"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "orders: owner can insert"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders: service role can update"
  ON orders FOR UPDATE
  USING (auth.role() = 'service_role');

-- ---------------------------------------------------------------------------
-- ORDER ITEMS
-- Readable by the order's owner; written only when creating the order
-- (same transaction, authenticated user).
-- ---------------------------------------------------------------------------

CREATE POLICY "order_items: owner can read"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "order_items: owner can insert"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- CART ITEMS
-- Full CRUD for the owning user only.
-- ---------------------------------------------------------------------------

CREATE POLICY "cart_items: owner can read"
  ON cart_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "cart_items: owner can insert"
  ON cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cart_items: owner can update"
  ON cart_items FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cart_items: owner can delete"
  ON cart_items FOR DELETE
  USING (auth.uid() = user_id);
