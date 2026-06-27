"use client";

import { useCallback, useMemo, useState } from "react";
import { calculate } from "@/lib/calculator";
import {
  getDefaultInstrument,
  getInstrumentById,
} from "@/lib/markets";
import type {
  AccountSettings,
  CalculationResult,
  MarketCategory,
  TradeSettings,
} from "@/lib/types";

const DEFAULT_ACCOUNT: AccountSettings = {
  balance: 0,
  currency: "USD",
  riskType: "percentage",
  riskValue: 0,
};

function defaultTrade(category: MarketCategory): TradeSettings {
  const instrument = getDefaultInstrument(category);

  return {
    instrumentId: instrument.id,
    direction: "buy",
    entryPrice: 0,
    stopLoss: 0,
    takeProfit: 0,
  };
}

export function useCalculator() {
  const [category, setCategory] = useState<MarketCategory>("volatility");
  const [account, setAccount] = useState<AccountSettings>(DEFAULT_ACCOUNT);
  const [trade, setTrade] = useState<TradeSettings>(() =>
    defaultTrade("volatility")
  );
  const [copied, setCopied] = useState(false);

  const instrument = useMemo(
    () => getInstrumentById(trade.instrumentId),
    [trade.instrumentId]
  );

  const result: CalculationResult = useMemo(() => {
    if (!instrument) {
      return {
        riskAmount: 0,
        stopLossDistance: 0,
        stopLossDistanceLabel: "—",
        recommendedLot: 0,
        amountAtRisk: 0,
        potentialProfit: 0,
        riskRewardRatio: 0,
        positionValue: 0,
        isValid: false,
        warnings: ["Instrument not found"],
      };
    }
    return calculate(account, trade, instrument);
  }, [account, trade, instrument]);

  const updateAccount = useCallback(
    (patch: Partial<AccountSettings>) => {
      setAccount((prev) => ({ ...prev, ...patch }));
    },
    []
  );

  const updateTrade = useCallback((patch: Partial<TradeSettings>) => {
    setTrade((prev) => ({ ...prev, ...patch }));
  }, []);

  const changeCategory = useCallback((newCategory: MarketCategory) => {
    setCategory(newCategory);
    setTrade(defaultTrade(newCategory));
  }, []);

  const copyLotSize = useCallback(async () => {
    if (!instrument || !result.isValid) return;
    const lot = result.recommendedLot.toFixed(
      instrument.lotStep.toString().split(".")[1]?.length ?? 3
    );
    await navigator.clipboard.writeText(lot);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [instrument, result]);

  return {
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
  };
}
