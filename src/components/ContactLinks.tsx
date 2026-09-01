'use client';

import { business } from '@/content/business';
import { IconPhone, IconMail, IconWhatsapp } from './Icons';
import { track } from '@/lib/analytics';

/** The three direct channels, each tracked so we learn which one people use. */
export default function ContactLinks() {
  return (
    <div className="mt-5 flex flex-col gap-3">
      <a
        href={business.phone.href}
        className="btn btn--primary text-[var(--text-lg)]"
        onClick={() => track('phone_click', { placement: 'kontakt_aside' })}
      >
        <IconPhone />
        {business.phone.display}
      </a>
      <a
        href={business.whatsapp}
        className="btn btn--secondary"
        rel="noopener noreferrer"
        target="_blank"
        onClick={() => track('whatsapp_click', { placement: 'kontakt_aside' })}
      >
        <IconWhatsapp />
        Über WhatsApp schreiben
        <span className="sr-only">(öffnet in neuem Tab)</span>
      </a>
      <a
        href={`mailto:${business.email}`}
        className="btn btn--secondary"
        onClick={() => track('email_click', { placement: 'kontakt_aside' })}
      >
        <IconMail />
        {business.email}
      </a>
    </div>
  );
}
