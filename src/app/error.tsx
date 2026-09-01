'use client';

import { useEffect } from 'react';
import { business } from '@/content/business';
import { IconPhone } from '@/components/Icons';

/**
 * Client-side error boundary. Whatever broke, the phone number still works —
 * that is the one thing this page must never fail to show.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[boundary]', error.digest ?? error.message);
  }, [error]);

  return (
    <section className="section">
      <div className="shell">
        <p className="eyebrow">Technischer Fehler</p>
        <span className="horizont" aria-hidden="true" />
        <h1 className="text-4xl">Hier ist etwas schiefgelaufen.</h1>
        <p className="measure mt-5 text-lg text-ink-muted">
          Das liegt an uns, nicht an Ihnen. Versuchen Sie es noch einmal — und wenn es
          eilt, rufen Sie bitte direkt an.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a href={business.phone.href} className="btn btn--primary">
            <IconPhone />
            {business.phone.display}
          </a>
          <button type="button" className="btn btn--secondary" onClick={reset}>
            Erneut versuchen
          </button>
        </div>
        {error.digest ? (
          <p className="mt-6 text-sm text-ink-muted">
            Fehlerkennung für den Support: <code>{error.digest}</code>
          </p>
        ) : null}
      </div>
    </section>
  );
}
