import { TRADE_OPTIONS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Home, Building2, PanelTop, Droplets, Grid2X2, Lock } from "lucide-react";

const TRADE_ICONS: Record<string, React.ReactNode> = {
  "shingle-roofing": <Home className="w-4 h-4" />,
  "commercial-flat": <Building2 className="w-4 h-4" />,
  "siding": <PanelTop className="w-4 h-4" />,
  "gutters": <Droplets className="w-4 h-4" />,
  "windows": <Grid2X2 className="w-4 h-4" />,
};

interface TradeSelectorProps {
  selectedTrade: string;
  onTradeChange: (tradeId: string) => void;
}

export default function TradeSelector({ selectedTrade, onTradeChange }: TradeSelectorProps) {
  return (
    <div className="bg-card border-b border-border/60">
      <div className="container py-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {TRADE_OPTIONS.map((trade) => {
            const isSelected = selectedTrade === trade.id;
            const isAvailable = trade.available;
            return (
              <button
                key={trade.id}
                onClick={() => isAvailable && onTradeChange(trade.id)}
                disabled={!isAvailable}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : isAvailable
                    ? "bg-secondary text-secondary-foreground hover:bg-accent"
                    : "bg-muted text-muted-foreground/50 cursor-not-allowed"
                )}
              >
                {isAvailable ? TRADE_ICONS[trade.id] : <Lock className="w-3.5 h-3.5" />}
                {trade.name}
                {!isAvailable && (
                  <span className="text-[10px] font-normal opacity-60 ml-0.5">Coming Soon</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
