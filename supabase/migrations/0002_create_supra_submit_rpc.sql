-- The only write path for the website form.
--
-- The `supra` schema is not exposed through PostgREST, so nothing in it is
-- reachable from a client. The one way in is this SECURITY DEFINER function,
-- which validates every field, throttles, and returns nothing but an id. anon
-- can therefore create a well-formed enquiry and can never read one back —
-- exactly the privilege the form needs and no more.
--
-- The route handler calls this with the publishable key, which keeps the
-- service-role key out of the application entirely: there is no secret in the
-- deployment whose leak would expose stored personal data.
--
-- RATE LIMITS. A caller who hits /rest/v1/rpc/supra_submit_inquiry directly
-- skips the route handler's same-origin check, honeypot and time trap, and can
-- forge p_ip_hash. The per-address and global caps below are the part that
-- cannot be forged. They are sized for one care service with two locations: a
-- real practice never approaches them, a script hits them immediately.

create or replace function public.supra_submit_inquiry(
  p_kind           text,
  p_last_name      text,
  p_email          text,
  p_message        text,
  p_consent        boolean,
  p_first_name     text default null,
  p_phone          text default null,
  p_topic          text default null,
  p_kompass_grad   text default null,
  p_kompass_bedarf text default null,
  p_kompass_ort    text default null,
  p_position       text default null,
  p_source_path    text default null,
  p_ip_hash        text default null
) returns uuid
language plpgsql
security definer
set search_path = supra, public, pg_catalog
as $$
declare
  v_id     uuid;
  v_email  text := lower(btrim(p_email));
  v_hourly int;
  v_daily  int;
  v_per_email int;
begin
  -- Consent is a hard precondition, not a checkbox recorded after the fact.
  if p_consent is not true then
    raise exception 'consent_required' using errcode = '22023';
  end if;

  if p_kind not in ('beratung', 'bewerbung') then
    raise exception 'invalid_kind' using errcode = '22023';
  end if;

  if coalesce(length(btrim(p_last_name)), 0) = 0 then
    raise exception 'name_required' using errcode = '22023';
  end if;

  -- Deliberately permissive but structural: catches typos and empty strings
  -- without pretending to validate deliverability.
  if v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[a-zA-Z]{2,}$' then
    raise exception 'invalid_email' using errcode = '22023';
  end if;

  if coalesce(length(btrim(p_message)), 0) < 2 then
    raise exception 'message_required' using errcode = '22023';
  end if;

  -- Per-caller throttle. Forgeable by a direct caller, which is why it is not
  -- the only limit.
  if p_ip_hash is not null then
    if not supra.record_and_check_throttle(p_ip_hash) then
      raise exception 'rate_limited' using errcode = '53400';
    end if;
  end if;

  -- Per-address limit. Not forgeable without cycling addresses, and someone who
  -- genuinely needs to write four times in an hour can phone instead.
  select count(*) into v_per_email
  from supra.inquiries
  where email = v_email and created_at > now() - interval '1 hour';

  if v_per_email >= 3 then
    raise exception 'rate_limited' using errcode = '53400';
  end if;

  -- Global caps. A two-location care service receiving 20 web enquiries in an
  -- hour, or 100 in a day, is not having a good day — it is being scripted.
  select count(*) into v_hourly
  from supra.inquiries where created_at > now() - interval '1 hour';

  select count(*) into v_daily
  from supra.inquiries where created_at > now() - interval '24 hours';

  if v_hourly >= 20 or v_daily >= 100 then
    raise exception 'rate_limited' using errcode = '53400';
  end if;

  insert into supra.inquiries (
    kind, first_name, last_name, email, phone, topic, message,
    kompass_grad, kompass_bedarf, kompass_ort, position,
    consent_at, consent_version, source_path
  ) values (
    p_kind,
    nullif(btrim(p_first_name), ''),
    btrim(p_last_name),
    v_email,
    nullif(btrim(p_phone), ''),
    nullif(btrim(p_topic), ''),
    btrim(p_message),
    nullif(btrim(p_kompass_grad), ''),
    nullif(btrim(p_kompass_bedarf), ''),
    nullif(btrim(p_kompass_ort), ''),
    nullif(btrim(p_position), ''),
    now(),
    'v1',
    nullif(btrim(p_source_path), '')
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.supra_submit_inquiry(
  text, text, text, text, boolean, text, text, text, text, text, text, text, text, text
) from public;

grant execute on function public.supra_submit_inquiry(
  text, text, text, text, boolean, text, text, text, text, text, text, text, text, text
) to anon, authenticated;
