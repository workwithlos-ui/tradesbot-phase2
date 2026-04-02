import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { ChevronUp, X } from "lucide-react";

interface MobileSummaryBarProps {
  laborSquares: number;
  materialItemCount: number;
  laborItemCount: number;
  estimateTotal: number;
  // Full summary data for the sheet
  jobName?: string;
  address?: string;
  shingleSquares: number;
  materialsTotal: number;
  laborTotal: number;
  customCostsTotal: number;
  targetMarginPct: number;
  requiredCustomerPrice: number;
  onTargetMarginChange: (value: number) => void;
  onGeneratePdf: () => void;
  onSave: () => void;
}

const MARGIN_PRESETS = [30, 35, 40, 45, 50];

export default function MobileSummaryBar(props: MobileSummaryBarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const hasData = props.estimateTotal > 0;

  if (!hasData && props.laborSquares === 0) return null;

  return (
    <>
      {/* Sticky bottom bar — mobile only */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
        <div className="bg-card border-t border-border/60 shadow-lg">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="w-full flex items-center justify-between px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Estimate Total
                </span>
                <span className="text-xl font-bold font-num text-primary">
                  {formatCurrency(props.estimateTotal)}
                </span>
              </div>
              {props.laborSquares > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-secondary text-muted-foreground">
                  {props.laborSquares.toFixed(1)} sq
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">Summary</span>
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            </div>
          </button>
        </div>
      </div>

      {/* Slide-up summary sheet */}
      {sheetOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm animate-fade-in lg:hidden"
            onClick={() => setSheetOpen(false)}
          />

          {/* Sheet panel */}
          <div className="fixed bottom-0 left-0 right-0 bg-card rounded-t-2xl z-50 shadow-2xl max-h-[85vh] overflow-y-auto animate-slide-up lg:hidden">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
              <div>
                <h3 className="text-base font-bold">
                  {props.jobName || "Estimate Summary"}
                </h3>
                {props.address && (
                  <p className="text-xs text-muted-foreground mt-0.5">{props.address}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              {/* Cost breakdown */}
              <div className="space-y-1">
                <div className="flex items-center justify-between py-2.5 border-b border-border/40">
                  <span className="text-sm text-muted-foreground">Materials</span>
                  <span className="text-sm font-num font-medium">{formatCurrency(props.materialsTotal)}</span>
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-border/40">
                  <span className="text-sm text-muted-foreground">Labor</span>
                  <span className="text-sm font-num font-medium">{formatCurrency(props.laborTotal)}</span>
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-border/40">
                  <span className="text-sm text-muted-foreground">Additional</span>
                  <span className="text-sm font-num font-medium">{formatCurrency(props.customCostsTotal)}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-base font-bold">Total Cost</span>
                  <span className="text-xl font-bold font-num">{formatCurrency(props.estimateTotal)}</span>
                </div>
              </div>

              {/* Margin calculator */}
              {hasData && (
                <div className="bg-primary/5 border border-primary/15 rounded-xl p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Margin Calculator
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <label className="text-xs text-muted-foreground shrink-0">Target:</label>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      step="1"
                      value={props.targetMarginPct}
                      onChange={(e) => props.onTargetMarginChange(parseFloat(e.target.value) || 0)}
                      className="w-16 px-2 py-1.5 text-sm font-bold text-center border-2 border-primary rounded-lg bg-background focus:outline-none font-num"
                    />
                    <span className="text-sm font-bold text-primary">%</span>
                  </div>
                  <div className="flex gap-1.5 flex-wrap mb-4">
                    {MARGIN_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => props.onTargetMarginChange(preset)}
                        className={`px-2.5 py-1.5 text-xs rounded-lg border transition-all ${
                          props.targetMarginPct === preset
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border hover:border-primary/40 text-muted-foreground"
                        }`}
                      >
                        {preset}%
                      </button>
                    ))}
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground mb-0.5">Charge customer</div>
                      <div className="text-2xl font-bold font-num text-primary">
                        {formatCurrency(props.requiredCustomerPrice)}
                      </div>
                    </div>
                    {props.shingleSquares > 0 && (
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-0.5">$/sq</div>
                        <div className="text-lg font-bold font-num">
                          {formatCurrency(props.requiredCustomerPrice / props.shingleSquares)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3 pb-6">
                <button
                  type="button"
                  onClick={() => { setSheetOpen(false); props.onGeneratePdf(); }}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold active:opacity-80"
                >
                  Generate PDF
                </button>
                <button
                  type="button"
                  onClick={() => { setSheetOpen(false); props.onSave(); }}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 border border-border rounded-xl text-sm font-semibold hover:bg-secondary active:opacity-80"
                >
                  Save Estimate
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
