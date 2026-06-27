export type MarketCategory =
  | "forex"
  | "volatility"
  | "boom_crash"
  | "jump"
  | "step";

export type RiskType = "percentage" | "fixed";

export type TradeDirection = "buy" | "sell";

export interface Instrument {
  id: string;
  name: string;
  symbol: string;
  category: MarketCategory;
  contractSize: number;
  tickSize: number;
  minLot: number;
  maxLot: number;
  lotStep: number;
  /** Value per 1 price unit move per 1.0 lot in USD (synthetic) or quote currency */
  pointValue: number;
  /** Pip size for forex pairs (e.g. 0.0001) */
  pipSize?: number;
  /** Pip value per standard lot in account currency (forex) */
  pipValuePerLot?: number;
  digits: number;
}

export interface AccountSettings {
  balance: number;
  currency: string;
  riskType: RiskType;
  riskValue: number;
}

export interface TradeSettings {
  instrumentId: string;
  direction: TradeDirection;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
}

export interface CalculationResult {
  riskAmount: number;
  stopLossDistance: number;
  stopLossDistanceLabel: string;
  recommendedLot: number;
  amountAtRisk: number;
  potentialProfit: number;
  riskRewardRatio: number;
  positionValue: number;
  isValid: boolean;
  hint?: string;
  warnings: string[];
}

export interface CalculatorState {
  account: AccountSettings;
  trade: TradeSettings;
  category: MarketCategory;
}
