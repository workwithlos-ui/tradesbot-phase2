import { Hammer } from "lucide-react";
import { Link } from "wouter";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-sm border-b border-border/60">
      <div className="container flex items-center justify-between h-14">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <Hammer className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-[15px] tracking-tight">TradesBot</span>
            <span className="hidden sm:inline text-xs text-muted-foreground">Roofing Estimator</span>
          </div>
        </div>
        <Link
          href="/estimates"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          Saved
        </Link>
      </div>
    </header>
  );
}
