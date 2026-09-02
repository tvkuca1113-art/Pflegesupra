import Link from 'next/link';
import { business } from '@/content/business';
import { footerNav } from '@/content/nav';
import { IconPhone, IconMail, IconWhatsapp, IconPin, IconClock } from './Icons';
import { trackAttrs } from '@/lib/analytics';

export default function Footer() {
  return (
    <footer className="on-dark mt-auto bg-brand-deep text-white">
      <div className="shell py-12 pb-28 lg:pb-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_repeat(3,minmax(0,1fr))]">
          {/* Contact block comes first, on every screen size. */}
          <div>
            <h2 className="text-xl text-white">Direkt erreichen</h2>
            <span className="horizont mt-3" aria-hidden="true" />
            <ul className="m-0 list-none space-y-3 p-0">
              <li>
                <a
                  href={business.phone.href}
                  className="inline-flex items-center gap-2.5 text-lg font-bold text-white underline decoration-2 underline-offset-4"
                  {...trackAttrs('phone_click', { placement: 'footer' })}
                >
                  <IconPhone />
                  {business.phone.display}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${business.email}`}
                  className="inline-flex items-center gap-2.5 text-white underline decoration-2 underline-offset-4"
                  {...trackAttrs('email_click', { placement: 'footer' })}
                >
                  <IconMail />
                  {business.email}
                </a>
              </li>
              <li>
                <a
                  href={business.whatsapp}
                  className="inline-flex items-center gap-2.5 text-white underline decoration-2 underline-offset-4"
                  rel="noopener noreferrer"
                  target="_blank"
                  {...trackAttrs('whatsapp_click', { placement: 'footer' })}
                >
                  <IconWhatsapp />
                  Über WhatsApp schreiben
                  <span className="sr-only">(öffnet in neuem Tab)</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-white/85">
                <IconClock className="mt-1 flex-none" />
                <span>
                  Büro {business.officeHours.days}
                  <br />
                  {business.officeHours.from}–{business.officeHours.to} Uhr
                  <span className="mt-1 block text-sm text-white/70">
                    Pflegeeinsätze finden auch außerhalb dieser Zeiten statt.
                  </span>
                </span>
              </li>
            </ul>
            <p className="mt-5 text-sm text-white/70">
              Fax {business.fax}
            </p>
          </div>

          {footerNav.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="text-lg text-white">{col.heading}</h2>
              <span className="horizont mt-3" aria-hidden="true" />
              <ul className="m-0 list-none space-y-2.5 p-0">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-block py-1 text-white/90 underline decoration-1 underline-offset-4 hover:text-white hover:decoration-2">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 grid gap-6 border-t border-white/20 pt-8 sm:grid-cols-2">
          {business.locations.map((l) => (
            <p key={l.id} className="m-0 flex items-start gap-2.5 text-white/85">
              <IconPin className="mt-1 flex-none" />
              <span>
                <span className="block font-bold text-white">
                  {l.role} {l.city}
                </span>
                {l.street}
                <br />
                {l.postalCode} {l.city}
              </span>
            </p>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/20 pt-6 text-sm text-white/75 sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0">
            {business.legalName} · Inhaber {business.ownerShort} · {business.approval}
          </p>
          <p className="m-0 flex gap-5">
            <Link href="/impressum" className="inline-block py-1 text-white/90 underline underline-offset-4">Impressum</Link>
            <Link href="/datenschutz" className="inline-block py-1 text-white/90 underline underline-offset-4">Datenschutz</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
