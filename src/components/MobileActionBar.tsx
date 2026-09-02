'use client';

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
