import { useState } from "react";
import { SHINGLE_TYPES, SUPPLIERS, getTotalSquares } from "@/lib/data";
import type { EstimatorState } from "@/hooks/useEstimator";
import type { MaterialCostLine } from "@/lib/data";
import { Copy, Printer, CheckCircle, X } from "lucide-react";

function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  state: EstimatorState;
  materialCostLines: MaterialCostLine[];
  totalMaterialCost: number;
}

export default function MaterialOrderModal({ isOpen, onClose, state, materialCostLines, totalMaterialCost }: Props) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shingle = SHINGLE_TYPES.find((s) => s.id === state.shingleType);
  const supplier = SUPPLIERS.find((s) => s.id === state.supplier);
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const activeLines = materialCostLines.filter(l => l.qty > 0);

  const generateOrderText = () => {
    const lines = [
      "MATERIAL ORDER",
      "=".repeat(60),
      `Date: ${today}`,
      `Customer: ${state.customerName || "N/A"}`,
      `Job: ${state.jobName || "N/A"}`,
      `Address: ${state.address || "N/A"}`,
      `Supplier: ${supplier?.name || "ABC Supply"}`,
      `Shingle: ${shingle?.name || "N/A"}`,
      `Roof Squares: ${getTotalSquares(state.measurements)}`,
      "-".repeat(60),
      "",
      `${"Item".padEnd(35)} ${"Qty".padStart(6)} ${"Unit".padEnd(10)} ${"Total".padStart(10)}`,
      "-".repeat(65),
    ];
    for (const line of activeLines) {
      lines.push(
        `${line.name.padEnd(35)} ${String(line.qty).padStart(6)} ${line.unit.padEnd(10)} ${fmt(line.total).padStart(10)}`
      );
    }
    lines.push("-".repeat(65));
    lines.push(`${"TOTAL".padEnd(35)} ${"".padStart(6)} ${"".padEnd(10)} ${fmt(totalMaterialCost).padStart(10)}`);
    lines.push("");
    lines.push("Notes: Please confirm pricing and delivery date.");
    lines.push(`Deliver to: ${state.address || "TBD"}`);
    lines.push(`Contact: ${state.customerName || "TBD"} ${state.customerPhone ? `| ${state.customerPhone}` : ""}`);
    return lines.join("\n");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateOrderText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>Material Order</title><style>body{font-family:monospace;font-size:12px;padding:20px;background:#fff;color:#000}pre{white-space:pre-wrap}</style></head><body><pre>${generateOrderText()}</pre></body></html>`);
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
        <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--foreground)" }}>Material Order</h2>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>{supplier?.name || "ABC Supply"} / {shingle?.name || "N/A"}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg transition-colors" style={{ color: "var(--muted-foreground)" }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div className="rounded-lg p-3" style={{ background: "var(--secondary)" }}>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div><span style={{ color: "var(--muted-foreground)" }}>Date:</span> <span style={{ color: "var(--foreground)" }}>{today}</span></div>
              <div><span style={{ color: "var(--muted-foreground)" }}>Customer:</span> <span style={{ color: "var(--foreground)" }}>{state.customerName || "--"}</span></div>
              <div className="col-span-2"><span style={{ color: "var(--muted-foreground)" }}>Address:</span> <span style={{ color: "var(--foreground)" }}>{state.address || "--"}</span></div>
              <div><span style={{ color: "var(--muted-foreground)" }}>Roof Sq:</span> <span className="font-num font-medium" style={{ color: "var(--foreground)" }}>{getTotalSquares(state.measurements)}</span></div>
              <div><span style={{ color: "var(--muted-foreground)" }}>Waste:</span> <span className="font-num font-medium" style={{ color: "var(--foreground)" }}>{state.wasteFactor}%</span></div>
            </div>
          </div>

          {activeLines.length === 0 ? (
            <div className="text-center py-8 rounded-lg" style={{ border: "1px dashed var(--border)" }}>
              <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>No materials calculated yet. Enter roof measurements first.</p>
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <table className="w-full text-[11px]">
                <thead>
                  <tr style={{ background: "var(--secondary)" }}>
                    <th className="text-left px-3 py-2 font-semibold" style={{ color: "var(--muted-foreground)" }}>Item</th>
                    <th className="text-right px-3 py-2 font-semibold" style={{ color: "var(--muted-foreground)" }}>Qty</th>
                    <th className="text-left px-3 py-2 font-semibold hidden sm:table-cell" style={{ color: "var(--muted-foreground)" }}>Unit</th>
                    <th className="text-right px-3 py-2 font-semibold hidden sm:table-cell" style={{ color: "var(--muted-foreground)" }}>Unit $</th>
                    <th className="text-right px-3 py-2 font-semibold" style={{ color: "var(--muted-foreground)" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {activeLines.map((line) => (
                    <tr key={line.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td className="px-3 py-2 font-medium" style={{ color: "var(--foreground)" }}>{line.name}</td>
                      <td className="px-3 py-2 text-right font-num font-bold" style={{ color: "var(--foreground)" }}>{line.qty}</td>
                      <td className="px-3 py-2 hidden sm:table-cell" style={{ color: "var(--muted-foreground)" }}>{line.unit}</td>
                      <td className="px-3 py-2 text-right font-num hidden sm:table-cell" style={{ color: "var(--muted-foreground)" }}>{fmt(line.unitPrice)}</td>
                      <td className="px-3 py-2 text-right font-num font-semibold" style={{ color: "var(--foreground)" }}>{fmt(line.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: "rgba(0,212,170,0.06)" }}>
                    <td colSpan={4} className="px-3 py-2.5 font-bold" style={{ color: "var(--foreground)" }}>Total</td>
                    <td className="px-3 py-2.5 text-right font-bold font-num" style={{ color: "var(--primary)" }}>{fmt(totalMaterialCost)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          <div className="surface-warn rounded-lg p-3">
            <p className="text-[11px] font-medium" style={{ color: "#FBBF24" }}>
              Confirm pricing with {supplier?.name || "ABC Supply"} before finalizing. Deliver to: {state.address || "TBD"}
            </p>
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