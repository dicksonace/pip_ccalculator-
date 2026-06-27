import type { Instrument, MarketCategory } from "./types";

export const MARKET_CATEGORIES: {
  id: MarketCategory;
  label: string;
  description: string;
}[] = [
  {
    id: "forex",
    label: "Forex",
    description: "Major, minor & exotic currency pairs",
  },
  {
    id: "volatility",
    label: "Volatility Indices",
    description: "Constant volatility synthetic indices",
  },
  {
    id: "boom_crash",
    label: "Boom & Crash",
    description: "Sudden spike & drop indices",
  },
  {
    id: "jump",
    label: "Jump Indices",
    description: "Periodic price jump indices",
  },
  {
    id: "step",
    label: "Step Index",
    description: "Fixed increment step index",
  },
];

export const CURRENCIES = ["USD", "EUR", "GBP", "AUD", "JPY", "BTC", "ETH"];

const forex = (
  id: string,
  name: string,
  symbol: string,
  pipSize: number,
  pipValuePerLot: number,
  digits = 5
): Instrument => ({
  id,
  name,
  symbol,
  category: "forex",
  contractSize: 100_000,
  tickSize: pipSize,
  minLot: 0.01,
  maxLot: 50,
  lotStep: 0.01,
  pointValue: pipValuePerLot,
  pipSize,
  pipValuePerLot,
  digits,
});

const synthetic = (
  id: string,
  name: string,
  symbol: string,
  category: MarketCategory,
  opts: Partial<Instrument> & { contractSize?: number }
): Instrument => ({
  id,
  name,
  symbol,
  category,
  contractSize: opts.contractSize ?? 1,
  tickSize: opts.tickSize ?? 0.01,
  minLot: opts.minLot ?? 0.001,
  maxLot: opts.maxLot ?? 100,
  lotStep: opts.lotStep ?? 0.001,
  pointValue: opts.pointValue ?? opts.contractSize ?? 1,
  digits: opts.digits ?? 2,
});

export const INSTRUMENTS: Instrument[] = [
  // Forex – major pairs (pip value per standard lot in USD)
  forex("eurusd", "EUR/USD", "frxEURUSD", 0.0001, 10),
  forex("gbpusd", "GBP/USD", "frxGBPUSD", 0.0001, 10),
  forex("usdjpy", "USD/JPY", "frxUSDJPY", 0.01, 6.67, 3),
  forex("usdchf", "USD/CHF", "frxUSDCHF", 0.0001, 10),
  forex("audusd", "AUD/USD", "frxAUDUSD", 0.0001, 10),
  forex("nzdusd", "NZD/USD", "frxNZDUSD", 0.0001, 10),
  forex("usdcad", "USD/CAD", "frxUSDCAD", 0.0001, 7.5),
  forex("eurjpy", "EUR/JPY", "frxEURJPY", 0.01, 6.67, 3),
  forex("gbpjpy", "GBP/JPY", "frxGBPJPY", 0.01, 6.67, 3),
  forex("eurgbp", "EUR/GBP", "frxEURGBP", 0.0001, 12.5),
  forex("audjpy", "AUD/JPY", "frxAUDJPY", 0.01, 6.67, 3),

  // Volatility Indices (standard)
  synthetic("vol10", "Volatility 10 Index", "R_10", "volatility", {
    minLot: 0.001,
    lotStep: 0.001,
  }),
  synthetic("vol25", "Volatility 25 Index", "R_25", "volatility", {
    minLot: 0.001,
    lotStep: 0.001,
  }),
  synthetic("vol50", "Volatility 50 Index", "R_50", "volatility", {
    minLot: 0.001,
    lotStep: 0.001,
  }),
  synthetic("vol75", "Volatility 75 Index", "R_75", "volatility", {
    minLot: 0.001,
    lotStep: 0.001,
  }),
  synthetic("vol100", "Volatility 100 Index", "R_100", "volatility", {
    minLot: 0.001,
    lotStep: 0.001,
  }),
  synthetic("vol150", "Volatility 150 Index", "R_150", "volatility", {
    minLot: 0.001,
    lotStep: 0.001,
  }),
  synthetic("vol200", "Volatility 200 Index", "R_200", "volatility", {
    minLot: 0.001,
    lotStep: 0.001,
  }),
  synthetic("vol250", "Volatility 250 Index", "R_250", "volatility", {
    minLot: 0.001,
    lotStep: 0.001,
  }),

  // Volatility Indices (1s)
  synthetic("vol10_1s", "Volatility 10 (1s) Index", "1HZ10V", "volatility", {
    minLot: 0.001,
    lotStep: 0.001,
  }),
  synthetic("vol25_1s", "Volatility 25 (1s) Index", "1HZ25V", "volatility", {
    minLot: 0.001,
    lotStep: 0.001,
  }),
  synthetic("vol50_1s", "Volatility 50 (1s) Index", "1HZ50V", "volatility", {
    minLot: 0.001,
    lotStep: 0.001,
  }),
  synthetic("vol75_1s", "Volatility 75 (1s) Index", "1HZ75V", "volatility", {
    minLot: 0.001,
    lotStep: 0.001,
  }),
  synthetic("vol100_1s", "Volatility 100 (1s) Index", "1HZ100V", "volatility", {
    minLot: 0.001,
    lotStep: 0.001,
  }),
  synthetic("vol150_1s", "Volatility 150 (1s) Index", "1HZ150V", "volatility", {
    minLot: 0.001,
    lotStep: 0.001,
  }),
  synthetic("vol200_1s", "Volatility 200 (1s) Index", "1HZ200V", "volatility", {
    minLot: 0.001,
    lotStep: 0.001,
  }),
  synthetic("vol250_1s", "Volatility 250 (1s) Index", "1HZ250V", "volatility", {
    minLot: 0.001,
    lotStep: 0.001,
  }),
  synthetic("vol300_1s", "Volatility 300 (1s) Index", "1HZ300V", "volatility", {
    minLot: 0.001,
    lotStep: 0.001,
  }),

  // Boom Indices
  synthetic("boom300", "Boom 300 Index", "BOOM300N", "boom_crash", {
    minLot: 0.2,
    maxLot: 50,
    lotStep: 0.01,
  }),
  synthetic("boom500", "Boom 500 Index", "BOOM500N", "boom_crash", {
    minLot: 0.2,
    maxLot: 50,
    lotStep: 0.01,
  }),
  synthetic("boom1000", "Boom 1000 Index", "BOOM1000N", "boom_crash", {
    minLot: 0.2,
    maxLot: 50,
    lotStep: 0.01,
  }),

  // Crash Indices
  synthetic("crash300", "Crash 300 Index", "CRASH300N", "boom_crash", {
    minLot: 0.2,
    maxLot: 50,
    lotStep: 0.01,
  }),
  synthetic("crash500", "Crash 500 Index", "CRASH500N", "boom_crash", {
    minLot: 0.2,
    maxLot: 50,
    lotStep: 0.01,
  }),
  synthetic("crash1000", "Crash 1000 Index", "CRASH1000N", "boom_crash", {
    minLot: 0.2,
    maxLot: 50,
    lotStep: 0.01,
  }),

  // Jump Indices
  synthetic("jump10", "Jump 10 Index", "JD10", "jump", {
    minLot: 0.01,
    lotStep: 0.01,
  }),
  synthetic("jump25", "Jump 25 Index", "JD25", "jump", {
    minLot: 0.01,
    lotStep: 0.01,
  }),
  synthetic("jump50", "Jump 50 Index", "JD50", "jump", {
    minLot: 0.01,
    lotStep: 0.01,
  }),
  synthetic("jump75", "Jump 75 Index", "JD75", "jump", {
    minLot: 0.01,
    lotStep: 0.01,
  }),
  synthetic("jump100", "Jump 100 Index", "JD100", "jump", {
    minLot: 0.01,
    lotStep: 0.01,
  }),

  // Step Index
  synthetic("step", "Step Index", "stpRNG", "step", {
    tickSize: 0.1,
    minLot: 0.1,
    maxLot: 50,
    lotStep: 0.01,
    digits: 1,
  }),
];

export function getInstrumentsByCategory(
  category: MarketCategory
): Instrument[] {
  return INSTRUMENTS.filter((i) => i.category === category);
}

export function getInstrumentById(id: string): Instrument | undefined {
  return INSTRUMENTS.find((i) => i.id === id);
}

export function getDefaultInstrument(category: MarketCategory): Instrument {
  return getInstrumentsByCategory(category)[0];
}
