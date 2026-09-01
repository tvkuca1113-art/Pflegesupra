import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader, Breadcrumbs } from '@/components/Blocks';
import { IconAlert } from '@/components/Icons';
import { JsonLd, breadcrumbJsonLd, pageMeta } from '@/lib/seo';
import { business } from '@/content/business';

export const metadata: Metadata = pageMeta({
  title: 'Datenschutzerklärung',
  description:
    'Welche Daten diese Website verarbeitet, auf welcher Rechtsgrundlage, wie lange sie '
    + 'gespeichert werden und welche Rechte Sie haben.',
  path: '/datenschutz',
});

const trail = [
  { name: 'Start', path: '/' },
  { name: 'Datenschutz', path: '/datenschutz' },
];

export default function DatenschutzPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <Breadcrumbs trail={trail} />
      <PageHeader
        eyebrow="Datenschutz"
        title="Was diese Website mit Ihren Daten macht"
        intro="Kurz vorweg: Diese Website setzt keine Cookies, bindet keine externen Dienste ein und lädt keine Schriftarten von fremden Servern. Personenbezogene Daten entstehen nur, wenn Sie uns aktiv etwas schreiben."
      />

      <section className="section">
        <div className="shell">
          <div className="notice notice--err measure mb-10 flex items-start gap-3">
            <IconAlert className="mt-1 flex-none" />
            <p className="m-0">
              <strong>Hinweis für den Betreiber — vor Veröffentlichung entfernen.</strong>{' '}
              Dieser Text beschreibt die tatsächliche technische Umsetzung dieser Website
              korrekt, ersetzt aber keine Rechtsberatung. Er ist vor dem Livegang durch eine
              qualifizierte Person zu prüfen und um die Angaben zu ergänzen, die nur der
              Betreiber kennt (Auftragsverarbeitungsverträge, Datenschutzbeauftragter,
              tatsächlicher Hoster).
            </p>
          </div>

          <div className="prose">
            <h2>1. Verantwortlicher</h2>
            <p>
              {business.legalName}, Inhaber {business.owner}, {business.locations[0].street},{' '}
              {business.locations[0].postalCode} {business.locations[0].city}.
              <br />
              Telefon {business.phone.display}, E-Mail{' '}
              <a href={`mailto:${business.email}`} className="linkish">{business.email}</a>.
            </p>
            <p className="text-[var(--color-err)]">
              zu bestätigen — ob ein Datenschutzbeauftragter benannt ist und, falls ja,
              dessen Kontaktdaten.
            </p>

            <h2>2. Was beim bloßen Aufrufen der Seite passiert</h2>
            <p>
              Beim Abruf jeder Seite überträgt Ihr Browser technisch notwendige Daten an den
              Server: IP-Adresse, Zeitpunkt, aufgerufene Adresse, übertragene Datenmenge,
              Browser- und Betriebssystemkennung. Diese Daten fallen bei jedem Aufruf einer
              Website an und sind nötig, damit die Seite überhaupt ausgeliefert werden kann.
            </p>
            <p>
              Rechtsgrundlage ist Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO. Unser berechtigtes
              Interesse besteht am technischen Betrieb und an der Abwehr von Angriffen.
            </p>

            <h2>3. Cookies</h2>
            <p>
              <strong>Diese Website setzt derzeit keine Cookies.</strong> Es gibt kein
              Tracking, keine Werbepixel und keine Reichweitenmessung. Aus diesem Grund
              erscheint auch kein Cookie-Banner: Ein Banner, der um Zustimmung zu etwas
              bittet, das gar nicht stattfindet, wäre irreführend.
            </p>
            <p>
              Sollte künftig eine anonyme Reichweitenmessung eingesetzt werden, wird sie erst
              nach Ihrer ausdrücklichen Einwilligung geladen, und dieser Abschnitt wird
              entsprechend ergänzt.
            </p>

            <h2>4. Schriftarten und externe Inhalte</h2>
            <p>
              Die verwendete Schriftart wird <strong>von unserem eigenen Server</strong>{' '}
              ausgeliefert. Es besteht keine Verbindung zu Google Fonts oder einem anderen
              Drittanbieter, und es wird dabei keine IP-Adresse an Dritte übertragen.
            </p>
            <p>
              Es sind keine Karten, Videos, Social-Media-Plugins oder sonstigen externen
              Inhalte eingebettet. Links auf Seiten Dritter — etwa auf die Beratungsangebote
              der Stadt München oder des Landkreises Pfaffenhofen — sind reine Verweise; erst
              wenn Sie sie anklicken, verlassen Sie diese Website.
            </p>

            <h2>5. Kontakt- und Bewerbungsformular</h2>
            <p>
              Wenn Sie das Formular absenden, verarbeiten wir die Angaben, die Sie eingetragen
              haben: Nachname und E-Mail-Adresse als Pflichtangaben, sowie freiwillig Vorname,
              Telefonnummer, Anliegen beziehungsweise Position und Ihre Nachricht. Haben Sie
              zuvor den Pflege-Kompass genutzt, werden die dort gewählten Angaben
              (Pflegegrad, Art des Bedarfs, Ort) mitgesendet — sie werden Ihnen vor dem
              Absenden angezeigt.
            </p>
            <p>
              Rechtsgrundlage ist Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;a DSGVO (Ihre Einwilligung,
              die Sie mit dem Setzen des Häkchens erteilen) sowie Art.&nbsp;6 Abs.&nbsp;1
              lit.&nbsp;b DSGVO, soweit die Anfrage auf den Abschluss eines Pflegevertrags
              gerichtet ist. Bei Bewerbungen ist Rechtsgrundlage zusätzlich §26 BDSG.
            </p>
            <p>
              <strong>Bitte übermitteln Sie über das Formular keine Gesundheitsdaten</strong>{' '}
              — also keine Diagnosen, Befunde oder Medikamente. Für solche Angaben ist das
              Telefon oder das persönliche Gespräch der richtige Weg. Wenn Sie sie dennoch
              eintragen, verarbeiten wir sie auf Grundlage Ihrer ausdrücklichen Einwilligung
              nach Art.&nbsp;9 Abs.&nbsp;2 lit.&nbsp;a DSGVO.
            </p>
            <p>
              Sie können Ihre Einwilligung jederzeit für die Zukunft widerrufen, formlos an{' '}
              <a href={`mailto:${business.email}`} className="linkish">{business.email}</a>.
            </p>

            <h2>6. Schutz vor Missbrauch des Formulars</h2>
            <p>
              Um automatisierte Massenzusendungen zu verhindern, bilden wir beim Absenden
              einen <strong>gesalzenen Hashwert Ihrer IP-Adresse</strong> und speichern
              ausschließlich diesen Hashwert für maximal zwei Stunden. Die IP-Adresse selbst
              wird dabei nicht gespeichert, und aus dem Hashwert lässt sie sich nicht
              zurückrechnen. Rechtsgrundlage ist Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO;
              unser berechtigtes Interesse ist die Abwehr von Spam.
            </p>
            <p>
              Ein Captcha-Dienst wird bewusst nicht eingesetzt — er würde Daten an einen
              Drittanbieter übertragen und die Bedienung für Menschen mit Einschränkungen
              erschweren.
            </p>

            <h2>7. Empfänger und Auftragsverarbeiter</h2>
            <p>
              Die Formulardaten werden in einer Datenbank des Anbieters{' '}
              <strong>Supabase</strong> gespeichert. Der eingesetzte Datenbankstandort liegt
              innerhalb der Europäischen Union (Irland). Eine Übermittlung in ein Drittland
              findet dabei nicht statt.
            </p>
            <p className="text-[var(--color-err)]">
              zu bestätigen — Abschluss eines Auftragsverarbeitungsvertrags mit dem
              Datenbankanbieter und dem Hoster, sowie Ergänzung des tatsächlichen Hosters
              mit vollständiger Anschrift.
            </p>

            <h2>8. Speicherdauer</h2>
            <ul>
              <li>Formularanfragen: zwei Jahre nach Bearbeitung, danach automatische Löschung.</li>
              <li>Hashwerte zur Spam-Abwehr: maximal zwei Stunden.</li>
              <li>Bewerbungen: sechs Monate nach Abschluss des Verfahrens, sofern Sie keiner längeren Speicherung zustimmen.</li>
            </ul>
            <p>
              Gesetzliche Aufbewahrungsfristen — etwa aus dem Handels- und Steuerrecht oder
              aus der Pflegedokumentation — bleiben davon unberührt und gehen vor.
            </p>

            <h2>9. Ihre Rechte</h2>
            <p>
              Sie haben das Recht auf Auskunft (Art.&nbsp;15 DSGVO), Berichtigung
              (Art.&nbsp;16), Löschung (Art.&nbsp;17), Einschränkung der Verarbeitung
              (Art.&nbsp;18), Datenübertragbarkeit (Art.&nbsp;20) und Widerspruch
              (Art.&nbsp;21). Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für
              die Zukunft widerrufen.
            </p>
            <p>
              Wenden Sie sich dafür an{' '}
              <a href={`mailto:${business.email}`} className="linkish">{business.email}</a>{' '}
              oder rufen Sie unter{' '}
              <a href={business.phone.href} className="linkish">{business.phone.display}</a> an.
            </p>
            <p>
              Unabhängig davon steht Ihnen ein Beschwerderecht bei einer Aufsichtsbehörde zu.
              Zuständig ist in Bayern für nicht-öffentliche Stellen das{' '}
              <a
                href="https://www.lda.bayern.de/"
                className="linkish"
                rel="noopener noreferrer"
                target="_blank"
              >
                Bayerische Landesamt für Datenschutzaufsicht (BayLDA)
                <span className="sr-only"> (öffnet in neuem Tab)</span>
              </a>.
            </p>

            <h2>10. Änderungen</h2>
            <p>
              Ändert sich die technische Umsetzung dieser Website, ändern wir auch diesen
              Text. Maßgeblich ist die jeweils hier veröffentlichte Fassung.
            </p>

            <p className="mt-10">
              <Link href="/impressum" className="linkish font-bold">Zum Impressum</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
