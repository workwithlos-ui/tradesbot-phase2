import { Card, CardContent } from "@/components/ui/card";
import { TRADE_OPTIONS } from "@/lib/data";
import { Construction } from "lucide-react";

interface ComingSoonProps {
  tradeId: string;
}

export default function ComingSoon({ tradeId }: ComingSoonProps) {
  const trade = TRADE_OPTIONS.find((t) => t.id === tradeId);

  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <Card className="max-w-md w-full border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Construction className="w-12 h-12 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {trade?.name || "Coming Soon"}
          </h3>
          <p className="text-sm text-muted-foreground mb-2 max-w-sm">
            {trade?.description || "This trade estimator is under development."}
          </p>
          <p className="text-xs text-muted-foreground/60">
            This estimator is currently being built. Check back soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
