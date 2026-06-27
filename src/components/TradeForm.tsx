import type { Instrument, TradeSettings } from "@/lib/types";
import { getInstrumentsByCategory } from "@/lib/markets";
import type { MarketCategory } from "@/lib/types";

interface TradeFormProps {
  category: MarketCategory;
  trade: TradeSettings;
  instrument: Instrument | undefined;
  onChange: (patch: Partial<TradeSettings>) => void;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
      {children}
    </label>
  );
}

function PriceInput({
  value,
  onChange,
  placeholder,
  step,
}: {
  value: number;
  onChange: (v: number) => void;
  placeholder: string;
  step: number;
}) {
  return (
    <input
      type="number"
      value={value > 0 ? value : ""}
      placeholder={placeholder}
      step={step}
      onChange={(e) => {
        const raw = e.target.value;
        onChange(raw === "" ? 0 : parseFloat(raw) || 0);
      }}
      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-[#ff444f]/50 focus:ring-1 focus:ring-[#ff444f]/30"
    />
  );
}

export function TradeForm({
  category,
  trade,
  instrument,
  onChange,
}: TradeFormProps) {
  const instruments = getInstrumentsByCategory(category);
  const step = instrument
    ? instrument.tickSize
    : category === "forex"
      ? 0.00001
      : 0.01;

  return (
    <section className="rounded-2xl border border-white/10 bg-[#141414] p-5">
      <h2 className="mb-4 text-sm font-semibold text-white">Trade Details</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FieldLabel>Symbol</FieldLabel>
          <select
            value={trade.instrumentId}
            onChange={(e) => onChange({ instrumentId: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#ff444f]/50 focus:ring-1 focus:ring-[#ff444f]/30"
          >
            {instruments.map((inst) => (
              <option key={inst.id} value={inst.id} className="bg-[#141414]">
                {inst.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <FieldLabel>Direction</FieldLabel>
          <div className="flex gap-2">
            {(["buy", "sell"] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => onChange({ direction: dir })}
                className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium capitalize transition ${
                  trade.direction === dir
                    ? dir === "buy"
                      ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                      : "border-red-500/50 bg-red-500/15 text-red-400"
                    : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                }`}
              >
                {dir}
              </button>
            ))}
          </div>
        </div>

        <div>
          <FieldLabel>Entry Price</FieldLabel>
          <PriceInput
            value={trade.entryPrice}
            onChange={(v) => onChange({ entryPrice: v })}
            placeholder="Entry price"
            step={step}
          />
        </div>

        <div>
          <FieldLabel>Stop Loss</FieldLabel>
          <PriceInput
            value={trade.stopLoss}
            onChange={(v) => onChange({ stopLoss: v })}
            placeholder="Stop loss"
            step={step}
          />
        </div>

        <div className="sm:col-span-2">
          <FieldLabel>Take Profit (optional)</FieldLabel>
          <PriceInput
            value={trade.takeProfit}
            onChange={(v) => onChange({ takeProfit: v })}
            placeholder="Take profit"
            step={step}
          />
        </div>

        {instrument && (
          <div className="sm:col-span-2 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3">
            <p className="text-xs text-zinc-500">
              <span className="text-zinc-400">Contract:</span>{" "}
              {instrument.contractSize.toLocaleString()} units &nbsp;·&nbsp;
              <span className="text-zinc-400">Min lot:</span> {instrument.minLot}{" "}
              &nbsp;·&nbsp;
              <span className="text-zinc-400">Lot step:</span>{" "}
              {instrument.lotStep}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
