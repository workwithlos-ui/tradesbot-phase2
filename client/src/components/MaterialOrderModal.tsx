import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MATERIAL_ITEMS, SHINGLE_TYPES, SUPPLIERS } from "@/lib/data";
import type { EstimatorState } from "@/hooks/useEstimator";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, Copy, Printer, CheckCircle } from "lucide-react";

interface MaterialOrderModalProps {
  state: EstimatorState;
  shingleSquares: number;
  totalMaterialCost: number;
}

export default function MaterialOrderModal({ state, shingleSquares, totalMaterialCost }: MaterialOrderModalProps) {
  const [copied, setCopied] = useState(false);

  const shingle = SHINGLE_TYPES.find((s) => s.id === state.shingleType);
  const supplier = SUPPLIERS.find((s) => s.id === state.supplier);
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  // Build order lines (only items with qty > 0)
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <ShoppingCart className="w-3.5 h-3.5" />
          Material Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-primary" />
            Material Order — {supplier?.name || "ABC Supply"}
          </DialogTitle>
        </DialogHeader>

        {/* Order Header */}
        <div className="bg-secondary/50 rounded-lg p-4 text-sm space-y-1">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div><span className="font-semibold">Date:</span> {today}</div>
            <div><span className="font-semibold">Supplier:</span> {supplier?.name || "ABC Supply"}</div>
            <div><span className="font-semibold">Customer:</span> {state.customerName || "—"}</div>
            <div><span className="font-semibold">Shingle:</span> {shingle?.name || "—"}</div>
            <div className="col-span-2"><span className="font-semibold">Address:</span> {state.address || "—"}</div>
            <div><span className="font-semibold">Squares:</span> {shingleSquares.toFixed(1)} sq</div>
          </div>
        </div>

        {/* Order Lines */}
        {orderLines.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground text-sm">No materials entered yet. Fill in the Materials section first.</p>
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/50 border-b border-border">
                  <th className="text-left px-3 py-2 font-semibold text-muted-foreground text-xs">#</th>
                  <th className="text-left px-3 py-2 font-semibold text-muted-foreground text-xs">Item</th>
                  <th className="text-right px-3 py-2 font-semibold text-muted-foreground text-xs">Qty</th>
                  <th className="text-left px-3 py-2 font-semibold text-muted-foreground text-xs">Unit</th>
                  <th className="text-right px-3 py-2 font-semibold text-muted-foreground text-xs">Unit $</th>
                  <th className="text-right px-3 py-2 font-semibold text-muted-foreground text-xs">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderLines.map((line) => (
                  <tr key={line.lineNumber} className="border-b border-border/30 last:border-b-0 hover:bg-secondary/20">
                    <td className="px-3 py-2 text-muted-foreground text-xs font-num">{line.lineNumber}</td>
                    <td className="px-3 py-2 font-medium">{line.name}</td>
                    <td className="px-3 py-2 text-right font-num font-bold">{line.qty}</td>
                    <td className="px-3 py-2 text-muted-foreground text-xs">{line.unit}</td>
                    <td className="px-3 py-2 text-right font-num text-muted-foreground">{formatCurrency(line.unitPrice)}</td>
                    <td className="px-3 py-2 text-right font-num font-semibold">{formatCurrency(line.total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-primary/5 border-t border-primary/20">
                  <td colSpan={5} className="px-3 py-2 font-bold text-sm">Total Material Cost</td>
                  <td className="px-3 py-2 text-right font-bold font-num text-primary text-sm">{formatCurrency(totalMaterialCost)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Notes */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
          <p className="font-semibold mb-1">Order Notes:</p>
          <ul className="space-y-0.5 list-disc list-inside">
            <li>Confirm all pricing with {supplier?.name || "ABC Supply"} before finalizing</li>
            <li>Delivery address: {state.address || "TBD"}</li>
            {state.deliveryEnabled && <li>Delivery requested — coordinate with supplier</li>}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button onClick={handleCopy} variant="outline" className="gap-1.5 flex-1">
            {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy to Clipboard"}
          </Button>
          <Button onClick={handlePrint} variant="outline" className="gap-1.5 flex-1">
            <Printer className="w-3.5 h-3.5" />
            Print Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
