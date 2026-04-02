import { formatCurrency } from "@/lib/utils";

interface MobileSummaryBarProps {
  laborSquares: number;
  materialItemCount: number;
  laborItemCount: number;
  estimateTotal: number;
}

export default function MobileSummaryBar(props: MobileSummaryBarProps) {
  if (props.laborSquares <= 0 && props.estimateTotal <= 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg lg:hidden z-50">
      <div className="container flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-muted-foreground">
            {props.laborSquares.toFixed(1)} sq
          </span>
          <span className="text-xs text-muted-foreground">
            {props.materialItemCount} mat
          </span>
          <span className="text-xs text-muted-foreground">
            {props.laborItemCount} labor
          </span>
        </div>
        <span className="text-lg font-bold font-num text-primary">
          {formatCurrency(props.estimateTotal)}
        </span>
      </div>
    </div>
  );
}
