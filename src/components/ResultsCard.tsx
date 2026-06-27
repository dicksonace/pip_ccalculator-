import type { CalculationResult, Instrument } from "@/lib/types";
import { formatCurrency, formatLot } from "@/lib/calculator";

interface ResultsCardProps {
  result: CalculationResult;
  instrument: Instrument | undefined;
  currency: string;
  copied: boolean;
  onCopyLot: () => void;
}

interface StatProps {
  label: string;
  value: string;
  highlight?: boolean;
  accent?: "green" | "red" | "brand";
}

function Stat({ label, value, highlight, accent }: StatProps) {
  const valueClass = highlight
    ? accent === "green"
      ? "text-emerald-400"
      : accent === "red"
        ? "text-red-400"
        : "text-[#ff6b73]"
    : "text-white";

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className={`mt-1 text-lg font-semibold tabular-nums ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}

export function ResultsCard({
  result,
  instrument,
  currency,
  copied,
  onCopyLot,
}: ResultsCardProps) {
  const rrLabel =
    result.isValid && result.riskRewardRatio > 0
      ? `1 : ${result.riskRewardRatio.toFixed(2)}`
      : "—";

  const displayCurrency = (value: number) =>
    result.isValid ? formatCurrency(value, currency) : "—";

  return (
    <section className="rounded-2xl border border-white/10 bg-[#141414] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Results</h2>
        {result.isValid && instrument && (
          <button
            type="button"
            onClick={onCopyLot}
            className="rounded-lg border border-[#ff444f]/30 bg-[#ff444f]/10 px-3 py-1.5 text-xs font-medium text-[#ff6b73] transition hover:bg-[#ff444f]/20"
          >
            {copied ? "Copied!" : "Copy Lot Size"}
          </button>
        )}
      </div>

      {result.hint && (
        <p className="mb-4 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-xs text-zinc-500">
          {result.hint}
        </p>
      )}

      {result.warnings.length > 0 && (
        <div className="mb-4 space-y-1">
          {result.warnings.map((w) => (
            <p
              key={w}
              className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-300"
            >
              {w}
            </p>
          ))}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Stat
          label="Risk Amount"
          value={displayCurrency(result.riskAmount)}
        />
        <Stat
          label={`SL Distance (${result.stopLossDistanceLabel})`}
          value={
            result.isValid
              ? result.stopLossDistance.toLocaleString()
              : "—"
          }
        />
        <Stat
          label="Recommended Lot"
          value={
            instrument
              ? formatLot(result.recommendedLot, instrument.lotStep)
              : "—"
          }
          highlight
          accent="brand"
        />
        <Stat
          label="Amount at Risk"
          value={displayCurrency(result.amountAtRisk)}
          highlight={result.isValid}
          accent="red"
        />
        <Stat
          label="Potential Profit"
          value={
            result.isValid && result.potentialProfit > 0
              ? formatCurrency(result.potentialProfit, currency)
              : "—"
          }
          highlight={result.isValid && result.potentialProfit > 0}
          accent="green"
        />
        <Stat label="Risk : Reward" value={rrLabel} />
        <Stat
          label="Position Value"
          value={
            result.isValid
              ? formatCurrency(result.positionValue, currency)
              : "—"
          }
        />
      </div>
    </section>
  );
}
