import { useState } from "react";
import type { EstimatorState } from "@/hooks/useEstimator";
import { ChevronUp, X, TrendingUp, FileText, Save, RotateCcw } from "lucide-react";

function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

interface Props {
  state: EstimatorState;
  totalSquares: number;
  totalMaterialCost: number;
  totalLaborCost: number;
  totalCustomCosts: number;
  estimateTotal: number;
  requiredCustomerPrice: number;
  costPerSquare: number;
  pricePerSquare: number;
  onTargetMarginChange: (value: number) => void;
  onReset: () => void;
  onSave: () => void;
  onGeneratePdf: () => void;
}

export default function MobileSummaryBar(props: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      {/* Sticky bottom bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
        style={{
          background: "rgba(13,13,13,0.95)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="w-full flex items-center justify-between px-5 py-3.5"
        >
          <div className="text-left">
            <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
              {props.totalSquares > 0 ? `${props.totalSquares} SQ` : "Estimate"}
            </div>
            <div className="text-lg font-bold font-num" style={{ color: "var(--primary)" }}>
              {fmt(props.estimateTotal)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>View Summary</span>
            <ChevronUp className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
          </div>
        </button>
      </div>

      {/* Slide-up sheet */}
      {sheetOpen && (
        <>
          <div
            className="fixed inset-0 z-50 animate-fade-in"
            style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={() => setSheetOpen(false)}
          />
          <div
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl max-h-[85vh] overflow-y-auto animate-slide-up"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderBottom: "none",
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: "var(--border)" }} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
              <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Estimate Summary</h3>
              <button onClick={() => setSheetOpen(false)} className="p-2" style={{ color: "var(--muted-foreground)" }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              {/* Cost breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--muted-foreground)" }}>Materials</span>
                  <span className="font-num font-medium" style={{ color: "var(--foreground)" }}>{fmt(props.totalMaterialCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--muted-foreground)" }}>Labor</span>
                  <span className="font-num font-medium" style={{ color: "var(--foreground)" }}>{fmt(props.totalLaborCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--muted-foreground)" }}>Additional</span>
                  <span className="font-num font-medium" style={{ color: "var(--foreground)" }}>{fmt(props.totalCustomCosts)}</span>
                </div>
                <div className="pt-2 flex justify-between" style={{ borderTop: "1px solid var(--border)" }}>
                  <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Total Cost</span>
                  <span className="text-xl font-bold font-num" style={{ color: "var(--primary)" }}>{fmt(props.estimateTotal)}</span>
                </div>
                {props.totalSquares > 0 && (
                  <div className="text-[11px] text-right" style={{ color: "var(--muted-foreground)" }}>
                    {fmt(props.costPerSquare)}/sq
                  </div>
                )}
              </div>

              {/* Margin */}
              <div className="pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-3.5 h-3.5" style={{ color: "var(--primary)" }} />
                  <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Margin</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {[30, 35, 40, 45, 50].map(pct => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => props.onTargetMarginChange(pct)}
                      className="px-3 py-2 rounded-lg text-[12px] font-semibold transition-all"
                      style={{
                        background: props.state.targetMarginPct === pct ? "rgba(0,212,170,0.15)" : "var(--background)",
                        border: `1px solid ${props.state.targetMarginPct === pct ? "rgba(0,212,170,0.3)" : "var(--border)"}`,
                        color: props.state.targetMarginPct === pct ? "var(--primary)" : "var(--muted-foreground)",
                      }}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
                <div className="surface-highlight rounded-lg p-3 flex justify-between items-center">
                  <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>Charge Customer</span>
                  <span className="font-num text-lg font-bold" style={{ color: "var(--primary)" }}>{fmt(props.requiredCustomerPrice)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 space-y-2" style={{ borderTop: "1px solid var(--border)" }}>
                <button
                  type="button"
                  onClick={() => { props.onGeneratePdf(); setSheetOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  <FileText className="w-4 h-4" />
                  Export PDF
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { props.onSave(); setSheetOpen(false); }}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[12px] font-medium"
                    style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => { props.onReset(); setSheetOpen(false); }}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[12px] font-medium"
                    style={{ border: "1px solid var(--border)", color: "var(--destructive)" }}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
