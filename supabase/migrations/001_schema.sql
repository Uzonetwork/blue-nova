-- =============================================================================
-- BLUE NOVA — Migration 001: Schema
-- Run this first in the Supabase SQL Editor
-- =============================================================================

-- ---------------------------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------------------------

CREATE TYPE product_category AS ENUM (
  'handbags',
  'shoes',
  'clothes',
  'sunglasses'
);

CREATE TYPE order_status AS ENUM (
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
);

-- ---------------------------------------------------------------------------
-- PROFILES
-- Mirrors auth.users — auto-populated via trigger (see 003_auth_trigger.sql)
-- ---------------------------------------------------------------------------

CREATE TABLE profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    TEXT,
  email        TEXT NOT NULL,
  phone        TEXT,
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- PRODUCTS
-- Source of truth for inventory / pricing. Sanity handles display content
-- (rich descriptions, editorial images). Link them via sanity_id.
-- ---------------------------------------------------------------------------

CREATE TABLE products (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  description      TEXT,
  price            NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10, 2) CHECK (compare_at_price >= 0),
  category         product_category NOT NULL,
  images           TEXT[] NOT NULL DEFAULT '{}',
  sizes            TEXT[] NOT NULL DEFAULT '{}',
  colors           TEXT[] NOT NULL DEFAULT '{}',
  stock            INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_featured      BOOLEAN NOT NULL DEFAULT FALSE,
  sanity_id        TEXT UNIQUE,           -- optional link to Sanity document _id
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category   ON products (category);
CREATE INDEX idx_products_is_featured ON products (is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_slug        ON products (slug);

-- ---------------------------------------------------------------------------
-- ORDERS
-- ---------------------------------------------------------------------------

CREATE TABLE orders (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  status                   order_status NOT NULL DEFAULT 'pending',
  total_amount             NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  shipping_address         JSONB NOT NULL,
  stripe_payment_intent_id TEXT,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders (user_id);
CREATE INDEX idx_orders_status  ON orders (status);

-- ---------------------------------------------------------------------------
-- ORDER ITEMS
-- Snapshot of price at time of purchase — not a live FK to products.price
-- ---------------------------------------------------------------------------

CREATE TABLE order_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity   INTEGER NOT NULL CHECK (quantity > 0),
  price      NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  size       TEXT,
  color      TEXT
);

CREATE INDEX idx_order_items_order_id   ON order_items (order_id);
CREATE INDEX idx_order_items_product_id ON order_items (product_id);

-- ---------------------------------------------------------------------------
-- CART ITEMS
-- Guest carts live in Zustand (client); this table is for authenticated users.
-- Unique constraint prevents duplicate line items for the same variant.
-- ---------------------------------------------------------------------------

CREATE TABLE cart_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity   INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  size       TEXT,
  color      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id, size, color)
);

CREATE INDEX idx_cart_items_user_id ON cart_items (user_id);

-- ---------------------------------------------------------------------------
-- updated_at auto-maintenance
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
