import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeader, CtaBand, Breadcrumbs, SectionHead } from '@/components/Blocks';
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

      {/* The three questions a reader has before any description: who pays,
          do I qualify, what do I actually get. Answered before the prose. */}
      <section className="section--tight border-b border-line">
        <dl className="shell m-0 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">
          <div className="bg-white p-5">
            <dt className="text-sm font-bold uppercase tracking-[0.07em] text-ink-accent">
              Wer bezahlt
            </dt>
            <dd className="m-0 mt-1.5 text-lg">{s.payer}</dd>
          </div>
          <div className="bg-white p-5">
            <dt className="text-sm font-bold uppercase tracking-[0.07em] text-ink-accent">
              Voraussetzung
            </dt>
            <dd className="m-0 mt-1.5 text-lg">{s.eligibility}</dd>
          </div>
        </dl>
      </section>

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
              <li key={o.slug} className="border-t-4 border-line pt-3">
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
        title={`${s.name} — passt das zu Ihrer Situation?`}
        body="Im Erstgespräch klären wir das konkret an Ihrem Fall, kostenlos und ohne dass Sie sich zu etwas verpflichten."
      />
    </>
  );
}
