import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MATERIAL_ITEMS } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Package, ChevronDown, ChevronUp } from "lucide-react";

interface MaterialsSectionProps {
  materialQtys: Record<string, number>;
  onMaterialQtyChange: (id: string, qty: number) => void;
  totalSquares: number;
  totalMaterialCost: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  bundles: "Shingle Bundles (count toward squares)",
  underlayment: "Underlayment and Shields",
  flashing: "Flashing, Edge, and Metal",
  ventilation: "Ventilation",
  fasteners: "Fasteners",
  decking: "Decking",
  other: "Other Materials",
};

const CATEGORY_ORDER = ["bundles", "underlayment", "flashing", "ventilation", "fasteners", "decking", "other"];

export default function MaterialsSection({ materialQtys, onMaterialQtyChange, totalSquares, totalMaterialCost }: MaterialsSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const activeCount = Object.values(materialQtys).filter((v) => v > 0).length;
  const totalItems = MATERIAL_ITEMS.length;

  // Group materials by category
  const grouped: Record<string, typeof MATERIAL_ITEMS> = {};
  for (const item of MATERIAL_ITEMS) {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  }

  return (
    <Card>
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            Materials
            <span className="text-xs font-normal text-muted-foreground">
              ({activeCount} of {totalItems} items)
            </span>
          </CardTitle>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold font-num text-primary">
              {formatCurrency(totalMaterialCost)}
            </span>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {totalSquares.toFixed(1)}sq
            </span>
            {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent>
          {CATEGORY_ORDER.map((cat) => {
            const items = grouped[cat];
            if (!items || items.length === 0) return null;
            return (
              <div key={cat} className="mb-4 last:mb-0">
                <h4 className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-2">
                  {CATEGORY_LABELS[cat] || cat}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                  {items.map((item) => {
                    const qty = materialQtys[item.id] || 0;
                    const lineTotal = qty * item.unitPrice;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 py-1 border-b border-border/30 last:border-b-0"
                      >
                        <span className="text-[10px] font-num text-muted-foreground w-5 text-right shrink-0">
                          {item.lineNumber}
                        </span>
                        <span className="text-sm flex-1 min-w-0 truncate" title={item.name}>
                          {item.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground shrink-0 w-12 text-right">
                          {item.unit}
                        </span>
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={qty || ""}
                          onChange={(e) => onMaterialQtyChange(item.id, parseInt(e.target.value) || 0)}
                          className="w-14 px-1.5 py-1 text-sm text-right border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring font-num"
                        />
                        <span className="text-xs font-num text-muted-foreground w-16 text-right shrink-0">
                          {qty > 0 ? formatCurrency(lineTotal) : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Material Total */}
          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-sm font-semibold">Material Total</span>
            <span className="text-lg font-bold font-num text-primary">
              {formatCurrency(totalMaterialCost)}
            </span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
