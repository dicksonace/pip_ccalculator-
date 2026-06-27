export function Header() {
  return (
    <header className="border-b border-white/10 bg-[#0e0e0e]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff444f] text-lg font-bold text-white">
            D
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
              Deriv Risk Calculator
            </h1>
            <p className="text-xs text-zinc-400 sm:text-sm">
              Lot size &amp; position risk for Deriv pairs
            </p>
          </div>
        </div>
        <span className="hidden rounded-full border border-[#ff444f]/30 bg-[#ff444f]/10 px-3 py-1 text-xs font-medium text-[#ff6b73] sm:inline">
          MT5 / CFD
        </span>
      </div>
    </header>
  );
}
