import { business } from '@/content/business';
import { IconPhone, IconMail, IconWhatsapp } from './Icons';
import { trackAttrs } from '@/lib/analytics';

/** The three direct channels, each tracked so we learn which one people use. */
export default function ContactLinks() {
  return (
    <div className="mt-5 flex flex-col gap-3">
      <a
        href={business.phone.href}
        className="btn btn--primary text-lg"
        {...trackAttrs('phone_click', { placement: 'kontakt_aside' })}
      >
        <IconPhone />
        {business.phone.display}
      </a>
      <a
        href={business.whatsapp}
        className="btn btn--secondary"
        rel="noopener noreferrer"
        target="_blank"
        {...trackAttrs('whatsapp_click', { placement: 'kontakt_aside' })}
      >
        <IconWhatsapp />
        Über WhatsApp schreiben
        <span className="sr-only">(öffnet in neuem Tab)</span>
      </a>
      <a
        href={`mailto:${business.email}`}
        className="btn btn--secondary"
        {...trackAttrs('email_click', { placement: 'kontakt_aside' })}
      >
        <IconMail />
        {business.email}
      </a>
    </div>
  );
}
