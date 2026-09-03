'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { business } from '@/content/business';
import { IconPhone, IconDocument } from './Icons';
import { track } from '@/lib/analytics';

/**
 * Persistent action bar on small screens.
 *
 * Most people reach a Pflegedienst on a phone, often while standing in a
 * hospital corridor. Making them scroll to find a number is the single most
 * expensive mistake this kind of site can make, so the two real actions stay
 * within thumb reach at all times. Hidden from print, and it reserves its own
 * height on <body> so it never covers the footer.
 */
export default function MobileActionBar() {
  /* The bar waits for the page's own primary call to action to leave the
     screen before it appears.

     It used to be visible from the first paint, which put two competing sets of
     actions on the opening screen and, on a 360px handset, left the hero's own
     "Kostenlos beraten lassen" button sitting underneath it. A fixed bar cannot
     cover a button it is not on screen for; this is the fix, and it is also the
     better pattern, because a duplicate call to action is only useful once the
     original has scrolled away.

     Any page that renders `#mobile-bar-sentinel` opts into that behaviour. Every
     other page has no hero button to protect, so the bar shows immediately —
     which is why the initial state depends on whether the sentinel exists
     rather than defaulting to hidden. Hidden-by-default would blank the bar on
     every page for one frame, and on a page without a sentinel, for good. */
  const [shown, setShown] = useState(true);

  useEffect(() => {
    const sentinel = document.getElementById('mobile-bar-sentinel');
    if (!sentinel) return;
    setShown(false);
    const io = new IntersectionObserver(
      ([e]) => setShown(!e.isIntersecting && e.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  if (!shown) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-page/97 backdrop-blur lg:hidden print:hidden">
      <div className="grid grid-cols-2 gap-2 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <a
          href={business.phone.href}
          className="btn btn--primary"
          onClick={() => track('phone_click', { placement: 'mobile_bar' })}
        >
          <IconPhone />
          Anrufen
        </a>
        <Link
          href="/kontakt"
          className="btn btn--secondary"
          onClick={() => track('primary_cta_click', { placement: 'mobile_bar', label: 'Rueckruf' })}
        >
          <IconDocument />
          Rückruf
        </Link>
      </div>
    </div>
  );
}
