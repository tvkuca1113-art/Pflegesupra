# Database migrations

Applied to the Supabase project that stores website inquiries. They are kept
here so the schema is reproducible — if the inquiries ever move to their own
project (recommended, see below), running these three files in order recreates
everything.

| File | What it does |
| --- | --- |
| `0001_create_supra_inquiries.sql` | The `supra` schema, `inquiries`, `submit_throttle`, the throttle function and the retention function |
| `0002_create_supra_submit_rpc.sql` | `public.supra_submit_inquiry` — the only write path, including its rate caps |

The live project records three migrations, because the rate caps were added in
a follow-up after reviewing the Supabase security advisor. `0002` here is the
resulting function in its current form, so a fresh project reaches the same
state in two files.

## Access model

The browser never reaches the database.

* The `supra` schema is **not exposed** through PostgREST. Verified: a request
  with `Accept-Profile: supra` returns `PGRST106 Invalid schema`.
* RLS is enabled on both tables with **no policies**, which denies everything.
* The only entry point is `public.supra_submit_inquiry`, a `SECURITY DEFINER`
  function that validates, throttles and inserts. It cannot read.
* Consequence: the application holds no secret whose leak would expose an
  inquiry. Worst case someone can submit a form, which a public site allows anyway.

## Supabase advisor notices — reviewed, intentional

Running the security advisor reports two things about this schema. Both are the
design, not defects:

* **`rls_enabled_no_policy` (INFO)** on `supra.inquiries` and
  `supra.submit_throttle` — correct and deliberate. A table with RLS on and no
  policies denies all access, which is exactly what is wanted. Adding a policy
  would *widen* access.
* **`anon_security_definer_function_executable` (WARN)** on
  `public.supra_submit_inquiry` — deliberate: this is the write path the form
  needs. It is safe because the function validates every field, enforces
  consent, rate-limits, and returns nothing but a UUID.

The rate caps in `0002` exist because of that second point. A caller who hits the RPC directly
skips the route handler's same-origin check, honeypot and time trap, and can
forge `p_ip_hash`. The per-address limit (3/hour) and the global caps
(20/hour, 100/day) are the part that cannot be forged.

The advisor also reports warnings for `handle_new_user` and `is_admin`. Those
belong to the **other application sharing this project** and were not touched.

## Recommended before launch

These tables currently live in a Supabase project that already runs an
unrelated application. They are isolated in their own schema, but inquiry data
containing health-adjacent personal information should have its own project:

1. Create a Supabase project in **eu-central-1 (Frankfurt)** — Germany rather
   than the current Ireland, which simplifies the Datenschutzerklärung.
2. Run these migrations in order.
3. Update `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`. Nothing in the
   application code changes.
4. Schedule the retention job: `select supra.purge_expired_inquiries();`
