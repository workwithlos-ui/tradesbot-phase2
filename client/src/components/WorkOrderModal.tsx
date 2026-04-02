import { useState } from "react";
import { LABOR_ITEMS, SHINGLE_TYPES, STEEP_PITCH_TIERS, MARKET_CONFIGS } from "@/lib/data";
import type { EstimatorState } from "@/hooks/useEstimator";
import { formatCurrency } from "@/lib/utils";
import { ClipboardCheck, Copy, Printer, CheckCircle, X } from "lucide-react";

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

  // Active labor items (non-base with qty > 0)
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

  // Active steep pitch tiers
  const activePitchTiers = STEEP_PITCH_TIERS.filter((t) => (state.steepPitchSquares[t.id] || 0) > 0);
  const steepPitchAdder = activePitchTiers.reduce((sum, t) => sum + (state.steepPitchSquares[t.id] || 0) * t.adderPerSquare, 0);

  // Special conditions
  const specialConditions: string[] = [];
  if ((state.laborQtys["hand-load"] || 0) > 0) specialConditions.push("Hand load required");
  if ((state.laborQtys["two-story-charge"] || 0) > 0) specialConditions.push("Two-story home");
  if ((state.laborQtys["shake-tear-off"] || 0) > 0) specialConditions.push("Shake/wood shingle tear off");
  if ((state.laborQtys["access-charge"] || 0) > 0) specialConditions.push("Special access required — dump trailer/drag trash");
  if (activePitchTiers.length > 0) specialConditions.push(`Steep pitch: ${activePitchTiers.map((t) => t.label).join(", ")}`);

  const generateWorkOrderText = () => {
    const lines = [
      "═══════════════════════════════════════════════════════",
      "                    WORK ORDER",
      "═══════════════════════════════════════════════════════",
      `Date: ${today}`,
      `Customer: ${state.customerName || "(No customer name)"}`,
      `Job Address: ${state.address || "(No address)"}`,
      `Job Name: ${state.jobName || "(No job name)"}`,
      `Market: ${market?.name || "St. Louis, MO"}`,
      "",
      "JOB SPECIFICATIONS:",
      `  Shingle Type: ${shingle?.name || "N/A"}`,
      `  Shingle Squares: ${shingleSquares.toFixed(1)} sq`,
      `  Labor Squares: ${laborSquares.toFixed(1)} sq`,
      "",
    ];

    if (specialConditions.length > 0) {
      lines.push("SPECIAL CONDITIONS:");
      specialConditions.forEach((c) => lines.push(`  ⚠ ${c}`));
      lines.push("");
    }

    lines.push("LABOR SCOPE:");
    lines.push("─".repeat(60));
    lines.push(`  Base Labor: ${laborSquares.toFixed(1)} sq × $${baseRate}/sq = ${formatCurrency(baseLaborCost)}`);
    lines.push("  Includes: tear off, install shingles, underlayment, ice/water shield,");
    lines.push("            drip edges, valley metal, pipe jacks, haul off and clean up");

    if (activePitchTiers.length > 0) {
      lines.push("");
      lines.push("  Steep Pitch Adder:");
      activePitchTiers.forEach((tier) => {
        const sq = state.steepPitchSquares[tier.id] || 0;
        lines.push(`    ${tier.label}: ${sq} sq × $${tier.adderPerSquare}/sq = ${formatCurrency(sq * tier.adderPerSquare)}`);
      });
      lines.push(`  Steep Pitch Total: ${formatCurrency(steepPitchAdder)}`);
    }

    if (activeLaborItems.length > 0) {
      lines.push("");
      lines.push("  Additional Labor Items:");
      activeLaborItems.forEach((item) => {
        lines.push(`    ${item.name}: ${item.qty} ${item.unit} × $${item.costPerUnit} = ${formatCurrency(item.total)}`);
        if (item.description) lines.push(`      (${item.description})`);
      });
    }

    lines.push("");
    lines.push("─".repeat(60));
    lines.push(`  TOTAL LABOR: ${formatCurrency(laborTotal)}`);
    lines.push("═══════════════════════════════════════════════════════");
    lines.push("PAYMENT TERMS:");
    lines.push("  Payment due upon completion and inspection.");
    lines.push("═══════════════════════════════════════════════════════");

    return lines.join("\n");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateWorkOrderText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Work Order — ${state.jobName || state.customerName || "TradesBot"}</title>
          <style>
            body { font-family: monospace; font-size: 12px; padding: 20px; }
            pre { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <pre>${generateWorkOrderText()}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-card rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 sticky top-0 bg-card">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center text-primary">
              <ClipboardCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Work Order</h2>
              <p className="text-xs text-muted-foreground">{state.jobName || state.customerName || "New Job"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Job Header */}
          <div className="bg-secondary/50 rounded-xl p-4 text-sm">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              <div><span className="font-medium text-muted-foreground">Date:</span> {today}</div>
              <div><span className="font-medium text-muted-foreground">Market:</span> {market?.name || "St. Louis, MO"}</div>
              <div><span className="font-medium text-muted-foreground">Customer:</span> {state.customerName || "—"}</div>
              <div><span className="font-medium text-muted-foreground">Phone:</span> {state.customerPhone || "—"}</div>
              <div className="col-span-2"><span className="font-medium text-muted-foreground">Address:</span> {state.address || "—"}</div>
              <div><span className="font-medium text-muted-foreground">Shingle:</span> {shingle?.name || "—"}</div>
              <div><span className="font-medium text-muted-foreground">Squares:</span> <span className="font-num">{shingleSquares.toFixed(1)} sq (labor: {laborSquares.toFixed(1)} sq)</span></div>
            </div>
          </div>

          {/* Special Conditions */}
          {specialConditions.length > 0 && (
            <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5">
              <p className="text-xs font-bold text-amber-800 mb-2 uppercase tracking-wider">⚠ Special Conditions</p>
              <ul className="space-y-1">
                {specialConditions.map((c, i) => (
                  <li key={i} className="text-sm text-amber-800 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Labor Scope */}
          <div className="border border-border/60 rounded-xl overflow-hidden">
            <div className="bg-secondary/50 px-4 py-2.5 border-b border-border/60">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Labor Scope</span>
            </div>

            {/* Base Labor */}
            <div className="p-4 border-b border-border/40">
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <span className="text-sm font-semibold">Base Labor</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {laborSquares.toFixed(1)} sq × ${baseRate}/sq
                  </span>
                </div>
                <span className="text-sm font-bold font-num">{formatCurrency(baseLaborCost)}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Includes: tear off, install shingles, underlayment, ice/water shield, drip edges, valley metal, pipe jacks, haul off and clean up
              </p>
            </div>

            {/* Steep Pitch */}
            {steepPitchAdder > 0 && (
              <div className="p-4 border-b border-border/40 bg-amber-50/50">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold">Steep Pitch Adder</span>
                  <span className="text-sm font-bold font-num">{formatCurrency(steepPitchAdder)}</span>
                </div>
                {activePitchTiers.map((tier) => {
                  const sq = state.steepPitchSquares[tier.id] || 0;
                  return (
                    <div key={tier.id} className="text-xs text-muted-foreground">
                      {tier.label}: {sq} sq × ${tier.adderPerSquare}/sq = {formatCurrency(sq * tier.adderPerSquare)}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Additional Labor Items */}
            {activeLaborItems.map((item) => (
              <div key={item.name} className="p-4 border-b border-border/40 last:border-b-0">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {item.qty} {item.unit} × ${item.costPerUnit}
                    </span>
                  </div>
                  <span className="text-sm font-bold font-num">{formatCurrency(item.total)}</span>
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="p-4 bg-primary/5 border-t border-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">Total Labor</span>
                <span className="text-lg font-bold font-num text-primary">{formatCurrency(laborTotal)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pb-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Text"}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
