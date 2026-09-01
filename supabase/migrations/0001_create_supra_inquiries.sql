-- Supra ambulanter Pflegedienst — website inquiries and job applications.
--
-- Isolation: everything lives in its own `supra` schema, not in `public`, so it
-- shares nothing with any other application in the project and can be lifted
-- into a dedicated project later by re-running these migrations and changing
-- two environment variables.
--
-- Access model: the browser NEVER talks to this database. The Next.js route
-- handler validates input and calls the RPC in 0002. anon and authenticated get
-- no table privileges at all, and RLS is enabled with no policies, which denies
-- everything. An insert-only anon policy would still let anyone write straight
-- into the table from a console; this does not.

create schema if not exists supra;

revoke all on schema supra from anon, authenticated;

create table if not exists supra.inquiries (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  -- 'beratung'  = care enquiry from a client or relative
  -- 'bewerbung' = job application from a care worker
  kind          text not null check (kind in ('beratung', 'bewerbung')),

  first_name    text,
  last_name     text not null check (length(last_name) between 1 and 120),
  email         text not null check (length(email) between 3 and 320),
  phone         text check (phone is null or length(phone) <= 40),

  topic         text check (topic is null or length(topic) <= 120),
  message       text not null check (length(message) between 1 and 5000),

  -- Context carried over from the Pflege-Kompass so the team can prepare
  -- before calling back. All optional and all self-declared.
  kompass_grad   text check (kompass_grad is null or length(kompass_grad) <= 20),
  kompass_bedarf text check (kompass_bedarf is null or length(kompass_bedarf) <= 200),
  kompass_ort    text check (kompass_ort is null or length(kompass_ort) <= 80),

  position      text check (position is null or length(position) <= 120),

  -- Art. 7(1) GDPR: consent must be demonstrable, so the moment it was given is
  -- recorded alongside the wording version that was shown.
  consent_at      timestamptz not null,
  consent_version text not null default 'v1',

  source_path   text check (source_path is null or length(source_path) <= 200),

  -- Light workflow so the team can use this as an inbox, not just a log.
  status        text not null default 'neu' check (status in ('neu', 'in_arbeit', 'erledigt', 'spam')),
  handled_at    timestamptz,
  note          text
);

comment on table supra.inquiries is
  'Website enquiries and job applications. Contains personal data — retention is enforced by supra.purge_expired_inquiries().';

create index if not exists inquiries_created_at_idx on supra.inquiries (created_at desc);
create index if not exists inquiries_status_idx on supra.inquiries (status) where status = 'neu';
create index if not exists inquiries_email_recent_idx on supra.inquiries (email, created_at desc);

alter table supra.inquiries enable row level security;
-- No policies: anon and authenticated can do nothing. Writes come from the
-- SECURITY DEFINER function, which bypasses RLS.

-- ---------------------------------------------------------------------------
-- Abuse throttling.
--
-- Stores a salted SHA-256 of the caller's IP, never the address itself, and
-- only long enough to stop a flood. Documented in the Datenschutzerklärung as
-- legitimate interest (Art. 6(1)(f) GDPR).
-- ---------------------------------------------------------------------------
create table if not exists supra.submit_throttle (
  ip_hash    text not null,
  created_at timestamptz not null default now()
);
create index if not exists submit_throttle_idx on supra.submit_throttle (ip_hash, created_at desc);
alter table supra.submit_throttle enable row level security;

create or replace function supra.record_and_check_throttle(
  p_ip_hash text,
  p_window interval default interval '10 minutes',
  p_limit  int default 5
) returns boolean
language plpgsql
security definer
set search_path = supra, pg_catalog
as $$
declare
  recent int;
begin
  -- Opportunistic cleanup keeps the table from growing without a cron job.
  delete from supra.submit_throttle where created_at < now() - interval '2 hours';

  select count(*) into recent
  from supra.submit_throttle
  where ip_hash = p_ip_hash and created_at > now() - p_window;

  if recent >= p_limit then
    return false;
  end if;

  insert into supra.submit_throttle (ip_hash) values (p_ip_hash);
  return true;
end;
$$;

revoke all on function supra.record_and_check_throttle(text, interval, int) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Retention. Enquiries are deleted two years after they were handled, or two
-- years after they arrived if they never were. Schedule this once the client
-- confirms the retention period they want.
-- ---------------------------------------------------------------------------
create or replace function supra.purge_expired_inquiries(p_retention interval default interval '2 years')
returns integer
language plpgsql
security definer
set search_path = supra, pg_catalog
as $$
declare
  removed int;
begin
  delete from supra.inquiries
  where coalesce(handled_at, created_at) < now() - p_retention;
  get diagnostics removed = row_count;
  return removed;
end;
$$;

revoke all on function supra.purge_expired_inquiries(interval) from public, anon, authenticated;
