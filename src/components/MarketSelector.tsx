import type { MarketCategory } from "@/lib/types";
import { MARKET_CATEGORIES } from "@/lib/markets";

interface MarketSelectorProps {
  category: MarketCategory;
  onChange: (category: MarketCategory) => void;
}

export function MarketSelector({ category, onChange }: MarketSelectorProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#141414] p-5">
      <h2 className="mb-4 text-sm font-semibold text-white">Market</h2>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {MARKET_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.id)}
            className={`rounded-xl border px-4 py-3 text-left transition ${
              category === cat.id
                ? "border-[#ff444f]/60 bg-[#ff444f]/10"
                : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]"
            }`}
          >
            <span
              className={`block text-sm font-medium ${
                category === cat.id ? "text-[#ff6b73]" : "text-white"
              }`}
            >
              {cat.label}
            </span>
            <span className="mt-0.5 block text-xs text-zinc-500">
              {cat.description}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
