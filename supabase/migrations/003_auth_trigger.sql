-- =============================================================================
-- BLUE NOVA — Migration 003: Auth Trigger & Google OAuth notes
-- Run after 002_rls_policies.sql
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Auto-create profile on signup
-- Works for both email/password and OAuth (Google etc.) because Supabase
-- fires this trigger for every new row in auth.users regardless of provider.
-- raw_user_meta_data is populated by the OAuth provider or by passing
-- `options.data` in supabase.auth.signUp().
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER          -- runs as DB owner, bypasses RLS on profiles
SET search_path = public  -- prevent search_path hijacking
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name'   -- Google sends "name", not "full_name"
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;  -- idempotent: safe to re-run

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ---------------------------------------------------------------------------
-- GOOGLE OAUTH SETUP (manual steps — cannot be scripted via SQL)
-- ---------------------------------------------------------------------------
-- 1. Go to https://console.cloud.google.com
--    Create a project → APIs & Services → OAuth consent screen
--    Add scopes: email, profile, openid
--
-- 2. Credentials → Create OAuth 2.0 Client ID (Web application)
--    Authorised redirect URI:
--      https://<your-project-ref>.supabase.co/auth/v1/callback
--
-- 3. In Supabase Dashboard → Authentication → Providers → Google
--    Paste your Client ID and Client Secret, then Save.
--
-- 4. In your Next.js app, trigger Google login with:
--    supabase.auth.signInWithOAuth({
--      provider: 'google',
--      options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` }
--    })
-- ---------------------------------------------------------------------------
