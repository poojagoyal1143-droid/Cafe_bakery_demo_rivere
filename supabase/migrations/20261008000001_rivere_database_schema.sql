-- ==============================================================================
-- Riverè Cafe & Bakery - Core Database Schema Migration
-- Migration ID: 20261008000001_rivere_database_schema.sql
-- Description: DDL, Custom ENUMs, Tables, Constraints, Triggers, and Indexes
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM ENUM TYPES
CREATE TYPE public.menu_category_enum AS ENUM (
  'viennoiserie',
  'patisserie',
  'breads',
  'beverages',
  'seasonal'
);

CREATE TYPE public.recipe_difficulty_enum AS ENUM (
  'easy',
  'artisan',
  'master_baker'
);

CREATE TYPE public.reservation_status_enum AS ENUM (
  'pending',
  'confirmed',
  'cancelled',
  'completed'
);

-- 3. TABLES & RELATIONAL SCHEMA

-- Table 1: Menu Items (Optimized for 3D Flipbook menu)
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  title TEXT NOT NULL CHECK (char_length(trim(title)) BETWEEN 2 AND 100),
  slug TEXT NOT NULL UNIQUE CHECK (slug ~* '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  category public.menu_category_enum NOT NULL,
  description TEXT NOT NULL CHECK (char_length(description) <= 500),
  price NUMERIC(6, 2) NOT NULL CHECK (price >= 0.00),
  image_url TEXT NOT NULL CHECK (image_url ~* '^https?://[^\s]+$'),
  page_number SMALLINT NOT NULL CHECK (page_number BETWEEN 1 AND 20),
  display_order SMALLINT NOT NULL DEFAULT 1,
  allergens TEXT[] DEFAULT '{}'::TEXT[],
  is_available BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false
);

-- Table 2: Artisan Recipes
CREATE TABLE public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  title TEXT NOT NULL CHECK (char_length(trim(title)) BETWEEN 3 AND 150),
  slug TEXT NOT NULL UNIQUE CHECK (slug ~* '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  excerpt TEXT NOT NULL CHECK (char_length(excerpt) <= 300),
  prep_time_minutes SMALLINT NOT NULL CHECK (prep_time_minutes > 0),
  bake_time_minutes SMALLINT NOT NULL CHECK (bake_time_minutes >= 0),
  yield_servings SMALLINT NOT NULL CHECK (yield_servings > 0),
  difficulty public.recipe_difficulty_enum NOT NULL DEFAULT 'artisan',
  ingredients JSONB NOT NULL CHECK (jsonb_typeof(ingredients) = 'array' AND jsonb_array_length(ingredients) > 0),
  instructions JSONB NOT NULL CHECK (jsonb_typeof(instructions) = 'array' AND jsonb_array_length(instructions) > 0),
  image_url TEXT NOT NULL CHECK (image_url ~* '^https?://[^\s]+$'),
  is_published BOOLEAN NOT NULL DEFAULT true
);

-- Table 3: Tables Layout
CREATE TABLE public.tables_layout (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number SMALLINT NOT NULL UNIQUE CHECK (table_number BETWEEN 1 AND 30),
  capacity SMALLINT NOT NULL CHECK (capacity BETWEEN 1 AND 8),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Table 4: Reservations
CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  customer_name TEXT NOT NULL CHECK (char_length(trim(customer_name)) BETWEEN 2 AND 80),
  customer_email TEXT NOT NULL CHECK (customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  customer_phone TEXT NOT NULL CHECK (char_length(trim(customer_phone)) BETWEEN 7 AND 20),
  reservation_date DATE NOT NULL CHECK (reservation_date >= CURRENT_DATE),
  reservation_time TIME NOT NULL CHECK (reservation_time BETWEEN '07:00:00' AND '21:00:00'),
  party_size SMALLINT NOT NULL CHECK (party_size BETWEEN 1 AND 8),
  table_id UUID REFERENCES public.tables_layout(id) ON DELETE SET NULL,
  special_requests TEXT CHECK (char_length(special_requests) <= 300),
  status public.reservation_status_enum NOT NULL DEFAULT 'pending'
);

-- Table 5: Audit Logs
CREATE TABLE public.audit_logs (
  id BIGSERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  record_id UUID NOT NULL,
  old_data JSONB,
  new_data JSONB,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. AUTOMATED TIMESTAMP MANAGEMENT
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER set_updated_at_menu_items
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_updated_at_recipes
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_updated_at_reservations
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 5. AUDIT LOGGING TRIGGER FOR RESERVATIONS
CREATE OR REPLACE FUNCTION public.log_reservation_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.audit_logs (table_name, operation, record_id, old_data, new_data)
    VALUES ('reservations', 'INSERT', NEW.id, NULL, to_jsonb(NEW));
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO public.audit_logs (table_name, operation, record_id, old_data, new_data)
    VALUES ('reservations', 'UPDATE', NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO public.audit_logs (table_name, operation, record_id, old_data, new_data)
    VALUES ('reservations', 'DELETE', OLD.id, to_jsonb(OLD), NULL);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER audit_reservations_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.log_reservation_changes();

-- 6. DOUBLE-BOOKING & OVERBOOKING PREVENTION TRIGGER
CREATE OR REPLACE FUNCTION public.prevent_overbooking()
RETURNS TRIGGER AS $$
DECLARE
  v_table_capacity SMALLINT;
  v_table_active BOOLEAN;
  v_conflicting_id UUID;
  v_suitable_tables_count INTEGER;
BEGIN
  -- Only validate active reservations (pending or confirmed)
  IF NEW.status NOT IN ('pending', 'confirmed') THEN
    RETURN NEW;
  END IF;

  -- 6.1 Validate table capacity & active status if a specific table_id is requested
  IF NEW.table_id IS NOT NULL THEN
    SELECT capacity, is_active INTO v_table_capacity, v_table_active
    FROM public.tables_layout
    WHERE id = NEW.table_id;

    IF v_table_capacity IS NULL THEN
      RAISE EXCEPTION 'Invalid table selection: Table ID % does not exist.', NEW.table_id;
    END IF;

    IF NOT v_table_active THEN
      RAISE EXCEPTION 'Table % is currently inactive and cannot be reserved.', NEW.table_id;
    END IF;

    IF NEW.party_size > v_table_capacity THEN
      RAISE EXCEPTION 'Table capacity exceeded: Selected table holds up to % guests, but party size is %.',
        v_table_capacity, NEW.party_size;
    END IF;

    -- Check direct 90-minute table collision
    SELECT id INTO v_conflicting_id
    FROM public.reservations
    WHERE table_id = NEW.table_id
      AND reservation_date = NEW.reservation_date
      AND status IN ('pending', 'confirmed')
      AND id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
      AND ABS(EXTRACT(EPOCH FROM (NEW.reservation_time - reservation_time))) < 5400
    LIMIT 1;

    IF v_conflicting_id IS NOT NULL THEN
      RAISE EXCEPTION 'Double-booking conflict: Table is already reserved within 90 minutes of % on %.',
        NEW.reservation_time, NEW.reservation_date;
    END IF;

  ELSE
    -- 6.2 If no table_id is explicitly specified, verify that at least one suitable active table is available
    SELECT COUNT(*) INTO v_suitable_tables_count
    FROM public.tables_layout t
    WHERE t.is_active = true
      AND t.capacity >= NEW.party_size
      AND NOT EXISTS (
        SELECT 1
        FROM public.reservations r
        WHERE r.table_id = t.id
          AND r.reservation_date = NEW.reservation_date
          AND r.status IN ('pending', 'confirmed')
          AND r.id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
          AND ABS(EXTRACT(EPOCH FROM (NEW.reservation_time - r.reservation_time))) < 5400
      );

    IF v_suitable_tables_count = 0 THEN
      RAISE EXCEPTION 'Fully booked: No table with capacity for % guests is available at % on %.',
        NEW.party_size, NEW.reservation_time, NEW.reservation_date;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER check_overbooking_trigger
  BEFORE INSERT OR UPDATE ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_overbooking();

-- 7. PERFORMANCE INDEXES (Zero Slow Queries)

-- 7.1 Optimized for 3D flipbook menu lookups
CREATE INDEX idx_menu_items_flipbook
  ON public.menu_items (page_number, display_order, is_available);

-- 7.2 Optimized for published recipe list queries with chronologic sorting
CREATE INDEX idx_recipes_published
  ON public.recipes (is_published, created_at DESC);

-- 7.3 Optimized for reservation scheduling checks & admin overview
CREATE INDEX idx_reservations_schedule
  ON public.reservations (reservation_date, reservation_time, status);

-- 7.4 Optimized for customer lookup and rate-limiting checks
CREATE INDEX idx_reservations_customer_email
  ON public.reservations (customer_email);
