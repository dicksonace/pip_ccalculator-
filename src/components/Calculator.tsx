"use client";

import { Header } from "@/components/Header";
import { AccountForm } from "@/components/AccountForm";
import { MarketSelector } from "@/components/MarketSelector";
import { TradeForm } from "@/components/TradeForm";
import { ResultsCard } from "@/components/ResultsCard";
import { useCalculator } from "@/hooks/useCalculator";

export function Calculator() {
  const {
    category,
    account,
    trade,
    instrument,
    result,
    copied,
    updateAccount,
    updateTrade,
    changeCategory,
    copyLotSize,
  } = useCalculator();

  return (
    <div className="min-h-full bg-[#0a0a0a]">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-3">
            <AccountForm account={account} onChange={updateAccount} />
            <MarketSelector category={category} onChange={changeCategory} />
            <TradeForm
              category={category}
              trade={trade}
              instrument={instrument}
              onChange={updateTrade}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-6">
              <ResultsCard
                result={result}
                instrument={instrument}
                currency={account.currency}
                copied={copied}
                onCopyLot={copyLotSize}
              />

              <p className="mt-4 text-center text-xs leading-relaxed text-zinc-600">
                Calculations are estimates based on Deriv MT5 contract specs.
                Always verify lot size on your platform before trading.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
