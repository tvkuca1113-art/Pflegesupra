import type { Metadata } from 'next';
import { PageHeader, Breadcrumbs } from '@/components/Blocks';
import { IconAlert } from '@/components/Icons';
import { JsonLd, breadcrumbJsonLd, pageMeta } from '@/lib/seo';
import { business } from '@/content/business';

export const metadata: Metadata = pageMeta({
  title: 'Impressum',
  description: 'Anbieterkennzeichnung nach §5 DDG (vormals §5 TMG) für supra-pd.de.',
  path: '/impressum',
});

const trail = [
  { name: 'Start', path: '/' },
  { name: 'Impressum', path: '/impressum' },
];

export default function ImpressumPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <Breadcrumbs trail={trail} />
      <PageHeader eyebrow="Pflichtangaben" title="Impressum" />

      <section className="section">
        <div className="shell">
          {/* This banner is for the client, and it is meant to be removed only
              once a qualified person has actually signed the text off. */}
          <div className="notice notice--err measure mb-10 flex items-start gap-3">
            <IconAlert className="mt-1 flex-none" />
            <p className="m-0">
              <strong>Hinweis für den Betreiber — vor Veröffentlichung entfernen.</strong>{' '}
              Dieser Text übernimmt die Angaben der bisherigen Website und ergänzt die
              technisch geänderten Punkte (Hosting). Die mit „zu bestätigen“ markierten
              Felder müssen ergänzt und der gesamte Text muss anwaltlich geprüft werden.
            </p>
          </div>

          <div className="prose">
            <h2>Angaben gemäß §5 DDG (vormals §5 TMG)</h2>
            <dl className="m-0 grid gap-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-[14rem_minmax(0,1fr)]">
              {[
                ['Unternehmen', business.legalName],
                ['Inhaber', business.owner],
                ['Anschrift', `${business.locations[0].street}, ${business.locations[0].postalCode} ${business.locations[0].city}`],
                ['Zweigstelle', `${business.locations[1].street}, ${business.locations[1].postalCode} ${business.locations[1].city}`],
                ['Telefon', business.phone.display],
                ['Fax', business.fax],
                ['E-Mail', business.email],
              ].map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="bg-[var(--color-paper)] p-3 font-bold text-[var(--color-brand-ink)]">{k}</dt>
                  <dd className="m-0 bg-white p-3">{v}</dd>
                </div>
              ))}
              <div className="contents">
                <dt className="bg-[var(--color-paper)] p-3 font-bold text-[var(--color-brand-ink)]">
                  Umsatzsteuer-IdNr.
                </dt>
                <dd className="m-0 bg-white p-3 text-[var(--color-err)]">
                  zu bestätigen — falls vorhanden, hier eintragen (§27a UStG)
                </dd>
              </div>
              <div className="contents">
                <dt className="bg-[var(--color-paper)] p-3 font-bold text-[var(--color-brand-ink)]">
                  Zuständige Aufsichtsbehörde
                </dt>
                <dd className="m-0 bg-white p-3 text-[var(--color-err)]">
                  zu bestätigen — die konkrete Behörde ist mit vollständigem Namen und
                  Anschrift zu benennen
                </dd>
              </div>
              <div className="contents">
                <dt className="bg-[var(--color-paper)] p-3 font-bold text-[var(--color-brand-ink)]">
                  Berufsbezeichnung &amp; berufsrechtliche Regelungen
                </dt>
                <dd className="m-0 bg-white p-3 text-[var(--color-err)]">
                  zu bestätigen — Berufsbezeichnung, verleihender Staat und Fundstelle der
                  berufsrechtlichen Regelungen
                </dd>
              </div>
            </dl>

            <p>
              {business.legalName} ist ein zugelassener Pflegedienstleister im Sinne des
              SGB&nbsp;XI und unterliegt der Aufsicht der zuständigen Landesbehörde in Bayern.
            </p>

            <h2>Verantwortlich für den Inhalt</h2>
            <p>
              {business.owner}, Anschrift wie oben.
            </p>

            <h2>Haftung für Inhalte</h2>
            <p>
              Als Diensteanbieter sind wir gemäß §7 Abs.&nbsp;1 DDG für eigene Inhalte auf
              diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§8 bis 10 DDG
              sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
              gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen,
              die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
            <p>
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach
              den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung
              ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung
              möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir
              diese Inhalte umgehend entfernen.
            </p>

            <h2>Haftung für Links</h2>
            <p>
              Diese Website enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir
              keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine
              Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige
              Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden
              zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft;
              rechtswidrige Inhalte waren nicht erkennbar. Bei Bekanntwerden von
              Rechtsverletzungen werden derartige Links umgehend entfernt.
            </p>

            <h2>Urheberrecht</h2>
            <p>
              Die durch den Betreiber, dessen Mitarbeiterinnen und Mitarbeiter und beauftragte
              Dritte erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
              Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
              Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der vorherigen
              schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>

            <h2>Bildmaterial</h2>
            <p>
              Diese Website verwendet keine Fotografien von Personen. Die verwendeten
              grafischen Elemente wurden eigens für diese Website erstellt. Das Logo ist
              Eigentum des Betreibers.
            </p>

            <h2>Hosting</h2>
            <p className="text-[var(--color-err)]">
              zu bestätigen — hier ist der tatsächlich eingesetzte Hoster mit vollständiger
              Anschrift einzutragen, sobald die Seite produktiv geschaltet ist. Bei einem
              Betrieb über Vercel ist das die Vercel Inc. mit dem für die EU maßgeblichen
              Vertragspartner; bei einem Betrieb im bisherigen Hosting die Strato AG,
              Pascalstraße 10, 10587 Berlin.
            </p>

            <h2>Streitbeilegung</h2>
            <p>
              Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor
              einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
