import { jsPDF } from "jspdf";
import type { EstimatorState } from "@/hooks/useEstimator";
import {
  MATERIAL_ITEMS,
  LABOR_ITEMS,
  CUSTOM_COST_ITEMS,
  SUPPLIERS,
  SHINGLE_TYPES,
  STEEP_PITCH_TIERS,
} from "@/lib/data";

interface PdfData {
  state: EstimatorState;
  totalSquares: number;
  laborQuantities: Record<string, number>;
  totalLaborCost: number;
  totalCustomCosts: number;
}

export function generateEstimatePdf(data: PdfData): void {
  const { state, totalSquares, laborQuantities, totalLaborCost, totalCustomCosts } = data;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const primaryColor: [number, number, number] = [37, 99, 235]; // blue-600
  const darkColor: [number, number, number] = [30, 41, 59]; // slate-800
  const grayColor: [number, number, number] = [100, 116, 139]; // slate-500
  const lightBg: [number, number, number] = [241, 245, 249]; // slate-100

  function checkPageBreak(needed: number) {
    if (y + needed > pageHeight - 25) {
      doc.addPage();
      y = margin;
    }
  }

  function drawLine(yPos: number, color: [number, number, number] = [203, 213, 225]) {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
  }

  // ============================================================
  // HEADER
  // ============================================================
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 32, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("TradesBot", margin, 14);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Roofing Material & Labor Estimate", margin, 20);

  // Right side: company info
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Trusted Roofing LLC", pageWidth - margin, 12, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const supplierName = SUPPLIERS.find((s) => s.id === state.supplier)?.name || state.supplier;
  doc.text(`Supplier: ${supplierName}`, pageWidth - margin, 18, { align: "right" });

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Date: ${today}`, pageWidth - margin, 24, { align: "right" });

  y = 40;

  // ============================================================
  // ESTIMATE # and DATE BAR
  // ============================================================
  doc.setFillColor(...lightBg);
  doc.rect(margin, y, contentWidth, 8, "F");
  doc.setTextColor(...darkColor);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(`ESTIMATE`, margin + 3, y + 5.5);
  doc.setFont("helvetica", "normal");
  doc.text(today, pageWidth - margin - 3, y + 5.5, { align: "right" });
  y += 14;

  // ============================================================
  // CUSTOMER & JOB INFO (two columns)
  // ============================================================
  const colWidth = contentWidth / 2 - 3;

  // Customer Info (left)
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("CUSTOMER INFORMATION", margin, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkColor);
  doc.setFontSize(9);

  const customerLines = [
    state.customerName || "-",
    state.address || "-",
    state.customerPhone || "-",
    state.customerEmail || "-",
  ];
  customerLines.forEach((line) => {
    doc.text(line, margin, y);
    y += 4.5;
  });

  // Job Info (right column, same Y start)
  let rightY = y - customerLines.length * 4.5 - 5;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("JOB DETAILS", margin + colWidth + 6, rightY);
  rightY += 5;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkColor);

  const shingleName = SHINGLE_TYPES.find((s) => s.id === state.shingleType)?.name || state.shingleType;
  const pitchLabel = STEEP_PITCH_TIERS.find((t) => t.id === state.steepPitchTier)?.label || "Standard";

  const jobLines = [
    `Job: ${state.jobName || "-"}`,
    `Shingle: ${shingleName}`,
    `Pitch: ${pitchLabel}`,
    `Total Squares: ${totalSquares.toFixed(1)} sq`,
  ];
  jobLines.forEach((line) => {
    doc.text(line, margin + colWidth + 6, rightY);
    rightY += 4.5;
  });

  y += 4;
  drawLine(y);
  y += 6;

  // ============================================================
  // MATERIALS TABLE
  // ============================================================
  checkPageBreak(30);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("MATERIALS", margin, y);
  y += 6;

  // Table header
  doc.setFillColor(...lightBg);
  doc.rect(margin, y - 3.5, contentWidth, 6, "F");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...grayColor);
  doc.text("#", margin + 2, y);
  doc.text("ITEM", margin + 10, y);
  doc.text("UNIT", margin + 100, y);
  doc.text("QTY", pageWidth - margin - 3, y, { align: "right" });
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkColor);
  doc.setFontSize(8);

  const activeMaterials = MATERIAL_ITEMS.filter((item) => (state.materialQtys[item.id] || 0) > 0);
  activeMaterials.forEach((item, idx) => {
    checkPageBreak(6);
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y - 3.5, contentWidth, 5, "F");
    }
    doc.setTextColor(...grayColor);
    doc.text(String(item.lineNumber), margin + 2, y);
    doc.setTextColor(...darkColor);
    doc.text(item.name, margin + 10, y);
    doc.setTextColor(...grayColor);
    doc.text(item.unit, margin + 100, y);
    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "bold");
    doc.text(String(state.materialQtys[item.id] || 0), pageWidth - margin - 3, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    y += 5;
  });

  if (activeMaterials.length === 0) {
    doc.setTextColor(...grayColor);
    doc.text("No materials entered", margin + 10, y);
    y += 5;
  }

  y += 4;
  drawLine(y);
  y += 6;

  // ============================================================
  // LABOR TABLE
  // ============================================================
  checkPageBreak(30);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("LABOR", margin, y);
  y += 6;

  // Table header
  doc.setFillColor(...lightBg);
  doc.rect(margin, y - 3.5, contentWidth, 6, "F");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...grayColor);
  doc.text("ITEM", margin + 2, y);
  doc.text("UNIT", margin + 70, y);
  doc.text("QTY", margin + 100, y);
  doc.text("$/UNIT", margin + 120, y);
  doc.text("TOTAL", pageWidth - margin - 3, y, { align: "right" });
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  let laborRowIdx = 0;
  const activeLaborItems = LABOR_ITEMS.filter((item) => {
    const qty = laborQuantities[item.id] || 0;
    const cost = state.laborCosts[item.id] || 0;
    return qty > 0 && cost > 0;
  });

  activeLaborItems.forEach((item) => {
    checkPageBreak(6);
    const qty = laborQuantities[item.id] || 0;
    const cost = state.laborCosts[item.id] || 0;
    const lineTotal = qty * cost;

    if (laborRowIdx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y - 3.5, contentWidth, 5, "F");
    }
    doc.setTextColor(...darkColor);
    doc.text(item.name, margin + 2, y);
    doc.setTextColor(...grayColor);
    doc.text(item.unit, margin + 70, y);
    doc.text(qty.toFixed(1), margin + 100, y);
    doc.text(`$${cost.toFixed(2)}`, margin + 120, y);
    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "bold");
    doc.text(`$${lineTotal.toFixed(2)}`, pageWidth - margin - 3, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    y += 5;
    laborRowIdx++;
  });

  if (activeLaborItems.length === 0) {
    doc.setTextColor(...grayColor);
    doc.text("No labor costs entered", margin + 2, y);
    y += 5;
  }

  y += 4;
  drawLine(y);
  y += 6;

  // ============================================================
  // CUSTOM COSTS
  // ============================================================
  const activeCustomCosts = CUSTOM_COST_ITEMS.filter(
    (item) => state.customCostEnabled[item.id] && (state.customCosts[item.id] || 0) > 0
  );

  if (activeCustomCosts.length > 0 || state.deliveryEnabled) {
    checkPageBreak(20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("CUSTOM COSTS & DELIVERY", margin, y);
    y += 6;

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");

    activeCustomCosts.forEach((item) => {
      checkPageBreak(6);
      doc.setTextColor(...darkColor);
      doc.text(item.name, margin + 2, y);
      doc.setFont("helvetica", "bold");
      doc.text(`$${(state.customCosts[item.id] || 0).toFixed(2)}`, pageWidth - margin - 3, y, { align: "right" });
      doc.setFont("helvetica", "normal");
      y += 5;
    });

    if (state.deliveryEnabled) {
      checkPageBreak(6);
      doc.setTextColor(...darkColor);
      doc.text("Delivery", margin + 2, y);
      doc.setFont("helvetica", "bold");
      doc.text(`$${state.deliveryCost.toFixed(2)}`, pageWidth - margin - 3, y, { align: "right" });
      doc.setFont("helvetica", "normal");
      y += 5;
    }

    y += 4;
    drawLine(y);
    y += 6;
  }

  // ============================================================
  // TOTALS
  // ============================================================
  checkPageBreak(35);
  doc.setFillColor(...lightBg);
  doc.rect(pageWidth / 2, y - 2, pageWidth / 2 - margin, 30, "F");

  const totalsX = pageWidth / 2 + 5;
  const totalsValX = pageWidth - margin - 3;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);

  doc.text("Labor Total", totalsX, y + 3);
  doc.setTextColor(...darkColor);
  doc.text(`$${totalLaborCost.toFixed(2)}`, totalsValX, y + 3, { align: "right" });

  doc.setTextColor(...grayColor);
  doc.text("Custom Costs", totalsX, y + 9);
  doc.setTextColor(...darkColor);
  doc.text(`$${totalCustomCosts.toFixed(2)}`, totalsValX, y + 9, { align: "right" });

  if (state.deliveryEnabled) {
    doc.setTextColor(...grayColor);
    doc.text("Delivery", totalsX, y + 15);
    doc.setTextColor(...darkColor);
    doc.text(`$${state.deliveryCost.toFixed(2)}`, totalsValX, y + 15, { align: "right" });
  }

  const deliveryCost = state.deliveryEnabled ? state.deliveryCost : 0;
  const grandTotal = totalLaborCost + totalCustomCosts + deliveryCost;

  drawLine(y + 20, primaryColor);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("ESTIMATE TOTAL", totalsX, y + 27);
  doc.text(`$${grandTotal.toFixed(2)}`, totalsValX, y + 27, { align: "right" });

  y += 40;

  // ============================================================
  // TERMS AND CONDITIONS
  // ============================================================
  checkPageBreak(45);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("TERMS & CONDITIONS", margin, y);
  y += 5;

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);

  const terms = [
    "1. This estimate is valid for 30 days from the date shown above.",
    "2. Payment terms: 50% deposit required before work begins, balance due upon completion.",
    "3. Any changes to the scope of work may result in additional charges.",
    "4. Contractor will obtain all necessary permits unless otherwise noted.",
    "5. All work is guaranteed for a period of 5 years from completion date.",
    "6. Homeowner is responsible for moving vehicles and personal items from work area.",
    "7. Price does not include repair of hidden damage discovered during tear-off (quoted separately).",
    "8. Manufacturer warranty on materials is separate from contractor workmanship warranty.",
  ];

  terms.forEach((term) => {
    checkPageBreak(5);
    doc.text(term, margin, y);
    y += 4;
  });

  y += 6;

  // ============================================================
  // SIGNATURE LINES
  // ============================================================
  checkPageBreak(30);
  drawLine(y);
  y += 10;

  doc.setFontSize(8);
  doc.setTextColor(...darkColor);

  // Left signature
  doc.line(margin, y + 8, margin + 70, y + 8);
  doc.text("Contractor Signature", margin, y + 13);
  doc.text("Date: _______________", margin, y + 18);

  // Right signature
  doc.line(pageWidth - margin - 70, y + 8, pageWidth - margin, y + 8);
  doc.text("Homeowner Signature", pageWidth - margin - 70, y + 13);
  doc.text("Date: _______________", pageWidth - margin - 70, y + 18);

  // ============================================================
  // FOOTER
  // ============================================================
  const footerY = pageHeight - 10;
  doc.setFontSize(7);
  doc.setTextColor(...grayColor);
  doc.text("Generated by TradesBot - Roofing Material & Labor Estimator", pageWidth / 2, footerY, { align: "center" });

  // Save the PDF
  const filename = `Estimate_${(state.jobName || "Untitled").replace(/[^a-zA-Z0-9]/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(filename);
}
