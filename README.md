# SizeRight

Lot size and risk calculator for [Deriv](https://deriv.com) forex and synthetic indices. Get the right position size every time.

Built with Next.js, React, and TypeScript.

## Features

- Risk-based lot sizing (% of balance or fixed amount)
- Forex pairs (EUR/USD, GBP/USD, USD/JPY, and more)
- Synthetic indices (Volatility, Boom & Crash, Jump, Step)
- Stop loss distance, amount at risk, potential profit, and risk:reward
- One-click copy of recommended lot size

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
npm run build
npm start
```

## Disclaimer

Calculations are estimates based on Deriv MT5 contract specs. Always verify lot size in your trading platform before placing trades.
