import { jsPDF } from "jspdf";
import type { EstimatorState } from "@/hooks/useEstimator";
import {
  MATERIAL_ITEMS,
  LABOR_ITEMS,
  SUPPLIERS,
  SHINGLE_TYPES,
  STEEP_PITCH_TIERS,
  BASE_LABOR_RATE,
} from "@/lib/data";

interface PdfData {
  state: EstimatorState;
  shingleSquares: number;
  laborSquares: number;
  totalMaterialCost: number;
  totalLaborCost: number;
  totalCustomCosts: number;
  estimateTotal: number;
}

export function generateEstimatePdf(data: PdfData): void {
  const { state, shingleSquares, laborSquares, totalMaterialCost, totalLaborCost, totalCustomCosts, estimateTotal } = data;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const primaryColor: [number, number, number] = [37, 99, 235];
  const darkColor: [number, number, number] = [30, 41, 59];
  const grayColor: [number, number, number] = [100, 116, 139];
  const lightBg: [number, number, number] = [241, 245, 249];

  function checkPageBreak(needed: number) {
    if (y + needed > pageHeight - 25) {
      doc.addPage();
      y = margin;
    }
  }

  function drawLine(yPos: number) {
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
  }

  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 32, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("TradesBot", margin, 14);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Roofing Material and Labor Estimate", margin, 20);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Trusted Roofing LLC", pageWidth - margin, 12, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const supplierName = SUPPLIERS.find((s) => s.id === state.supplier)?.name || state.supplier;
  doc.text("Supplier: " + supplierName, pageWidth - margin, 18, { align: "right" });
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  doc.text("Date: " + today, pageWidth - margin, 24, { align: "right" });

  y = 40;

  // Date bar
  doc.setFillColor(...lightBg);
  doc.rect(margin, y, contentWidth, 8, "F");
  doc.setTextColor(...darkColor);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("ESTIMATE", margin + 3, y + 5.5);
  doc.setFont("helvetica", "normal");
  doc.text(today, pageWidth - margin - 3, y + 5.5, { align: "right" });
  y += 14;

  // Customer and Job Info
  const colWidth = contentWidth / 2 - 3;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("CUSTOMER INFORMATION", margin, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkColor);
  const customerLines = [
    state.customerName || "-",
    state.address || "-",
    state.customerPhone || "-",
    state.customerEmail || "-",
  ];
  customerLines.forEach((line) => { doc.text(line, margin, y); y += 4.5; });

  let rightY = y - customerLines.length * 4.5 - 5;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("JOB DETAILS", margin + colWidth + 6, rightY);
  rightY += 5;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkColor);
  const shingleName = SHINGLE_TYPES.find((s) => s.id === state.shingleType)?.name || state.shingleType;
  const jobLines = [
    "Job: " + (state.jobName || "-"),
    "Shingle: " + shingleName,
    "Shingle Squares: " + shingleSquares.toFixed(1) + " sq",
    "Labor Squares: " + laborSquares.toFixed(1) + " sq",
  ];
  jobLines.forEach((line) => { doc.text(line, margin + colWidth + 6, rightY); rightY += 4.5; });

  y += 4;
  drawLine(y);
  y += 6;

  // Materials Table
  checkPageBreak(30);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("MATERIALS", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);
  doc.setFontSize(8);
  doc.text("Total: $" + totalMaterialCost.toFixed(2), pageWidth - margin, y, { align: "right" });
  y += 6;

  doc.setFillColor(...lightBg);
  doc.rect(margin, y - 3.5, contentWidth, 6, "F");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...grayColor);
  doc.text("#", margin + 2, y);
  doc.text("ITEM", margin + 10, y);
  doc.text("UNIT", margin + 85, y);
  doc.text("QTY", margin + 105, y);
  doc.text("PRICE", margin + 120, y);
  doc.text("TOTAL", pageWidth - margin - 3, y, { align: "right" });
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const activeMaterials = MATERIAL_ITEMS.filter((item) => (state.materialQtys[item.id] || 0) > 0);
  activeMaterials.forEach((item, idx) => {
    checkPageBreak(6);
    const qty = state.materialQtys[item.id] || 0;
    const lineTotal = qty * item.unitPrice;
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y - 3.5, contentWidth, 5, "F");
    }
    doc.setTextColor(...grayColor);
    doc.text(String(item.lineNumber), margin + 2, y);
    doc.setTextColor(...darkColor);
    doc.text(item.name, margin + 10, y);
    doc.setTextColor(...grayColor);
    doc.text(item.unit, margin + 85, y);
    doc.text(String(qty), margin + 105, y);
    doc.text("$" + item.unitPrice.toFixed(2), margin + 120, y);
    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "bold");
    doc.text("$" + lineTotal.toFixed(2), pageWidth - margin - 3, y, { align: "right" });
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

  // Labor Table
  checkPageBreak(30);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("LABOR", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);
  doc.setFontSize(8);
  doc.text("Total: $" + totalLaborCost.toFixed(2), pageWidth - margin, y, { align: "right" });
  y += 6;

  // Base labor
  checkPageBreak(10);
  doc.setFillColor(...lightBg);
  doc.rect(margin, y - 3.5, contentWidth, 6, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...darkColor);
  const baseCost = state.laborCosts["base-labor"] || BASE_LABOR_RATE;
  const baseTotal = laborSquares * baseCost;
  doc.text("Base Labor (" + laborSquares.toFixed(1) + " sq x $" + baseCost.toFixed(0) + "/sq)", margin + 2, y);
  doc.text("$" + baseTotal.toFixed(2), pageWidth - margin - 3, y, { align: "right" });
  y += 6;

  // Steep pitch
  let steepTotal = 0;
  for (const tier of STEEP_PITCH_TIERS) {
    const sq = state.steepPitchSquares[tier.id] || 0;
    if (sq > 0) {
      checkPageBreak(6);
      const tierTotal = sq * tier.adderPerSquare;
      steepTotal += tierTotal;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...darkColor);
      doc.text("  " + tier.label + " (" + sq + " sq x $" + tier.adderPerSquare + "/sq)", margin + 2, y);
      doc.setFont("helvetica", "bold");
      doc.text("$" + tierTotal.toFixed(2), pageWidth - margin - 3, y, { align: "right" });
      y += 5;
    }
  }

  // Additional labor items
  doc.setFont("helvetica", "normal");
  const nonBaseItems = LABOR_ITEMS.filter((item) => !item.isBaseLabor);
  for (const item of nonBaseItems) {
    const qty = state.laborQtys[item.id] || 0;
    if (qty <= 0) continue;
    checkPageBreak(6);
    const cost = state.laborCosts[item.id] || item.defaultCostPerUnit;
    const lineTotal = qty * cost;
    doc.setTextColor(...darkColor);
    doc.text(item.name + " (" + qty + " x $" + cost.toFixed(0) + ")", margin + 2, y);
    doc.setFont("helvetica", "bold");
    doc.text("$" + lineTotal.toFixed(2), pageWidth - margin - 3, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    y += 5;
  }

  y += 4;
  drawLine(y);
  y += 6;

  // Delivery
  if (state.deliveryEnabled && state.deliveryCost > 0) {
    checkPageBreak(15);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("DELIVERY", margin, y);
    y += 6;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkColor);
    doc.text("Material Delivery", margin + 2, y);
    doc.setFont("helvetica", "bold");
    doc.text("$" + state.deliveryCost.toFixed(2), pageWidth - margin - 3, y, { align: "right" });
    y += 5;
    y += 4;
    drawLine(y);
    y += 6;
  }

  // Totals
  checkPageBreak(35);
  doc.setFillColor(...lightBg);
  doc.rect(pageWidth / 2, y - 2, pageWidth / 2 - margin, 30, "F");
  const totalsX = pageWidth / 2 + 5;
  const totalsValX = pageWidth - margin - 3;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);

  doc.text("Materials Total", totalsX, y + 3);
  doc.setTextColor(...darkColor);
  doc.text("$" + totalMaterialCost.toFixed(2), totalsValX, y + 3, { align: "right" });

  doc.setTextColor(...grayColor);
  doc.text("Labor Total", totalsX, y + 9);
  doc.setTextColor(...darkColor);
  doc.text("$" + totalLaborCost.toFixed(2), totalsValX, y + 9, { align: "right" });

  doc.setTextColor(...grayColor);
  doc.text("Delivery / Other", totalsX, y + 15);
  doc.setTextColor(...darkColor);
  doc.text("$" + totalCustomCosts.toFixed(2), totalsValX, y + 15, { align: "right" });

  drawLine(y + 20);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("ESTIMATE TOTAL", totalsX, y + 26);
  doc.text("$" + estimateTotal.toFixed(2), totalsValX, y + 26, { align: "right" });

  y += 38;

  // Footer
  checkPageBreak(15);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);
  doc.text("Generated by TradesBot. Trusted Roofing LLC. All prices are estimates and subject to change.", margin, pageHeight - 10);

  // Save
  const fileName = (state.jobName || "estimate").replace(/[^a-zA-Z0-9]/g, "_") + "_" + new Date().toISOString().slice(0, 10) + ".pdf";
  doc.save(fileName);
}
