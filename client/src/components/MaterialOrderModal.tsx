import { useState } from "react";
import { MATERIAL_ITEMS, SHINGLE_TYPES, SUPPLIERS } from "@/lib/data";
import type { EstimatorState } from "@/hooks/useEstimator";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, Copy, Printer, CheckCircle, X } from "lucide-react";

interface MaterialOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: EstimatorState;
  shingleSquares: number;
  laborSquares: number;
}

export default function MaterialOrderModal({ isOpen, onClose, state, shingleSquares, laborSquares }: MaterialOrderModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shingle = SHINGLE_TYPES.find((s) => s.id === state.shingleType);
  const supplier = SUPPLIERS.find((s) => s.id === state.supplier);
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const totalMaterialCost = MATERIAL_ITEMS.reduce(
    (sum, item) => sum + (state.materialQtys[item.id] || 0) * item.unitPrice,
    0
  );

  const orderLines = MATERIAL_ITEMS
    .filter((item) => (state.materialQtys[item.id] || 0) > 0)
    .map((item) => ({
      lineNumber: item.lineNumber,
      name: item.name,
      qty: state.materialQtys[item.id] || 0,
      unit: item.unit,
      unitPrice: item.unitPrice,
      total: (state.materialQtys[item.id] || 0) * item.unitPrice,
    }));

  const generateOrderText = () => {
    const lines = [
      "═══════════════════════════════════════════════════════",
      "                  MATERIAL ORDER",
      "═══════════════════════════════════════════════════════",
      `Date: ${today}`,
      `Customer: ${state.customerName || "(No customer name)"}`,
      `Job Address: ${state.address || "(No address)"}`,
      `Job Name: ${state.jobName || "(No job name)"}`,
      `Supplier: ${supplier?.name || "ABC Supply"}`,
      `Shingle Type: ${shingle?.name || "N/A"}`,
      `Shingle Squares: ${shingleSquares.toFixed(1)} sq`,
      "───────────────────────────────────────────────────────",
      "",
      "MATERIAL ORDER LIST:",
      "",
      `${"#".padEnd(4)} ${"Item".padEnd(35)} ${"Qty".padStart(6)} ${"Unit".padEnd(10)} ${"Unit $".padStart(8)} ${"Total".padStart(10)}`,
      "─".repeat(80),
    ];

    for (const line of orderLines) {
      lines.push(
        `${String(line.lineNumber).padEnd(4)} ${line.name.padEnd(35)} ${String(line.qty).padStart(6)} ${line.unit.padEnd(10)} ${formatCurrency(line.unitPrice).padStart(8)} ${formatCurrency(line.total).padStart(10)}`
      );
    }

    lines.push("─".repeat(80));
    lines.push(`${"".padEnd(4)} ${"TOTAL MATERIAL COST".padEnd(35)} ${"".padStart(6)} ${"".padEnd(10)} ${"".padStart(8)} ${formatCurrency(totalMaterialCost).padStart(10)}`);
    lines.push("");
    lines.push("═══════════════════════════════════════════════════════");
    lines.push("Notes:");
    lines.push("- Please confirm pricing before finalizing order");
    lines.push(`- Deliver to: ${state.address || "TBD"}`);
    lines.push(`- Contact: ${state.customerName || "TBD"} ${state.customerPhone ? `| ${state.customerPhone}` : ""}`);
    lines.push("═══════════════════════════════════════════════════════");

    return lines.join("\n");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateOrderText()).then(() => {
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
          <title>Material Order — ${state.jobName || state.customerName || "TradesBot"}</title>
          <style>
            body { font-family: monospace; font-size: 12px; padding: 20px; }
            pre { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <pre>${generateOrderText()}</pre>
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
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Material Order</h2>
              <p className="text-xs text-muted-foreground">{supplier?.name || "ABC Supply"}</p>
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
          {/* Order Header */}
          <div className="bg-secondary/50 rounded-xl p-4 text-sm space-y-1">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              <div><span className="font-medium text-muted-foreground">Date:</span> <span>{today}</span></div>
              <div><span className="font-medium text-muted-foreground">Supplier:</span> <span>{supplier?.name || "ABC Supply"}</span></div>
              <div><span className="font-medium text-muted-foreground">Customer:</span> <span>{state.customerName || "—"}</span></div>
              <div><span className="font-medium text-muted-foreground">Shingle:</span> <span>{shingle?.name || "—"}</span></div>
              <div className="col-span-2"><span className="font-medium text-muted-foreground">Address:</span> <span>{state.address || "—"}</span></div>
              <div><span className="font-medium text-muted-foreground">Squares:</span> <span className="font-num">{shingleSquares.toFixed(1)} sq</span></div>
            </div>
          </div>

          {/* Order Lines */}
          {orderLines.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-border/60 rounded-xl">
              <p className="text-muted-foreground text-sm">No materials entered yet.</p>
            </div>
          ) : (
            <div className="border border-border/60 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/50 border-b border-border/60">
                    <th className="text-left px-3 py-2 font-semibold text-muted-foreground text-xs">#</th>
                    <th className="text-left px-3 py-2 font-semibold text-muted-foreground text-xs">Item</th>
                    <th className="text-right px-3 py-2 font-semibold text-muted-foreground text-xs">Qty</th>
                    <th className="text-left px-3 py-2 font-semibold text-muted-foreground text-xs hidden sm:table-cell">Unit</th>
                    <th className="text-right px-3 py-2 font-semibold text-muted-foreground text-xs hidden sm:table-cell">Unit $</th>
                    <th className="text-right px-3 py-2 font-semibold text-muted-foreground text-xs">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderLines.map((line) => (
                    <tr key={line.lineNumber} className="border-b border-border/30 last:border-b-0">
                      <td className="px-3 py-2 text-muted-foreground text-xs font-num">{line.lineNumber}</td>
                      <td className="px-3 py-2 font-medium text-sm">{line.name}</td>
                      <td className="px-3 py-2 text-right font-num font-bold">{line.qty}</td>
                      <td className="px-3 py-2 text-muted-foreground text-xs hidden sm:table-cell">{line.unit}</td>
                      <td className="px-3 py-2 text-right font-num text-muted-foreground hidden sm:table-cell">{formatCurrency(line.unitPrice)}</td>
                      <td className="px-3 py-2 text-right font-num font-semibold">{formatCurrency(line.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-primary/5 border-t border-primary/20">
                    <td colSpan={5} className="px-3 py-2.5 font-bold text-sm">Total Material Cost</td>
                    <td className="px-3 py-2.5 text-right font-bold font-num text-primary text-sm">{formatCurrency(totalMaterialCost)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* Notes */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-800">
            <p className="font-semibold mb-1.5">Order Notes:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Confirm all pricing with {supplier?.name || "ABC Supply"} before finalizing</li>
              <li>Delivery address: {state.address || "TBD"}</li>
              {state.deliveryEnabled && <li>Delivery requested — coordinate with supplier</li>}
            </ul>
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
