import { TRADE_OPTIONS } from "@/lib/data";
import { Home, Building2, PanelTop, Droplets, Grid2X2, Lock } from "lucide-react";

const TRADE_ICONS: Record<string, React.ReactNode> = {
  "shingle-roofing": <Home className="w-3.5 h-3.5" />,
  "commercial-flat": <Building2 className="w-3.5 h-3.5" />,
  "siding": <PanelTop className="w-3.5 h-3.5" />,
  "gutters": <Droplets className="w-3.5 h-3.5" />,
  "windows": <Grid2X2 className="w-3.5 h-3.5" />,
};

interface TradeSelectorProps {
  selectedTrade: string;
  onTradeChange: (tradeId: string) => void;
}

export default function TradeSelector({ selectedTrade, onTradeChange }: TradeSelectorProps) {
  return (
    <div className="border-b border-border/60 bg-background">
      <div className="container">
        <div className="flex gap-1 overflow-x-auto py-2" style={{ scrollbarWidth: "none" }}>
          {TRADE_OPTIONS.map((trade) => {
            const isSelected = selectedTrade === trade.id;
            const isAvailable = trade.available;
            return (
              <button
                key={trade.id}
                onClick={() => isAvailable && onTradeChange(trade.id)}
                disabled={!isAvailable}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : isAvailable
                    ? "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    : "text-muted-foreground/35 cursor-not-allowed"
                }`}
              >
                {isAvailable ? TRADE_ICONS[trade.id] : <Lock className="w-3 h-3" />}
                <span>{trade.name}</span>
                {!isAvailable && (
                  <span className="text-[10px] opacity-60 font-normal">Soon</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
