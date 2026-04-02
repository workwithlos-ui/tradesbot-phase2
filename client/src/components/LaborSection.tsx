import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LABOR_ITEMS, STEEP_PITCH_TIERS, BASE_LABOR_RATE } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Wrench, ChevronDown, ChevronUp } from "lucide-react";

interface LaborSectionProps {
  laborSquares: number;
  laborQtys: Record<string, number>;
  laborCosts: Record<string, number>;
  steepPitchSquares: Record<string, number>;
  baseLaborCost: number;
  steepPitchAdder: number;
  additionalLaborCost: number;
  totalLaborCost: number;
  onLaborQtyChange: (id: string, qty: number) => void;
  onLaborCostChange: (id: string, cost: number) => void;
}

export default function LaborSection(props: LaborSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const nonBaseItems = LABOR_ITEMS.filter((item) => !item.isBaseLabor);
  const activeCount = nonBaseItems.filter((item) => (props.laborQtys[item.id] || 0) > 0).length;

  return (
    <Card>
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-primary" />
            Labor
            <span className="text-xs font-normal text-muted-foreground">
              ({activeCount + (props.laborSquares > 0 ? 1 : 0)} active items)
            </span>
          </CardTitle>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold font-num text-primary">
              {formatCurrency(props.totalLaborCost)}
            </span>
            {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent>
          {/* Base Labor (consolidated) */}
          <div className="mb-4">
            <h4 className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-2">
              Base Labor Rate
            </h4>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className="text-sm font-medium">Base Labor</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({props.laborSquares.toFixed(1)} sq x ${props.laborCosts["base-labor"] || BASE_LABOR_RATE}/sq)
                  </span>
                </div>
                <span className="text-sm font-bold font-num">
                  {formatCurrency(props.baseLaborCost)}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Includes: tear off, install shingles, underlayment, ice/water shield, drip edges, valley metal, pipe jacks, haul off and clean up
              </p>
              <div className="mt-2 flex items-center gap-2">
                <label className="text-[10px] text-muted-foreground">$/sq:</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={props.laborCosts["base-labor"] || BASE_LABOR_RATE}
                  onChange={(e) => props.onLaborCostChange("base-labor", parseFloat(e.target.value) || 0)}
                  className="w-20 px-2 py-1 text-xs border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring font-num"
                />
              </div>
            </div>
          </div>

          {/* Steep Pitch Adder */}
          {props.steepPitchAdder > 0 && (
            <div className="mb-4">
              <h4 className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-2">
                Steep Pitch Adder
              </h4>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Steep Pitch Surcharge</span>
                  <span className="text-sm font-bold font-num">
                    {formatCurrency(props.steepPitchAdder)}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground space-y-0.5">
                  {STEEP_PITCH_TIERS.map((tier) => {
                    const sq = props.steepPitchSquares[tier.id] || 0;
                    if (sq <= 0) return null;
                    return (
                      <div key={tier.id}>
                        {tier.label}: {sq} sq x ${tier.adderPerSquare}/sq = {formatCurrency(sq * tier.adderPerSquare)}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Additional Labor Items */}
          <div className="mb-2">
            <h4 className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-2">
              Additional Labor Items
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              Enter quantity and cost per unit for each applicable item.
            </p>

            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[1fr_70px_70px_70px_80px] gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 px-1">
              <span>Item</span>
              <span className="text-right">Unit</span>
              <span className="text-right">Qty</span>
              <span className="text-right">$/Unit</span>
              <span className="text-right">Total</span>
            </div>

            <div className="space-y-1">
              {nonBaseItems.map((item) => {
                const qty = props.laborQtys[item.id] || 0;
                const cost = props.laborCosts[item.id] || item.defaultCostPerUnit;
                const lineTotal = qty * cost;
                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-[1fr_70px_70px_70px_80px] gap-2 items-center py-1.5 border-b border-border/30 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <span className="text-sm truncate block" title={item.description}>
                        {item.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground text-right">
                      {item.unit}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={qty || ""}
                      onChange={(e) => props.onLaborQtyChange(item.id, parseFloat(e.target.value) || 0)}
                      className="w-full px-1.5 py-1 text-sm text-right border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring font-num"
                    />
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={cost || ""}
                      onChange={(e) => props.onLaborCostChange(item.id, parseFloat(e.target.value) || 0)}
                      className="w-full px-1.5 py-1 text-sm text-right border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring font-num"
                    />
                    <span className="text-xs font-num text-right">
                      {qty > 0 ? formatCurrency(lineTotal) : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Labor Total */}
          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-sm font-semibold">Labor Total</span>
            <span className="text-lg font-bold font-num text-primary">
              {formatCurrency(props.totalLaborCost)}
            </span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
