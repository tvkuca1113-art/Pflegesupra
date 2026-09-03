import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeader, CtaBand, Breadcrumbs, SectionHead, Source, ProcessStrip } from '@/components/Blocks';
import FaqList from '@/components/FaqList';
import { faq } from '@/content/faq';
import { IconPin, IconPhone, IconMail, IconClock, IconExternal, IconArrow } from '@/components/Icons';
import { JsonLd, breadcrumbJsonLd, pageMeta } from '@/lib/seo';
import { areas, areaBySlug } from '@/content/areas';
import { business } from '@/content/business';
import { services } from '@/content/services';

export function generateStaticParams() {
  return areas.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const a = areaBySlug(slug);
  if (!a) return pageMeta({ title: 'Nicht gefunden', description: '', path: '/', noindex: true });
  return pageMeta({ title: a.seoTitle, description: a.metaDescription, path: `/einsatzgebiet/${a.slug}` });
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = areaBySlug(slug);
  if (!a) notFound();

  const loc = business.locations.find((l) => l.slug === a.slug)!;
  const other = areas.find((x) => x.slug !== a.slug)!;
  const trail = [
    { name: 'Start', path: '/' },
    { name: 'Einsatzgebiet', path: `/einsatzgebiet/${a.slug}` },
    { name: a.city, path: `/einsatzgebiet/${a.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <Breadcrumbs trail={trail} />
      <PageHeader eyebrow="Einsatzgebiet" title={a.seoTitle} intro={a.presence} />

      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <div>
            <SectionHead title={`Ob wir zu Ihnen kommen`} />
            <p className="measure text-lg">{a.coverage}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={business.phone.href} className="btn btn--primary">
                <IconPhone />
                {business.phone.display}
              </a>
              <Link href="/kontakt" className="btn btn--secondary">
                Pflege in {a.city} anfragen <IconArrow />
              </Link>
            </div>

            <div className="mt-12 space-y-9">
              {a.localNotes.map((n) => (
                <div key={n.heading} className="border-t border-line pt-5 first:border-t-0 first:pt-0">
                  <h2 className="text-xl">{n.heading}</h2>
                  <p className="measure mt-2 text-ink-muted">{n.body}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="self-start">
            <div className="rounded-lg border-2 border-brand p-6">
              <h2 className="flex items-center gap-2 text-xl">
                <IconPin className="text-brand" />
                {loc.role} {loc.city}
              </h2>
              <address className="mt-2 not-italic text-ink-muted">
                {loc.street}
                <br />
                {loc.postalCode} {loc.city}
              </address>
              <p className="mt-3 flex items-start gap-2 text-ink-muted">
                <IconClock className="mt-1 flex-none" />
                <span>
                  Büro {business.officeHours.days}, {business.officeHours.from}–{business.officeHours.to} Uhr.
                  Pflegeeinsätze finden auch außerhalb dieser Zeiten statt.
                </span>
              </p>
            </div>

            {/* Independent public advice. Linking to a service that competes for
                the same attention is deliberate: it is what a trustworthy
                provider does, and it is what E-E-A-T actually looks like. */}
            <div className="mt-6 rounded-lg bg-paper-warm p-6">
              <p className="eyebrow">Unabhängige Beratung</p>
              <h2 className="text-xl">{a.officialAdvice.name}</h2>
              <p className="mt-2 text-ink-muted">{a.officialAdvice.what}</p>
              <ul className="m-0 mt-4 list-none space-y-2 p-0 text-ink">
                {a.officialAdvice.address ? (
                  <li className="flex items-start gap-2"><IconPin className="mt-1 flex-none" />{a.officialAdvice.address}</li>
                ) : null}
                {a.officialAdvice.phone ? (
                  <li className="flex items-start gap-2">
                    <IconPhone className="mt-1 flex-none" />
                    <a href={`tel:${a.officialAdvice.phone.replace(/[^+\d]/g, '')}`} className="linkish">
                      {a.officialAdvice.phone}
                    </a>
                  </li>
                ) : null}
                {a.officialAdvice.email ? (
                  <li className="flex items-start gap-2">
                    <IconMail className="mt-1 flex-none" />
                    <a href={`mailto:${a.officialAdvice.email}`} className="linkish break-all">{a.officialAdvice.email}</a>
                  </li>
                ) : null}
                {a.officialAdvice.hours ? (
                  <li className="flex items-start gap-2"><IconClock className="mt-1 flex-none" />{a.officialAdvice.hours}</li>
                ) : null}
              </ul>
              <a
                href={a.officialAdvice.url}
                className="linkish mt-4 inline-flex items-center gap-2 font-bold"
                rel="noopener noreferrer"
                target="_blank"
              >
                Zur offiziellen Seite
                <IconExternal />
                <span className="sr-only">(öffnet in neuem Tab)</span>
              </a>
              <Source label={a.officialAdvice.source} url={a.officialAdvice.url} />
            </div>
          </aside>
        </div>
      </section>

      <section className="section section--paper">
        <div className="shell">
          <SectionHead title={`Leistungen in ${a.city}`} />
          <ul className="m-0 grid list-none gap-x-8 gap-y-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s.slug} className="border-t-2 border-line-strong pt-3">
                <Link href={`/leistungen/${s.slug}`} className="inline-block py-1 font-bold text-brand no-underline">
                  {s.name}
                </Link>
                <p className="mt-1.5 text-sm text-ink-muted">{s.promise}</p>
              </li>
            ))}
          </ul>
          <p className="mt-9">
            <Link href={`/einsatzgebiet/${other.slug}`} className="linkish inline-block py-1 font-bold">
              Auch in {other.city} sind wir vor Ort
            </Link>
          </p>
        </div>
      </section>

      {/* Everything a visitor who landed here from a search needs before
          deciding: what happens after the call, and the questions they would
          otherwise leave to look up. Neither should require a trip to another
          page. */}
      <section className="section">
        <div className="shell">
          <ProcessStrip />
        </div>
      </section>

      <section className="section section--paper" aria-labelledby="lokale-fragen">
        <div className="shell">
          <SectionHead
            as="h2"
            title="Häufige Fragen zum Start"
          />
          <div className="max-w-[62rem]">
            <FaqList items={faq.filter((f) => ['erster-schritt', 'ohne-pflegegrad', 'kosten-vorstrecken', 'wer-kommt'].includes(f.id))} />
          </div>
          <p className="mt-7">
            <Link href="/fragen-und-antworten" className="linkish inline-block py-1 font-bold">
              Alle Fragen und Antworten
            </Link>
          </p>
        </div>
      </section>

      <CtaBand
        title={`Pflege in ${a.city} — reden wir darüber.`}
        body="Sagen Sie uns Ihre Straße. Sie bekommen eine klare Antwort, ob wir Sie versorgen können, und wenn nicht, sagen wir Ihnen, wen Sie stattdessen fragen sollten."
      />
    </>
  );
}
