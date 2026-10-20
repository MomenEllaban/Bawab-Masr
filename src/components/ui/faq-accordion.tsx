import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/faq-data";

/**
 * قائمة أسئلة شائعة على شكل أكورديون (details/summary)
 * — تفاعلية بدون JavaScript وقابلة للوصول بلوحة المفاتيح.
 */
export default function FaqAccordion({
  items,
  initialOpen = 0,
}: {
  items: FaqItem[];
  initialOpen?: number;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <details
          key={item.q}
          name="faq"
          open={index === initialOpen}
          className="card group overflow-hidden p-0 [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-muted/70 lg:px-6">
            <h3 className="text-base font-bold lg:text-lg">{item.q}</h3>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy transition-transform duration-200 group-open:rotate-180">
              <ChevronDown size={18} aria-hidden />
            </span>
          </summary>
          <div className="border-t border-line px-5 py-4 lg:px-6">
            <p className="text-sm leading-loose text-ink-soft lg:text-base">
              {item.a}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
