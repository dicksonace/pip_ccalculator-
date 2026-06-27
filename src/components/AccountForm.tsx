import type { AccountSettings } from "@/lib/types";
import { CURRENCIES } from "@/lib/markets";

interface AccountFormProps {
  account: AccountSettings;
  onChange: (patch: Partial<AccountSettings>) => void;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
      {children}
    </label>
  );
}

function NumberInput({
  value,
  onChange,
  placeholder,
  min,
  max,
  step,
}: {
  value: number;
  onChange: (v: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <input
      type="number"
      value={value > 0 ? value : ""}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      onChange={(e) => {
        const raw = e.target.value;
        onChange(raw === "" ? 0 : parseFloat(raw) || 0);
      }}
      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-[#ff444f]/50 focus:ring-1 focus:ring-[#ff444f]/30"
    />
  );
}

export function AccountForm({ account, onChange }: AccountFormProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#141414] p-5">
      <h2 className="mb-4 text-sm font-semibold text-white">Account Settings</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel>Balance</FieldLabel>
          <NumberInput
            value={account.balance}
            onChange={(v) => onChange({ balance: v })}
            placeholder="e.g. 1000"
            min={0}
            step={100}
          />
        </div>

        <div>
          <FieldLabel>Currency</FieldLabel>
          <select
            value={account.currency}
            onChange={(e) => onChange({ currency: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#ff444f]/50 focus:ring-1 focus:ring-[#ff444f]/30"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c} className="bg-[#141414]">
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <FieldLabel>Risk Type</FieldLabel>
          <div className="flex rounded-lg border border-white/10 bg-white/5 p-1">
            {(["percentage", "fixed"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onChange({ riskType: type })}
                className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition ${
                  account.riskType === type
                    ? "bg-[#ff444f] text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {type === "percentage" ? "% of Balance" : "Fixed Amount"}
              </button>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <FieldLabel>
            {account.riskType === "percentage" ? "Risk %" : "Risk Amount"}
          </FieldLabel>
          <NumberInput
            value={account.riskValue}
            onChange={(v) => onChange({ riskValue: v })}
            placeholder={account.riskType === "percentage" ? "e.g. 2" : "e.g. 20"}
            min={0}
            step={account.riskType === "percentage" ? 0.5 : 10}
            max={account.riskType === "percentage" ? 100 : undefined}
          />
        </div>
      </div>
    </section>
  );
}
