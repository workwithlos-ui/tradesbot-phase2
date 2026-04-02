import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LABOR_ITEMS, SHINGLE_TYPES, STEEP_PITCH_TIERS, MARKET_CONFIGS } from "@/lib/data";
import type { EstimatorState } from "@/hooks/useEstimator";
import { formatCurrency } from "@/lib/utils";
import { ClipboardCheck, Copy, Printer, CheckCircle } from "lucide-react";

interface WorkOrderModalProps {
  state: EstimatorState;
  shingleSquares: number;
  laborSquares: number;
  baseLaborCost: number;
  additionalLaborCost: number;
  steepPitchAdder: number;
  totalLaborCost: number;
}

export default function WorkOrderModal({
  state,
  shingleSquares,
  laborSquares,
  baseLaborCost,
  additionalLaborCost,
  steepPitchAdder,
  totalLaborCost,
}: WorkOrderModalProps) {
  const [copied, setCopied] = useState(false);

  const shingle = SHINGLE_TYPES.find((s) => s.id === state.shingleType);
  const market = MARKET_CONFIGS.find((m) => m.id === state.market);
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

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
    lines.push(`  Base Labor: ${laborSquares.toFixed(1)} sq × $${state.laborCosts["base-labor"] || 80}/sq = ${formatCurrency(baseLaborCost)}`);
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
    lines.push(`  TOTAL LABOR: ${formatCurrency(totalLaborCost)}`);
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <ClipboardCheck className="w-3.5 h-3.5" />
          Work Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-primary" />
            Work Order — {state.jobName || state.customerName || "New Job"}
          </DialogTitle>
        </DialogHeader>

        {/* Job Header */}
        <div className="bg-secondary/50 rounded-lg p-4 text-sm space-y-1">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div><span className="font-semibold">Date:</span> {today}</div>
            <div><span className="font-semibold">Market:</span> {market?.name || "St. Louis, MO"}</div>
            <div><span className="font-semibold">Customer:</span> {state.customerName || "—"}</div>
            <div><span className="font-semibold">Phone:</span> {state.customerPhone || "—"}</div>
            <div className="col-span-2"><span className="font-semibold">Address:</span> {state.address || "—"}</div>
            <div><span className="font-semibold">Shingle:</span> {shingle?.name || "—"}</div>
            <div><span className="font-semibold">Squares:</span> {shingleSquares.toFixed(1)} sq (labor: {laborSquares.toFixed(1)} sq)</div>
          </div>
        </div>

        {/* Special Conditions */}
        {specialConditions.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
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
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-secondary/50 px-3 py-2 border-b border-border">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Labor Scope</span>
          </div>

          {/* Base Labor */}
          <div className="p-3 border-b border-border/50">
            <div className="flex items-center justify-between mb-1">
              <div>
                <span className="text-sm font-semibold">Base Labor</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {laborSquares.toFixed(1)} sq × ${state.laborCosts["base-labor"] || 80}/sq
                </span>
              </div>
              <span className="text-sm font-bold font-num">{formatCurrency(baseLaborCost)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Includes: tear off, install shingles, underlayment, ice/water shield, drip edges, valley metal, pipe jacks, haul off and clean up
            </p>
          </div>

          {/* Steep Pitch */}
          {steepPitchAdder > 0 && (
            <div className="p-3 border-b border-border/50 bg-amber-50/50">
              <div className="flex items-center justify-between mb-1">
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
            <div key={item.name} className="p-3 border-b border-border/50 last:border-b-0">
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
          <div className="p-3 bg-primary/5 border-t border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">Total Labor</span>
              <span className="text-lg font-bold font-num text-primary">{formatCurrency(totalLaborCost)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button onClick={handleCopy} variant="outline" className="gap-1.5 flex-1">
            {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy to Clipboard"}
          </Button>
          <Button onClick={handlePrint} variant="outline" className="gap-1.5 flex-1">
            <Printer className="w-3.5 h-3.5" />
            Print Work Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
