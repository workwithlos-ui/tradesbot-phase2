import { useState } from "react";
import { LABOR_ITEMS, SHINGLE_TYPES, STEEP_PITCH_TIERS, MARKET_CONFIGS } from "@/lib/data";
import type { EstimatorState } from "@/hooks/useEstimator";
import { formatCurrency } from "@/lib/utils";
import { Copy, Printer, CheckCircle, X } from "lucide-react";

interface WorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: EstimatorState;
  shingleSquares: number;
  laborSquares: number;
  laborTotal: number;
}

export default function WorkOrderModal({ isOpen, onClose, state, shingleSquares, laborSquares, laborTotal }: WorkOrderModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shingle = SHINGLE_TYPES.find((s) => s.id === state.shingleType);
  const market = MARKET_CONFIGS.find((m) => m.id === state.market);
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const baseRate = state.laborCosts["base-labor"] || 80;
  const baseLaborCost = laborSquares * baseRate;

  const activeLaborItems = LABOR_ITEMS
    .filter((item) => !item.isBaseLabor && (state.laborQtys[item.id] || 0) > 0)
    .map((item) => ({
      name: item.name,
      qty: state.laborQtys[item.id] || 0,
      unit: item.unit,
      costPerUnit: state.laborCosts[item.id] || item.defaultCostPerUnit,
      total: (state.laborQtys[item.id] || 0) * (state.laborCosts[item.id] || item.defaultCostPerUnit),
      description: item.description,
    }));

  const activePitchTiers = STEEP_PITCH_TIERS.filter((t) => (state.steepPitchSquares[t.id] || 0) > 0);
  const steepPitchAdder = activePitchTiers.reduce((sum, t) => sum + (state.steepPitchSquares[t.id] || 0) * t.adderPerSquare, 0);

  const specialConditions: string[] = [];
  if ((state.laborQtys["hand-load"] || 0) > 0) specialConditions.push("Hand load required");
  if ((state.laborQtys["two-story-charge"] || 0) > 0) specialConditions.push("Two-story home");
  if ((state.laborQtys["shake-tear-off"] || 0) > 0) specialConditions.push("Shake/wood shingle tear off");
  if ((state.laborQtys["access-charge"] || 0) > 0) specialConditions.push("Special access — dump trailer/drag trash");
  if (activePitchTiers.length > 0) specialConditions.push(`Steep pitch: ${activePitchTiers.map((t) => t.label).join(", ")}`);

  const generateWorkOrderText = () => {
    const lines = [
      "WORK ORDER",
      "=".repeat(60),
      `Date: ${today}`,
      `Customer: ${state.customerName || "N/A"}`,
      `Job: ${state.jobName || "N/A"}`,
      `Address: ${state.address || "N/A"}`,
      `Market: ${market?.name || "St. Louis, MO"}`,
      `Shingle: ${shingle?.name || "N/A"}`,
      `Squares: ${shingleSquares.toFixed(1)} shingle / ${laborSquares.toFixed(1)} labor`,
      "",
    ];
    if (specialConditions.length > 0) {
      lines.push("SPECIAL CONDITIONS:");
      specialConditions.forEach((c) => lines.push(`  * ${c}`));
      lines.push("");
    }
    lines.push("LABOR SCOPE:");
    lines.push("-".repeat(60));
    lines.push(`  Base Labor: ${laborSquares.toFixed(1)} sq x $${baseRate}/sq = ${formatCurrency(baseLaborCost)}`);
    lines.push("  Includes: tear off, install, underlayment, ice/water, drip edges,");
    lines.push("            valley metal, pipe jacks, haul off, clean up");
    if (activePitchTiers.length > 0) {
      lines.push("");
      lines.push("  Steep Pitch:");
      activePitchTiers.forEach((tier) => {
        const sq = state.steepPitchSquares[tier.id] || 0;
        lines.push(`    ${tier.label}: ${sq} sq x $${tier.adderPerSquare}/sq = ${formatCurrency(sq * tier.adderPerSquare)}`);
      });
    }
    if (activeLaborItems.length > 0) {
      lines.push("");
      lines.push("  Additional:");
      activeLaborItems.forEach((item) => {
        lines.push(`    ${item.name}: ${item.qty} ${item.unit} x $${item.costPerUnit} = ${formatCurrency(item.total)}`);
      });
    }
    lines.push("-".repeat(60));
    lines.push(`  TOTAL LABOR: ${formatCurrency(laborTotal)}`);
    lines.push("");
    lines.push("Payment due upon completion and inspection.");
    return lines.join("\n");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateWorkOrderText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>Work Order</title><style>body{font-family:monospace;font-size:12px;padding:20px;background:#fff;color:#000}pre{white-space:pre-wrap}</style></head><body><pre>${generateWorkOrderText()}</pre></body></html>`);
    w.document.close();
    w.print();
  };

  return (
    <>
      <div className="sheet-overlay animate-fade-in" onClick={onClose} />
      <div
        className="fixed inset-4 lg:inset-y-8 lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-2xl z-50 flex flex-col rounded-xl overflow-hidden animate-fade-in"
        style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--foreground)" }}>Work Order</h2>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>{state.jobName || state.customerName || "New Job"}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg transition-colors" style={{ color: "var(--muted-foreground)" }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Job info */}
          <div className="rounded-lg p-3" style={{ background: "var(--secondary)" }}>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div><span style={{ color: "var(--muted-foreground)" }}>Date:</span> <span style={{ color: "var(--foreground)" }}>{today}</span></div>
              <div><span style={{ color: "var(--muted-foreground)" }}>Market:</span> <span style={{ color: "var(--foreground)" }}>{market?.name || "St. Louis"}</span></div>
              <div><span style={{ color: "var(--muted-foreground)" }}>Customer:</span> <span style={{ color: "var(--foreground)" }}>{state.customerName || "—"}</span></div>
              <div><span style={{ color: "var(--muted-foreground)" }}>Phone:</span> <span style={{ color: "var(--foreground)" }}>{state.customerPhone || "—"}</span></div>
              <div className="col-span-2"><span style={{ color: "var(--muted-foreground)" }}>Address:</span> <span style={{ color: "var(--foreground)" }}>{state.address || "—"}</span></div>
              <div><span style={{ color: "var(--muted-foreground)" }}>Shingle:</span> <span style={{ color: "var(--foreground)" }}>{shingle?.name || "—"}</span></div>
              <div><span style={{ color: "var(--muted-foreground)" }}>Squares:</span> <span className="font-num" style={{ color: "var(--foreground)" }}>{shingleSquares.toFixed(1)} / {laborSquares.toFixed(1)} labor</span></div>
            </div>
          </div>

          {/* Special Conditions */}
          {specialConditions.length > 0 && (
            <div className="surface-warn rounded-lg p-3.5">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#FBBF24" }}>Special Conditions</p>
              <ul className="space-y-1">
                {specialConditions.map((c, i) => (
                  <li key={i} className="text-[12px] flex items-center gap-2" style={{ color: "#FBBF24" }}>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#FBBF24" }} />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Labor Scope */}
          <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            <div className="px-4 py-2.5" style={{ background: "var(--secondary)", borderBottom: "1px solid var(--border)" }}>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Labor Scope</span>
            </div>

            <div className="p-4" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <span className="text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>Base Labor</span>
                  <span className="text-[11px] ml-2" style={{ color: "var(--muted-foreground)" }}>
                    {laborSquares.toFixed(1)} sq × ${baseRate}/sq
                  </span>
                </div>
                <span className="text-[13px] font-bold font-num" style={{ color: "var(--foreground)" }}>{formatCurrency(baseLaborCost)}</span>
              </div>
              <p className="text-[10px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                Tear off, install shingles, underlayment, ice/water shield, drip edges, valley metal, pipe jacks, haul off, clean up
              </p>
            </div>

            {steepPitchAdder > 0 && (
              <div className="p-4" style={{ borderBottom: "1px solid var(--border)", background: "rgba(251,191,36,0.04)" }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>Steep Pitch</span>
                  <span className="text-[13px] font-bold font-num" style={{ color: "#FBBF24" }}>{formatCurrency(steepPitchAdder)}</span>
                </div>
                {activePitchTiers.map((tier) => {
                  const sq = state.steepPitchSquares[tier.id] || 0;
                  return (
                    <div key={tier.id} className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                      {tier.label}: {sq} sq × ${tier.adderPerSquare}/sq = {formatCurrency(sq * tier.adderPerSquare)}
                    </div>
                  );
                })}
              </div>
            )}

            {activeLaborItems.map((item) => (
              <div key={item.name} className="p-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[13px] font-medium" style={{ color: "var(--foreground)" }}>{item.name}</span>
                    <span className="text-[11px] ml-2" style={{ color: "var(--muted-foreground)" }}>
                      {item.qty} {item.unit} × ${item.costPerUnit}
                    </span>
                  </div>
                  <span className="text-[13px] font-bold font-num" style={{ color: "var(--foreground)" }}>{formatCurrency(item.total)}</span>
                </div>
              </div>
            ))}

            <div className="p-4" style={{ background: "rgba(0,212,170,0.06)" }}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Total Labor</span>
                <span className="text-lg font-bold font-num" style={{ color: "var(--primary)" }}>{formatCurrency(laborTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 px-5 py-4 shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all active:scale-[0.98]"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Order"}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all"
            style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>
    </>
  );
}
