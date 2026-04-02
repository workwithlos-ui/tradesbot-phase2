import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

interface MarginCalculatorProps {
  estimateTotal: number;
  shingleSquares: number;
  targetMarginPct: number;
  requiredCustomerPrice: number;
  pricePerSquare: number;
  costPerSquare: number;
  insuranceScopePrice: number;
  insuranceScopeMargin: number;
  insuranceScopePerSquare: number;
  onTargetMarginChange: (value: number) => void;
  onInsuranceScopePriceChange: (value: number) => void;
}

const MARGIN_PRESETS = [30, 35, 40, 45, 50];

export default function MarginCalculator(props: MarginCalculatorProps) {
  const hasData = props.estimateTotal > 0 && props.shingleSquares > 0;
  const scopeIsGood = props.insuranceScopePrice > 0 && props.insuranceScopeMargin >= props.targetMarginPct;
  const scopeIsBad = props.insuranceScopePrice > 0 && props.insuranceScopeMargin < props.targetMarginPct;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Margin Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Target Margin Input */}
        <div>
          <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Target Gross Margin %
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="number"
              min="0"
              max="99"
              step="1"
              value={props.targetMarginPct}
              onChange={(e) => props.onTargetMarginChange(parseFloat(e.target.value) || 0)}
              className="w-20 px-3 py-2 text-lg font-bold text-center border-2 border-primary rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring font-num"
            />
            <span className="text-lg font-bold text-primary">%</span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {MARGIN_PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => props.onTargetMarginChange(preset)}
                className={`px-2 py-1 text-xs rounded-md border transition-all ${
                  props.targetMarginPct === preset
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-primary/50 text-muted-foreground"
                }`}
              >
                {preset}%
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {hasData ? (
          <div className="space-y-2">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Required Customer Price
              </div>
              <div className="text-2xl font-bold font-num text-primary">
                {formatCurrency(props.requiredCustomerPrice)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                To achieve {props.targetMarginPct}% gross margin
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-secondary/50 rounded-lg p-2.5 text-center">
                <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Your Cost/sq</div>
                <div className="text-base font-bold font-num">{formatCurrency(props.costPerSquare)}</div>
              </div>
              <div className="bg-primary/5 rounded-lg p-2.5 text-center">
                <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Charge/sq</div>
                <div className="text-base font-bold font-num text-primary">{formatCurrency(props.pricePerSquare)}</div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground bg-secondary/30 rounded-lg p-2">
              <span className="font-medium">Formula:</span> Price = Cost ÷ (1 − margin%) = {formatCurrency(props.estimateTotal)} ÷ {(1 - props.targetMarginPct / 100).toFixed(2)} = {formatCurrency(props.requiredCustomerPrice)}
            </div>
          </div>
        ) : (
          <div className="text-center py-4 border border-dashed border-border rounded-lg">
            <p className="text-xs text-muted-foreground">Enter materials and labor to see margin calculations</p>
          </div>
        )}

        {/* Insurance Scope Check */}
        <div className="pt-3 border-t border-border">
          <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Insurance Scope Check
          </label>
          <p className="text-xs text-muted-foreground mb-2">
            Enter the insurance scope price to see what margin you'd actually get.
          </p>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-muted-foreground">$</span>
            <input
              type="number"
              min="0"
              step="100"
              placeholder="0.00"
              value={props.insuranceScopePrice || ""}
              onChange={(e) => props.onInsuranceScopePriceChange(parseFloat(e.target.value) || 0)}
              className="flex-1 px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring font-num"
            />
          </div>

          {props.insuranceScopePrice > 0 && hasData && (
            <div className={`rounded-lg p-3 border ${scopeIsGood ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              <div className="flex items-center gap-2 mb-2">
                {scopeIsGood ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm font-semibold ${scopeIsGood ? "text-green-700" : "text-red-700"}`}>
                  {scopeIsGood ? "Scope looks good!" : "Scope is below target margin"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Scope price:</span>
                  <span className="font-bold ml-1">{formatCurrency(props.insuranceScopePrice)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Scope $/sq:</span>
                  <span className="font-bold ml-1">{formatCurrency(props.insuranceScopePerSquare)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Actual margin:</span>
                  <span className={`font-bold ml-1 ${scopeIsGood ? "text-green-700" : "text-red-700"}`}>
                    {props.insuranceScopeMargin.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Target margin:</span>
                  <span className="font-bold ml-1">{props.targetMarginPct}%</span>
                </div>
              </div>
              {scopeIsBad && (
                <p className="text-xs text-red-700 font-medium mt-2">
                  ⚠ This scope is {(props.targetMarginPct - props.insuranceScopeMargin).toFixed(1)}% below your target. You'd need {formatCurrency(props.requiredCustomerPrice)} to hit {props.targetMarginPct}%.
                </p>
              )}
            </div>
          )}

          {/* Multi-margin comparison table */}
          {hasData && (
            <div className="mt-3">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Margin Comparison Table
              </div>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-secondary/50">
                      <th className="text-left px-2 py-1.5 font-semibold text-muted-foreground">Margin</th>
                      <th className="text-right px-2 py-1.5 font-semibold text-muted-foreground">Price</th>
                      <th className="text-right px-2 py-1.5 font-semibold text-muted-foreground">$/sq</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[30, 35, 40, 45, 50].map((m) => {
                      const price = props.estimateTotal / (1 - m / 100);
                      const pps = props.shingleSquares > 0 ? price / props.shingleSquares : 0;
                      const isTarget = m === props.targetMarginPct;
                      return (
                        <tr key={m} className={isTarget ? "bg-primary/5 font-semibold" : ""}>
                          <td className={`px-2 py-1.5 ${isTarget ? "text-primary font-bold" : ""}`}>{m}%</td>
                          <td className={`px-2 py-1.5 text-right font-num ${isTarget ? "text-primary font-bold" : ""}`}>{formatCurrency(price)}</td>
                          <td className={`px-2 py-1.5 text-right font-num ${isTarget ? "text-primary font-bold" : ""}`}>{formatCurrency(pps)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
