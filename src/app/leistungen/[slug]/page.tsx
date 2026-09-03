import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeader, CtaBand, Breadcrumbs, SectionHead, EditorialImage } from '@/components/Blocks';
import { IconAlert, IconArrow } from '@/components/Icons';
import { JsonLd, breadcrumbJsonLd, pageMeta, serviceJsonLd } from '@/lib/seo';
import { services, serviceBySlug } from '@/content/services';
import { faq } from '@/content/faq';

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) return pageMeta({ title: 'Nicht gefunden', description: '', path: '/leistungen', noindex: true });
  return pageMeta({
    title: s.seoTitle,
    description: s.metaDescription,
    path: `/leistungen/${s.slug}`,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) notFound();

  const trail = [
    { name: 'Start', path: '/' },
    { name: 'Leistungen', path: '/leistungen' },
    { name: s.name, path: `/leistungen/${s.slug}` },
  ];
  const related = faq.filter((f) => s.faqRefs.includes(f.id));
  const others = services.filter((x) => x.slug !== s.slug);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <JsonLd data={serviceJsonLd(s)} />
      <Breadcrumbs trail={trail} />
      <PageHeader eyebrow={s.legalBasis} title={s.name} intro={s.promise} />

      {/* The questions a reader has before any description: what IS this in
          plain German, who pays, do I qualify, and how do I start. Answered
          above the prose, because a page that leads with a paragraph makes the
          reader work for what they came for.

          The plain-language line under the paragraph reference is the point of
          the block. "§37 SGB V" tells a worried relative nothing; the sentence
          under it tells them everything they needed. */}
      <section className="section--tight border-b border-line">
        <div className="shell">
          <p className="max-w-[62ch] text-lg text-ink">{s.plainLaw}</p>
          <dl className="m-0 mt-7 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
            <div className="bg-surface p-5">
              <dt className="text-sm font-bold uppercase tracking-[0.07em] text-ink-accent">
                Wer bezahlt
              </dt>
              <dd className="m-0 mt-1.5">{s.payer}</dd>
            </div>
            <div className="bg-surface p-5">
              <dt className="text-sm font-bold uppercase tracking-[0.07em] text-ink-accent">
                Voraussetzung
              </dt>
              <dd className="m-0 mt-1.5">{s.eligibility}</dd>
            </div>
            <div className="bg-surface p-5">
              <dt className="text-sm font-bold uppercase tracking-[0.07em] text-ink-accent">
                So fangen Sie an
              </dt>
              <dd className="m-0 mt-1.5">
                Ein Anruf. Den Rest — Antrag, Verordnung, Abstimmung mit der Kasse —
                übernehmen wir mit Ihnen.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* One approved photograph per service, and nothing where the set has
          none — Verhinderungspflege runs without one rather than borrowing a
          picture of a different service. `photo` being optional is the whole
          mechanism; see the note on the type in src/content/services.ts. */}
      {s.photo ? (
        <div className="shell pt-10">
          <EditorialImage
            name={s.photo.name}
            widths={[600, 900, 1400, 1672]}
            ratio={16 / 9}
            sizes="(min-width: 80rem) 76rem, 100vw"
            alt={s.photo.alt}
          />
        </div>
      ) : null}

      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <div>
            <SectionHead title="Das übernehmen wir" />
            <ul className="checklist text-lg">
              {s.includes.map((i) => <li key={i}>{i}</li>)}
            </ul>

            {s.notIncluded?.length ? (
              <div className="mt-10">
                <SectionHead
                  title="Das gehört nicht dazu"
                  intro="Damit am Ende niemand überrascht ist."
                />
                <ul className="m-0 list-none space-y-3 p-0">
                  {s.notIncluded.map((i) => (
                    <li key={i} className="flex items-start gap-2.5 text-ink-muted">
                      <IconAlert className="mt-1 flex-none text-ink-accent" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <aside className="self-start rounded-lg border-2 border-line bg-paper p-6">
            <h2 className="text-xl">Häufige Fragen dazu</h2>
            <span className="horizont mt-3" aria-hidden="true" />
            {related.length ? (
              <ul className="m-0 list-none space-y-5 p-0">
                {related.map((f) => (
                  <li key={f.id}>
                    <h3 className="text-lg">{f.question}</h3>
                    <p className="mt-1.5 text-ink-muted">{f.answer[0]}</p>
                  </li>
                ))}
              </ul>
            ) : null}
            <Link href="/fragen-und-antworten" className="btn btn--secondary mt-6 w-full">
              Alle Fragen <IconArrow />
            </Link>
          </aside>
        </div>
      </section>

      <section className="section section--paper">
        <div className="shell">
          <SectionHead
            title="Weitere Leistungen"
            intro="Die meisten Versorgungen bestehen aus mehreren dieser Bausteine."
          />
          <ul className="m-0 grid list-none gap-x-8 gap-y-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => (
              <li key={o.slug} className="border-t-2 border-line-strong pt-3">
                <Link href={`/leistungen/${o.slug}`} className="inline-block py-1 font-bold text-brand no-underline">
                  {o.name}
                </Link>
                <p className="mt-1.5 text-sm text-ink-muted">{o.payer}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        title={`Sind Sie unsicher, ob ${s.name} das Richtige ist?`}
        body="Das müssen Sie nicht selbst entscheiden. Sagen Sie uns, was im Alltag nicht mehr geht — die Zuordnung ist unsere Aufgabe. Das Erstgespräch kostet nichts und verpflichtet zu nichts."
      />
    </>
  );
}
