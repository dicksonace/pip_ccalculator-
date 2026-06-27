import Image from "next/image";

export function Header() {
  return (
    <header className="border-b border-white/10 bg-[#0e0e0e]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <Image
            src="/sizeright-logo.png"
            alt="SizeRight logo"
            width={40}
            height={40}
            className="h-10 w-10 rounded-lg"
            priority
          />
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
              SizeRight
            </h1>
            <p className="text-xs text-zinc-400 sm:text-sm">
              Lot size &amp; risk calculator for Deriv
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
