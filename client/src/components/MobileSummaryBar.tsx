import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { ChevronUp, X } from "lucide-react";

interface MobileSummaryBarProps {
  laborSquares: number;
  materialItemCount: number;
  laborItemCount: number;
  estimateTotal: number;
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
        <div style={{ background: "rgba(26,26,26,0.95)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderTop: "1px solid var(--border)" }}>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="w-full flex items-center justify-between px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-start">
                <span className="text-[9px] font-medium uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
                  Estimate Total
                </span>
                <span className="text-xl font-bold font-num" style={{ color: "var(--primary)" }}>
                  {formatCurrency(props.estimateTotal)}
                </span>
              </div>
              {props.laborSquares > 0 && (
                <span className="pill" style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}>
                  {props.laborSquares.toFixed(1)} sq
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium" style={{ color: "var(--muted-foreground)" }}>Summary</span>
              <ChevronUp className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
            </div>
          </button>
        </div>
      </div>

      {/* Slide-up summary sheet */}
      {sheetOpen && (
        <>
          <div
            className="sheet-overlay animate-fade-in lg:hidden"
            onClick={() => setSheetOpen(false)}
          />

          <div className="sheet-panel animate-slide-up lg:hidden">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: "var(--border)" }} />
            </div>

            <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
              <div>
                <h3 className="text-base font-bold" style={{ color: "var(--foreground)" }}>
                  {props.jobName || "Estimate Summary"}
                </h3>
                {props.address && (
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>{props.address}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="p-2 rounded-lg transition-colors"
                style={{ color: "var(--muted-foreground)" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              {/* Cost breakdown */}
              <div className="space-y-0">
                <div className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid var(--border)" }}>
                  <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>Materials</span>
                  <span className="text-sm font-num font-medium" style={{ color: "var(--foreground)" }}>{formatCurrency(props.materialsTotal)}</span>
                </div>
                <div className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid var(--border)" }}>
                  <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>Labor</span>
                  <span className="text-sm font-num font-medium" style={{ color: "var(--foreground)" }}>{formatCurrency(props.laborTotal)}</span>
                </div>
                <div className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid var(--border)" }}>
                  <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>Additional</span>
                  <span className="text-sm font-num font-medium" style={{ color: "var(--foreground)" }}>{formatCurrency(props.customCostsTotal)}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-base font-bold" style={{ color: "var(--foreground)" }}>Total Cost</span>
                  <span className="text-xl font-bold font-num" style={{ color: "var(--primary)" }}>{formatCurrency(props.estimateTotal)}</span>
                </div>
              </div>

              {/* Margin calculator */}
              {hasData && (
                <div className="surface-highlight rounded-lg p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>
                    Margin Calculator
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <label className="text-[11px] shrink-0" style={{ color: "var(--muted-foreground)" }}>Target:</label>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      step="1"
                      value={props.targetMarginPct}
                      onChange={(e) => props.onTargetMarginChange(parseFloat(e.target.value) || 0)}
                      className="font-num text-sm font-bold text-center"
                      style={{
                        width: "56px",
                        padding: "0.375rem",
                        background: "var(--background)",
                        border: "2px solid var(--primary)",
                        borderRadius: "0.5rem",
                        color: "var(--primary)",
                        outline: "none",
                      }}
                    />
                    <span className="text-sm font-bold" style={{ color: "var(--primary)" }}>%</span>
                  </div>
                  <div className="flex gap-1.5 flex-wrap mb-4">
                    {MARGIN_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => props.onTargetMarginChange(preset)}
                        className="px-2.5 py-1.5 text-[11px] rounded-lg transition-all"
                        style={{
                          background: props.targetMarginPct === preset ? "var(--primary)" : "transparent",
                          color: props.targetMarginPct === preset ? "var(--primary-foreground)" : "var(--muted-foreground)",
                          border: props.targetMarginPct === preset ? "1px solid var(--primary)" : "1px solid var(--border)",
                        }}
                      >
                        {preset}%
                      </button>
                    ))}
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-[10px] mb-0.5" style={{ color: "var(--muted-foreground)" }}>Charge customer</div>
                      <div className="text-2xl font-bold font-num" style={{ color: "var(--primary)" }}>
                        {formatCurrency(props.requiredCustomerPrice)}
                      </div>
                    </div>
                    {props.shingleSquares > 0 && (
                      <div className="text-right">
                        <div className="text-[10px] mb-0.5" style={{ color: "var(--muted-foreground)" }}>$/sq</div>
                        <div className="text-lg font-bold font-num" style={{ color: "var(--foreground)" }}>
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
                  className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg text-sm font-semibold active:scale-[0.98] transition-transform"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  Generate PDF
                </button>
                <button
                  type="button"
                  onClick={() => { setSheetOpen(false); props.onSave(); }}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg text-sm font-semibold active:scale-[0.98] transition-transform"
                  style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
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
