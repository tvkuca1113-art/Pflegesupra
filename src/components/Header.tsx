'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { primaryNav } from '@/content/nav';
import { business } from '@/content/business';
import { IconPhone, IconMenu, IconClose, IconArrow } from './Icons';
import { track } from '@/lib/analytics';

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close on navigation.
  useEffect(() => { setOpen(false); }, [pathname]);

  // Escape closes and returns focus to the control that opened the drawer.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); }
      if (e.key !== 'Tab') return;
      // Trap focus inside the drawer while it is open.
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <a className="skip" href="#inhalt">Zum Hauptinhalt springen</a>

      {/* Utility strip. The phone number is the single most valuable element on
          this site, so it sits above everything and never scrolls out of reach
          on desktop. */}
      <div className="on-dark bg-brand-deep text-white">
        <div className="shell flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2 text-sm">
          {/* Short on phones, full from tablet up. The long version wrapped to
              two lines and, with the number below it, pushed the headline most
              of a screen down before anyone had read a word. */}
          <p className="m-0">
            <span className="sm:hidden">Ambulante Pflege · München &amp; Pfaffenhofen</span>
            <span className="hidden sm:inline">
              Ambulante Pflege zu Hause · München &amp; Pfaffenhofen a.d. Ilm
            </span>
          </p>
          {/* Hidden on phones: the sticky action bar carries the number there,
              and repeating it here only costs vertical space above the fold. */}
          <p className="m-0 hidden items-center gap-2 sm:flex">
            <span className="text-white/80">Büro {business.officeHours.from}–{business.officeHours.to} Uhr</span>
            <a
              href={business.phone.href}
              className="inline-flex items-center gap-2 font-bold text-white underline decoration-2 underline-offset-4"
              onClick={() => track('phone_click', { placement: 'header_strip' })}
            >
              <IconPhone />
              {business.phone.display}
            </a>
          </p>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="shell flex items-center justify-between gap-4 py-3">
          <Link href="/" className="flex-none" aria-label={`${business.legalName} — zur Startseite`}>
            <Image
              src="/logo-supra.png"
              alt={business.legalName}
              width={260}
              height={184}
              priority
              className="h-12 w-auto sm:h-16"
            />
          </Link>

          <nav aria-label="Hauptnavigation" className="hidden lg:block">
            <ul className="m-0 flex list-none items-center gap-1 p-0">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className="relative block rounded px-3 py-2.5 font-semibold text-brand-ink no-underline hover:bg-[#eef2fb]"
                  >
                    {item.label}
                    {/* The active marker is the Horizont, 4px of brand orange —
                        the one place orange appears in the chrome. */}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3 -bottom-0.5 h-1 bg-sun ${
                        isActive(item.href) ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-none items-center gap-2">
            <Link href="/kontakt" className="btn btn--primary hidden sm:inline-flex">
              Beratung anfragen
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className="btn btn--secondary lg:hidden"
              aria-expanded={open}
              aria-controls="mobilmenue"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <IconClose /> : <IconMenu />}
              <span>{open ? 'Schließen' : 'Menü'}</span>
            </button>
          </div>
        </div>

        {/* Mobile drawer. Each entry carries a hint, so a reader who is not sure
            what "Verhinderungspflege" means does not have to guess-and-click. */}
        <div
          id="mobilmenue"
          ref={panelRef}
          hidden={!open}
          className="max-h-[calc(100dvh-8rem)] overflow-y-auto border-t border-line bg-white lg:hidden"
        >
          <nav aria-label="Hauptnavigation (mobil)" className="shell py-4">
            <ul className="m-0 list-none p-0">
              {primaryNav.map((item) => (
                <li key={item.href} className="border-b border-line last:border-0">
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className="flex items-center justify-between gap-3 py-3.5 no-underline"
                  >
                    <span>
                      <span className="block font-bold text-brand-ink">{item.label}</span>
                      {item.hint ? (
                        <span className="block text-sm text-ink-muted">
                          {item.hint}
                        </span>
                      ) : null}
                    </span>
                    <IconArrow className="flex-none text-brand" />
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/kontakt" className="btn btn--primary mt-4 w-full">
              Beratung anfragen
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
