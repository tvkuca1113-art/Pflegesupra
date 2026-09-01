'use client';

import type { FaqItem } from '@/content/faq';
import { track } from '@/lib/analytics';

/**
 * FAQ accordion built on <details>/<summary>.
 *
 * Native elements are used on purpose: keyboard operation, the expanded state
 * exposed to screen readers, and find-in-page all come from the platform and
 * cannot be broken by us. It also means every answer is present in the HTML,
 * so the FAQPage structured data matches what a crawler sees — Google requires
 * that the content be visible on the page.
 */
export default function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="mt-2">
      {items.map((f) => (
        <details
          key={f.id}
          id={f.id}
          className="group scroll-mt-28 border-b border-[var(--color-line)]"
          onToggle={(e) => {
            if ((e.currentTarget as HTMLDetailsElement).open) track('faq_open', { id: f.id });
          }}
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 text-[var(--text-lg)] font-bold text-[var(--color-brand-ink)] [&::-webkit-details-marker]:hidden">
            {f.question}
            {/* Plus/minus drawn in CSS, not an emoji or a glyph font. */}
            <span
              aria-hidden="true"
              className="relative mt-2 h-4 w-4 flex-none"
            >
              <span className="absolute inset-x-0 top-1.5 h-1 bg-[var(--color-sun)]" />
              <span className="absolute inset-y-0 left-1.5 w-1 bg-[var(--color-sun)] transition-transform group-open:scale-y-0" />
            </span>
          </summary>
          <div className="prose pb-5 text-[var(--color-ink-muted)]">
            {f.answer.map((p) => <p key={p}>{p}</p>)}
          </div>
        </details>
      ))}
    </div>
  );
}
