import { TRADE_OPTIONS } from "@/lib/data";
import { Construction } from "lucide-react";

interface ComingSoonProps {
  tradeId: string;
}

export default function ComingSoon({ tradeId }: ComingSoonProps) {
  const trade = TRADE_OPTIONS.find((t) => t.id === tradeId);

  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <div className="section-card max-w-md w-full" style={{ borderStyle: "dashed" }}>
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <Construction className="w-12 h-12 mb-4" style={{ color: "var(--muted-foreground)", opacity: 0.4 }} />
          <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--foreground)" }}>
            {trade?.name || "Coming Soon"}
          </h3>
          <p className="text-sm mb-2 max-w-sm" style={{ color: "var(--muted-foreground)" }}>
            {trade?.description || "This trade estimator is under development."}
          </p>
          <p className="text-[11px]" style={{ color: "var(--muted-foreground)", opacity: 0.6 }}>
            This estimator is currently being built. Check back soon.
          </p>
        </div>
      </div>
    </div>
  );
}
