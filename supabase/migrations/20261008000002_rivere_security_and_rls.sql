-- ==============================================================================
-- Riverè Cafe & Bakery - Security Functions & Row Level Security (RLS)
-- Migration ID: 20261008000002_rivere_security_and_rls.sql
-- Description: Zero-Trust Security Policies, Rate Limiting, and Access Control
-- ==============================================================================

-- 1. ENABLE ROW LEVEL SECURITY ON ALL TABLES
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables_layout ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 2. SECURITY & RATE-LIMITING FUNCTIONS

-- Security barrier function to check reservation rate limits (Max 3 per email per day)
CREATE OR REPLACE FUNCTION public.check_reservation_rate_limit(
  p_email TEXT,
  p_date DATE
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_reservation_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_reservation_count
  FROM public.reservations
  WHERE customer_email = p_email
    AND reservation_date = p_date
    AND status <> 'cancelled';

  RETURN v_reservation_count < 3;
END;
$$;

-- Grant execution to public and authenticated roles so RLS WITH CHECK can execute it
GRANT EXECUTE ON FUNCTION public.check_reservation_rate_limit(TEXT, DATE) TO anon, authenticated, service_role;

-- 3. RLS POLICIES

-- 3.1 MENU ITEMS POLICIES
CREATE POLICY "Public read available menu items"
  ON public.menu_items
  FOR SELECT
  TO anon, authenticated
  USING (is_available = true);

CREATE POLICY "Service role full access menu items"
  ON public.menu_items
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 3.2 RECIPES POLICIES
CREATE POLICY "Public read published recipes"
  ON public.recipes
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Service role full access recipes"
  ON public.recipes
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 3.3 TABLES LAYOUT POLICIES
CREATE POLICY "Public read active tables"
  ON public.tables_layout
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Service role full access tables layout"
  ON public.tables_layout
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 3.4 RESERVATIONS POLICIES (Zero-Trust Customer Data Protection)

-- Anonymous & authenticated users can ONLY insert a reservation if rate limit check passes.
-- SELECT access is strictly DENIED to public/anon/authenticated to prevent scraping or data leaks.
CREATE POLICY "Public insert reservation with rate limit"
  ON public.reservations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    public.check_reservation_rate_limit(customer_email, reservation_date)
  );

-- Admin / Service role gets full administrative access to reservations
CREATE POLICY "Service role full access reservations"
  ON public.reservations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 3.5 AUDIT LOGS POLICIES
-- No public or authenticated read/write access allowed
CREATE POLICY "Service role full access audit logs"
  ON public.audit_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
