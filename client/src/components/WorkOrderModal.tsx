import { useState } from "react";
import { SHINGLE_TYPES, MARKET_CONFIGS, getTotalSquares } from "@/lib/data";
import type { EstimatorState } from "@/hooks/useEstimator";
import type { LaborCostLine } from "@/lib/data";
import { Copy, Printer, CheckCircle, X } from "lucide-react";

function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  state: EstimatorState;
  laborCostLines: LaborCostLine[];
  totalLaborCost: number;
}

export default function WorkOrderModal({ isOpen, onClose, state, laborCostLines, totalLaborCost }: Props) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shingle = SHINGLE_TYPES.find((s) => s.id === state.shingleType);
  const market = MARKET_CONFIGS.find((m) => m.id === state.market);
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const activeLines = laborCostLines.filter(l => l.qty > 0);
  const m = state.measurements;

  const totalSq = getTotalSquares(m);
  const specialConditions: string[] = [];
  if (m.shakeTearoff) specialConditions.push("Cedar shake tear off");
  if (m.handLoad) specialConditions.push("Hand load required");
  if (m.noDumpsterAccess) specialConditions.push("No dumpster access -- drag trash charge");
  if (m.stories >= 2) specialConditions.push("Two-story home (+$10/sq)");
  if (m.pitch89Sq > 0) specialConditions.push(`${m.pitch89Sq} SQ at 8-9 pitch (+$10/sq)`);
  if (m.pitch1011Sq > 0) specialConditions.push(`${m.pitch1011Sq} SQ at 10-11 pitch (+$20/sq)`);
  if (m.pitch12PlusSq > 0) specialConditions.push(`${m.pitch12PlusSq} SQ at 12+ pitch (+$30/sq)`);
  if (m.pitchMansardSq > 0) specialConditions.push(`${m.pitchMansardSq} SQ mansard (+$40/sq)`);

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
      `Roof Squares: ${totalSq}`,
      `Pitch Zones: ${m.pitchBaseSq} base${m.pitch89Sq ? `, ${m.pitch89Sq} at 8-9` : ""}${m.pitch1011Sq ? `, ${m.pitch1011Sq} at 10-11` : ""}${m.pitch12PlusSq ? `, ${m.pitch12PlusSq} at 12+` : ""}${m.pitchMansardSq ? `, ${m.pitchMansardSq} mansard` : ""}`,
      "",
    ];
    if (specialConditions.length > 0) {
      lines.push("SPECIAL CONDITIONS:");
      specialConditions.forEach((c) => lines.push(`  * ${c}`));
      lines.push("");
    }
    lines.push("LABOR SCOPE:");
    lines.push("-".repeat(60));
    for (const line of activeLines) {
      lines.push(`  ${line.name}: ${line.qty} ${line.unit} x $${line.rate} = ${fmt(line.total)}`);
    }
    lines.push("-".repeat(60));
    lines.push(`  TOTAL LABOR: ${fmt(totalLaborCost)}`);
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
              <div><span style={{ color: "var(--muted-foreground)" }}>Customer:</span> <span style={{ color: "var(--foreground)" }}>{state.customerName || "--"}</span></div>
              <div><span style={{ color: "var(--muted-foreground)" }}>Phone:</span> <span style={{ color: "var(--foreground)" }}>{state.customerPhone || "--"}</span></div>
              <div className="col-span-2"><span style={{ color: "var(--muted-foreground)" }}>Address:</span> <span style={{ color: "var(--foreground)" }}>{state.address || "--"}</span></div>
              <div><span style={{ color: "var(--muted-foreground)" }}>Shingle:</span> <span style={{ color: "var(--foreground)" }}>{shingle?.name || "--"}</span></div>
              <div><span style={{ color: "var(--muted-foreground)" }}>Roof Sq:</span> <span className="font-num" style={{ color: "var(--foreground)" }}>{totalSq}</span></div>
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

            {activeLines.map((line) => (
              <div key={line.id} className="p-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[13px] font-medium" style={{ color: "var(--foreground)" }}>{line.name}</span>
                    <span className="text-[11px] ml-2" style={{ color: "var(--muted-foreground)" }}>
                      {line.qty} {line.unit} x ${line.rate}
                    </span>
                  </div>
                  <span className="text-[13px] font-bold font-num" style={{ color: "var(--foreground)" }}>{fmt(line.total)}</span>
                </div>
              </div>
            ))}

            <div className="p-4" style={{ background: "rgba(0,212,170,0.06)" }}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Total Labor</span>
                <span className="text-lg font-bold font-num" style={{ color: "var(--primary)" }}>{fmt(totalLaborCost)}</span>
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