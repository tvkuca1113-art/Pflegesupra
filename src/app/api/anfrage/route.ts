import { createHash } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validateInquiry, hasErrors, type InquiryInput } from '@/lib/inquiry';

export const runtime = 'nodejs';
/** Never cached — this is a write endpoint. */
export const dynamic = 'force-dynamic';

/**
 * Inquiry endpoint.
 *
 * Layers, outermost first:
 *   1. Same-origin check      — blocks the simplest cross-site posting.
 *   2. Honeypot + time trap   — blocks unsophisticated bots without a CAPTCHA.
 *   3. Shared validation      — identical rules to the browser's.
 *   4. Salted-IP throttle     — enforced inside Postgres, so it survives
 *                               serverless instances not sharing memory.
 *   5. SECURITY DEFINER RPC   — the only privilege granted is "create an
 *                               enquiry". Nothing here can read one back.
 *
 * No CAPTCHA on purpose. The current site's reCAPTCHA is misconfigured and has
 * been silently blocking every submission; a spam defence that can fail closed
 * on the one form that earns the business is the wrong trade. These layers fail
 * open for humans and closed for scripts.
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
const IP_SALT = process.env.INQUIRY_IP_SALT;

/** Minimum time a human plausibly needs to fill this in. */
const MIN_ELAPSED_MS = 2500;

function hashIp(req: NextRequest): string | null {
  if (!IP_SALT) return null;
  const fwd = req.headers.get('x-forwarded-for');
  const ip = fwd?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || null;
  if (!ip) return null;
  // Salted hash only. The address itself is never written down anywhere.
  return createHash('sha256').update(`${IP_SALT}:${ip}`).digest('hex').slice(0, 40);
}

function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true; // non-browser client; the other layers still apply
  try {
    return new URL(origin).host === req.headers.get('host');
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('[anfrage] Supabase environment variables are missing');
    return NextResponse.json(
      { ok: false, error: 'server_not_configured' },
      { status: 503 },
    );
  }

  if (!sameOrigin(req)) {
    return NextResponse.json({ ok: false, error: 'bad_origin' }, { status: 403 });
  }

  let body: Partial<InquiryInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 });
  }

  // Honeypot and time trap. Both answer "accepted" so a bot gets no signal
  // about which of its attempts are being discarded.
  if (body.website) {
    return NextResponse.json({ ok: true, id: null });
  }
  if (typeof body.elapsedMs === 'number' && body.elapsedMs < MIN_ELAPSED_MS) {
    return NextResponse.json({ ok: true, id: null });
  }

  const errors = validateInquiry(body);
  if (hasErrors(errors)) {
    return NextResponse.json({ ok: false, error: 'validation', errors }, { status: 422 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.rpc('supra_submit_inquiry', {
    p_kind: body.kind === 'bewerbung' ? 'bewerbung' : 'beratung',
    p_last_name: body.lastName!.trim(),
    p_email: body.email!.trim(),
    p_message: body.message!.trim(),
    p_consent: true,
    p_first_name: body.firstName?.trim() || null,
    p_phone: body.phone?.trim() || null,
    p_topic: body.topic?.trim() || null,
    p_kompass_grad: body.kompassGrad?.trim() || null,
    p_kompass_bedarf: body.kompassBedarf?.trim() || null,
    p_kompass_ort: body.kompassOrt?.trim() || null,
    p_position: body.position?.trim() || null,
    p_source_path: body.sourcePath?.slice(0, 200) || null,
    p_ip_hash: hashIp(req),
  });

  if (error) {
    // Postgres 53400 is what the RPC raises when a caller is throttled.
    const throttled = error.code === '53400' || /rate_limited/.test(error.message);
    if (throttled) {
      return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
    }
    // Log server-side only. The response never leaks database detail.
    console.error('[anfrage] insert failed', { code: error.code, message: error.message });
    return NextResponse.json({ ok: false, error: 'storage_failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true, id: data as string });
}

/** Anything but POST is a mistake; say so rather than 404. */
export function GET() {
  return NextResponse.json({ ok: false, error: 'method_not_allowed' }, { status: 405 });
}
