-- Tamkeen Admin: non-destructive migration, apply to isolated Neon branch first.
CREATE TABLE IF NOT EXISTS tamkeen_admin_accounts (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text UNIQUE NOT NULL,
 password_salt text NOT NULL, password_hash text NOT NULL,
 totp_secret text, totp_pending text, totp_enabled boolean NOT NULL DEFAULT false,
 recovery_hashes text[] NOT NULL DEFAULT '{}'::text[], failed_attempts integer NOT NULL DEFAULT 0,
 locked_until timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS tamkeen_admin_sessions (
 token_hash text PRIMARY KEY, account_id uuid NOT NULL REFERENCES tamkeen_admin_accounts(id) ON DELETE CASCADE,
 assurance text NOT NULL CHECK (assurance IN ('preauth','full')), expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS tamkeen_content_items (
 content_key text PRIMARY KEY CHECK (length(content_key)<=200), published_text text,
 draft_text text, version integer NOT NULL DEFAULT 0, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS tamkeen_content_history (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, content_key text NOT NULL REFERENCES tamkeen_content_items(content_key) ON DELETE CASCADE,
 action text NOT NULL, old_text text, new_text text, version integer NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS tamkeen_admin_events (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, event_type text NOT NULL, account_id uuid, detail text, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE OR REPLACE FUNCTION tamkeen_content_audit_fn() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP = 'INSERT' THEN
 INSERT INTO tamkeen_content_history(content_key,action,old_text,new_text,version)
 VALUES (NEW.content_key,CASE WHEN NEW.published_text IS NULL THEN 'draft' ELSE 'publish' END,NULL,COALESCE(NEW.published_text,NEW.draft_text),NEW.version);
 ELSIF NEW.published_text IS DISTINCT FROM OLD.published_text OR NEW.draft_text IS DISTINCT FROM OLD.draft_text THEN
 INSERT INTO tamkeen_content_history(content_key,action,old_text,new_text,version)
 VALUES (NEW.content_key,CASE WHEN NEW.published_text IS DISTINCT FROM OLD.published_text THEN 'publish' ELSE 'draft' END,COALESCE(OLD.published_text,OLD.draft_text),COALESCE(NEW.published_text,NEW.draft_text),NEW.version);
 END IF;
 RETURN NEW;
END $$;
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='tamkeen_content_audit') THEN
 CREATE TRIGGER tamkeen_content_audit AFTER INSERT OR UPDATE ON tamkeen_content_items FOR EACH ROW EXECUTE FUNCTION tamkeen_content_audit_fn();
 END IF;
END $$;

-- Universal multi-device administration (additive)
ALTER TABLE public.tamkeen_admin_sessions ADD COLUMN IF NOT EXISTS session_id uuid NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE public.tamkeen_admin_sessions ADD COLUMN IF NOT EXISTS device_label text NOT NULL DEFAULT 'جهاز سابق';
ALTER TABLE public.tamkeen_admin_sessions ADD COLUMN IF NOT EXISTS last_seen_at timestamptz NOT NULL DEFAULT now();
CREATE UNIQUE INDEX IF NOT EXISTS tamkeen_admin_sessions_session_id_idx ON public.tamkeen_admin_sessions(session_id);
CREATE INDEX IF NOT EXISTS tamkeen_admin_sessions_active_idx ON public.tamkeen_admin_sessions(account_id,expires_at);
