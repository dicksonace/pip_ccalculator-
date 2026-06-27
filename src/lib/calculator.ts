import type {
  AccountSettings,
  CalculationResult,
  Instrument,
  TradeSettings,
} from "./types";

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function roundLot(lot: number, step: number): number {
  const decimals = step.toString().split(".")[1]?.length ?? 0;
  // Round down to lot step, with epsilon to avoid 0.099999… → 0.09 instead of 0.1
  const steps = Math.floor(roundTo(lot / step, 10) + 1e-9);
  return roundTo(steps * step, decimals);
}

function clampLot(lot: number, instrument: Instrument): number {
  const rounded = roundLot(lot, instrument.lotStep);
  return Math.min(Math.max(rounded, instrument.minLot), instrument.maxLot);
}

export function calculateRiskAmount(account: AccountSettings): number {
  if (account.riskType === "fixed") {
    return Math.min(account.riskValue, account.balance);
  }
  return (account.balance * account.riskValue) / 100;
}

function calculateForex(
  account: AccountSettings,
  trade: TradeSettings,
  instrument: Instrument
): CalculationResult {
  const warnings: string[] = [];
  const { entryPrice, stopLoss, takeProfit } = trade;

  if (!instrument.pipSize || !instrument.pipValuePerLot) {
    return invalidResult("Missing forex pip configuration");
  }

  const pipSize = instrument.pipSize;
  const stopLossPips = roundTo(
    Math.abs(entryPrice - stopLoss) / pipSize,
    2
  );
  const takeProfitPips = roundTo(
    Math.abs(takeProfit - entryPrice) / pipSize,
    2
  );

  if (stopLossPips === 0) {
    return invalidResult("Stop loss must differ from entry price");
  }

  const riskAmount = calculateRiskAmount(account);
  const rawLot = riskAmount / (stopLossPips * instrument.pipValuePerLot);
  const recommendedLot = clampLot(rawLot, instrument);

  if (recommendedLot < instrument.minLot) {
    warnings.push(
      `Minimum lot for ${instrument.name} is ${instrument.minLot}. Consider reducing risk or widening stop loss.`
    );
  }

  const amountAtRisk = stopLossPips * recommendedLot * instrument.pipValuePerLot;
  const potentialProfit =
    takeProfitPips * recommendedLot * instrument.pipValuePerLot;
  const riskRewardRatio =
    stopLossPips > 0 ? takeProfitPips / stopLossPips : 0;

  const positionValue = recommendedLot * instrument.contractSize * entryPrice;
  const hasTakeProfit = takeProfit > 0;

  return {
    riskAmount,
    stopLossDistance: roundTo(stopLossPips, 1),
    stopLossDistanceLabel: "Pips",
    recommendedLot,
    amountAtRisk: roundTo(amountAtRisk, 2),
    potentialProfit: hasTakeProfit ? roundTo(potentialProfit, 2) : 0,
    riskRewardRatio: hasTakeProfit ? roundTo(riskRewardRatio, 2) : 0,
    positionValue: roundTo(positionValue, 2),
    isValid: recommendedLot >= instrument.minLot,
    warnings,
  };
}

function calculateSynthetic(
  account: AccountSettings,
  trade: TradeSettings,
  instrument: Instrument
): CalculationResult {
  const warnings: string[] = [];
  const { entryPrice, stopLoss, takeProfit } = trade;

  const priceDistance = roundTo(
    Math.abs(entryPrice - stopLoss),
    instrument.digits + 1
  );
  const profitDistance = roundTo(
    Math.abs(takeProfit - entryPrice),
    instrument.digits + 1
  );

  if (priceDistance === 0) {
    return invalidResult("Stop loss must differ from entry price");
  }

  const riskAmount = calculateRiskAmount(account);
  const valuePerPoint = instrument.pointValue * instrument.contractSize;
  const rawLot = riskAmount / (priceDistance * valuePerPoint);
  const recommendedLot = clampLot(rawLot, instrument);

  if (recommendedLot < instrument.minLot) {
    warnings.push(
      `Minimum lot for ${instrument.name} is ${instrument.minLot}. Consider reducing risk or widening stop loss.`
    );
  }

  const amountAtRisk = priceDistance * recommendedLot * valuePerPoint;
  const potentialProfit = profitDistance * recommendedLot * valuePerPoint;
  const riskRewardRatio =
    priceDistance > 0 ? profitDistance / priceDistance : 0;

  const positionValue = recommendedLot * instrument.contractSize * entryPrice;
  const hasTakeProfit = takeProfit > 0;
  const ticks = roundTo(priceDistance / instrument.tickSize, 2);

  return {
    riskAmount,
    stopLossDistance: roundTo(ticks, 0),
    stopLossDistanceLabel: "Points",
    recommendedLot,
    amountAtRisk: roundTo(amountAtRisk, 2),
    potentialProfit: hasTakeProfit ? roundTo(potentialProfit, 2) : 0,
    riskRewardRatio: hasTakeProfit ? roundTo(riskRewardRatio, 2) : 0,
    positionValue: roundTo(positionValue, 2),
    isValid: recommendedLot >= instrument.minLot,
    warnings,
  };
}

function idleResult(hint: string): CalculationResult {
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
    hint,
    warnings: [],
  };
}

function invalidResult(message: string): CalculationResult {
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
    warnings: [message],
  };
}

export function calculate(
  account: AccountSettings,
  trade: TradeSettings,
  instrument: Instrument
): CalculationResult {
  if (account.balance <= 0) {
    return idleResult("Enter your account balance to get started.");
  }

  if (account.riskValue <= 0) {
    return idleResult("Enter your risk amount to calculate lot size.");
  }

  if (trade.entryPrice <= 0 || trade.stopLoss <= 0) {
    return idleResult("Enter your entry and stop loss prices.");
  }

  if (instrument.category === "forex") {
    return calculateForex(account, trade, instrument);
  }

  return calculateSynthetic(account, trade, instrument);
}

export function formatCurrency(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

export function formatLot(lot: number, step: number): string {
  const decimals = step.toString().split(".")[1]?.length ?? 2;
  return lot.toFixed(decimals);
}
