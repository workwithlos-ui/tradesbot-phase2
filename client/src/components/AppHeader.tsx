import { Hammer } from "lucide-react";

export default function AppHeader() {
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container flex items-center justify-between py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
            <Hammer className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">TradesBot</h1>
            <p className="text-xs text-primary-foreground/70">Roofing Material and Labor Estimator</p>
          </div>
        </div>
        <div className="text-right text-xs text-primary-foreground/80">
          <span className="font-medium">ABC Supply</span>
          <span className="mx-1.5 opacity-50">|</span>
          <span>Trusted Roofing LLC</span>
        </div>
      </div>
    </header>
  );
}
