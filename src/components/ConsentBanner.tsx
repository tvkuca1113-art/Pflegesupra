'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { initClickTracking, setAnalyticsConsent, track } from '@/lib/analytics';

const KEY = 'supra_consent_v1';
type Choice = 'all' | 'necessary';

/**
 * Consent banner.
 *
 * It renders ONLY when there is something to consent to. This site loads no
 * third-party resources at all — the typeface is self-hosted, there is no map
 * embed and no advertising pixel — so with no analytics ID configured it sets
 * no cookies and stores nothing, and a banner would be pure theatre that costs
 * every visitor a click. As soon as NEXT_PUBLIC_GA_ID is set, statistics
 * become optional and the banner appears.
 *
 * Design follows the German supervisory authorities' guidance: reject is as
 * easy and as prominent as accept, nothing is pre-ticked, and no measurement
 * runs before a decision.
 */
export default function ConsentBanner({ analyticsConfigured }: { analyticsConfigured: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // This component is the analytics bootstrap for the whole site, so the
    // delegated click listener is installed here — before the consent check,
    // because events raised without consent are queued and dropped, never
    // sent. That is the same guarantee the old per-link handlers gave.
    initClickTracking();
    if (!analyticsConfigured) return;
    let stored: string | null = null;
    try { stored = localStorage.getItem(KEY); } catch { /* storage blocked — ask again */ }
    if (stored === 'all') { setAnalyticsConsent(true); return; }
    if (stored === 'necessary') { setAnalyticsConsent(false); return; }
    setVisible(true);
  }, [analyticsConfigured]);

  const decide = (choice: Choice) => {
    try { localStorage.setItem(KEY, choice); } catch { /* nothing to persist to */ }
    setAnalyticsConsent(choice === 'all');
    track('consent_decision', { choice });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-titel"
      className="fixed inset-x-0 bottom-0 z-50 border-t-4 border-sun bg-white shadow-[0_-8px_40px_rgb(0_26_82/0.18)]"
    >
      <div className="shell py-5">
        <h2 id="consent-titel" className="text-xl">
          Dürfen wir messen, welche Seiten weiterhelfen?
        </h2>
        <p className="measure mt-2 text-ink-muted">
          Für den Betrieb dieser Seite setzen wir keine Cookies. Zusätzlich würden wir gerne
          anonym auswerten, welche Inhalte gelesen werden, um sie zu verbessern. Das ist
          freiwillig und lässt sich jederzeit widerrufen.{' '}
          <Link href="/datenschutz" className="linkish">Mehr in der Datenschutzerklärung</Link>.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          {/* Decline is listed first and styled with equal weight — no dark pattern. */}
          <button type="button" className="btn btn--secondary" onClick={() => decide('necessary')}>
            Nur notwendige
          </button>
          <button type="button" className="btn btn--primary" onClick={() => decide('all')}>
            Statistik erlauben
          </button>
        </div>
      </div>
    </div>
  );
}
