import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader, CtaBand, Breadcrumbs } from '@/components/Blocks';
import { JsonLd, breadcrumbJsonLd, faqJsonLd, pageMeta } from '@/lib/seo';
import { faq, faqCategories } from '@/content/faq';
import FaqList from '@/components/FaqList';

export const metadata: Metadata = pageMeta({
  title: 'Fragen & Antworten zur ambulanten Pflege',
  description:
    'Erster Schritt, Pflegegrad, Kosten, Abrechnung, Verhinderungspflege — die Fragen, '
    + 'die uns am häufigsten erreichen, ehrlich beantwortet.',
  path: '/fragen-und-antworten',
});

const trail = [
  { name: 'Start', path: '/' },
  { name: 'Fragen & Antworten', path: '/fragen-und-antworten' },
];

export default function FaqPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <JsonLd data={faqJsonLd(faq)} />
      <Breadcrumbs trail={trail} />
      <PageHeader
        eyebrow="Fragen & Antworten"
        title="Was uns am häufigsten gefragt wird"
        intro="Ohne Marketingsprache. Wo eine ehrliche Antwort unbequem ist, steht sie trotzdem hier."
      />

      <section className="section">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
          {/* Anchor navigation — helps on a long page and works without JS. */}
          <nav aria-label="Themen" className="self-start lg:sticky lg:top-28">
            <h2 className="text-lg">Themen</h2>
            <span className="horizont mt-3" aria-hidden="true" />
            <ul className="m-0 list-none space-y-2 p-0">
              {faqCategories.map((c) => (
                <li key={c}>
                  <a href={`#${encodeURIComponent(c)}`} className="linkish inline-block py-1">{c}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            {faqCategories.map((c) => {
              const items = faq.filter((f) => f.category === c);
              if (!items.length) return null;
              return (
                <section key={c} id={encodeURIComponent(c)} className="mb-12 scroll-mt-28">
                  <h2 className="text-2xl">{c}</h2>
                  <span className="horizont mt-3" aria-hidden="true" />
                  <FaqList items={items} />
                </section>
              );
            })}

            <div className="rounded-lg border-2 border-line bg-paper p-6">
              <h2 className="text-xl">Ihre Frage ist nicht dabei?</h2>
              <p className="mt-2 text-ink-muted">
                Dann stellen Sie sie uns direkt. Sie kostet nichts und verpflichtet zu nichts.
              </p>
              <Link href="/kontakt" className="btn btn--primary mt-4">Frage stellen</Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
