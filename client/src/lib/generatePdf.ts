import { jsPDF } from "jspdf";
import type { EstimatorState } from "@/hooks/useEstimator";
import type { MaterialCostLine, LaborCostLine } from "@/lib/data";
import {
  SUPPLIERS,
  SHINGLE_TYPES,
  MARKET_CONFIGS,
  TARP_SYSTEM_CHARGE,
} from "@/lib/data";

interface PdfData {
  state: EstimatorState;
  materialCostLines: MaterialCostLine[];
  laborCostLines: LaborCostLine[];
  totalSquares: number;
  totalMaterialCost: number;
  totalLaborCost: number;
  tarpCharge: number;
  totalCustomCosts: number;
  estimateTotal: number;
  requiredCustomerPrice: number;
  targetMarginPct: number;
}

function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function generateEstimatePdf(data: PdfData): void {
  const {
    state,
    materialCostLines,
    laborCostLines,
    totalSquares,
    totalMaterialCost,
    totalLaborCost,
    tarpCharge,
    totalCustomCosts,
    estimateTotal,
    requiredCustomerPrice,
    targetMarginPct,
  } = data;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const primaryColor: [number, number, number] = [0, 212, 170];
  const darkColor: [number, number, number] = [240, 234, 214];
  const grayColor: [number, number, number] = [120, 113, 108];
  const bgColor: [number, number, number] = [13, 13, 13];
  const cardColor: [number, number, number] = [26, 26, 26];
  const greenColor: [number, number, number] = [34, 197, 94];

  // Dark background
  doc.setFillColor(...bgColor);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  function checkPageBreak(needed: number) {
    if (y + needed > pageHeight - 25) {
      doc.addPage();
      doc.setFillColor(...bgColor);
      doc.rect(0, 0, pageWidth, pageHeight, "F");
      y = margin;
    }
  }

  function drawLine(yPos: number) {
    doc.setDrawColor(42, 42, 42);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
  }

  // Header
  doc.setFillColor(26, 26, 26);
  doc.rect(0, 0, pageWidth, 32, "F");
  doc.setTextColor(...primaryColor);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Shingles.ai", margin, 14);
  doc.setTextColor(...grayColor);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Roofing Material and Labor Estimate", margin, 20);
  doc.setTextColor(...darkColor);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Trusted Roofing LLC", pageWidth - margin, 12, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const supplierName = SUPPLIERS.find((s) => s.id === state.supplier)?.name || state.supplier;
  const marketName = MARKET_CONFIGS.find((m) => m.id === state.market)?.name || "St. Louis, MO";
  doc.setTextColor(...grayColor);
  doc.text("Supplier: " + supplierName, pageWidth - margin, 18, { align: "right" });
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  doc.text("Date: " + today, pageWidth - margin, 24, { align: "right" });

  y = 40;

  // Date bar
  doc.setFillColor(...cardColor);
  doc.rect(margin, y, contentWidth, 8, "F");
  doc.setTextColor(...darkColor);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("ESTIMATE", margin + 3, y + 5.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);
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
  const m = state.measurements;
  const jobLines = [
    "Job: " + (state.jobName || "-"),
    "Shingle: " + shingleName,
    "Market: " + marketName,
    "Roof Squares: " + totalSquares,
    "Pitch: " + m.pitch + "/12",
    "Waste Factor: " + state.wasteFactor + "%",
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
  doc.text("Total: " + fmt(totalMaterialCost), pageWidth - margin, y, { align: "right" });
  y += 6;

  doc.setFillColor(...cardColor);
  doc.rect(margin, y - 3.5, contentWidth, 6, "F");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...grayColor);
  doc.text("ITEM", margin + 2, y);
  doc.text("UNIT", margin + 85, y);
  doc.text("QTY", margin + 105, y);
  doc.text("PRICE", margin + 120, y);
  doc.text("TOTAL", pageWidth - margin - 3, y, { align: "right" });
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const activeMaterials = materialCostLines.filter(l => l.qty > 0);
  activeMaterials.forEach((line, idx) => {
    checkPageBreak(6);
    if (idx % 2 === 0) {
      doc.setFillColor(20, 20, 20);
      doc.rect(margin, y - 3.5, contentWidth, 5, "F");
    }
    doc.setTextColor(...darkColor);
    doc.text(line.name.slice(0, 40), margin + 2, y);
    doc.setTextColor(...grayColor);
    doc.text(line.unit, margin + 85, y);
    doc.text(String(line.qty), margin + 105, y);
    doc.text(fmt(line.unitPrice), margin + 120, y);
    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "bold");
    doc.text(fmt(line.total), pageWidth - margin - 3, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    y += 5;
  });

  if (activeMaterials.length === 0) {
    doc.setTextColor(...grayColor);
    doc.text("No materials calculated", margin + 2, y);
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
  doc.text("Total: " + fmt(totalLaborCost), pageWidth - margin, y, { align: "right" });
  y += 6;

  const activeLabor = laborCostLines.filter(l => l.qty > 0);
  activeLabor.forEach((line, idx) => {
    checkPageBreak(6);
    if (idx === 0) {
      doc.setFillColor(...cardColor);
      doc.rect(margin, y - 3.5, contentWidth, 6, "F");
    }
    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "normal");
    const desc = line.name + " (" + line.qty + " " + line.unit + " x $" + line.rate + ")";
    doc.text(desc.slice(0, 55), margin + 2, y);
    doc.setFont("helvetica", "bold");
    doc.text(fmt(line.total), pageWidth - margin - 3, y, { align: "right" });
    y += 5;
  });

  if (activeLabor.length === 0) {
    doc.setTextColor(...grayColor);
    doc.text("No labor calculated", margin + 2, y);
    y += 5;
  }

  y += 4;
  drawLine(y);
  y += 6;

  // Additional Costs Section
  checkPageBreak(25);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("ADDITIONAL COSTS", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);
  doc.setFontSize(8);
  doc.text("Total: " + fmt(totalCustomCosts), pageWidth - margin, y, { align: "right" });
  y += 6;

  // Tarp system charge
  checkPageBreak(6);
  doc.setTextColor(...darkColor);
  doc.text("Tarp System Charge (fixed per job)", margin + 2, y);
  doc.setFont("helvetica", "bold");
  doc.text(fmt(TARP_SYSTEM_CHARGE), pageWidth - margin - 3, y, { align: "right" });
  doc.setFont("helvetica", "normal");
  y += 5;

  // Delivery
  if (state.deliveryEnabled && state.deliveryCost > 0) {
    checkPageBreak(6);
    doc.setTextColor(...darkColor);
    doc.text("Material Delivery", margin + 2, y);
    doc.setFont("helvetica", "bold");
    doc.text(fmt(state.deliveryCost), pageWidth - margin - 3, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    y += 5;
  }

  // Free-form additional cost items
  const additionalCosts = state.additionalCosts || [];
  for (const item of additionalCosts) {
    if (!item.description && !item.amount) continue;
    checkPageBreak(6);
    doc.setTextColor(...darkColor);
    doc.text(item.description || "Custom item", margin + 2, y);
    doc.setFont("helvetica", "bold");
    doc.text(fmt(item.amount || 0), pageWidth - margin - 3, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    y += 5;
  }

  y += 4;
  drawLine(y);
  y += 6;

  // Totals
  checkPageBreak(50);
  doc.setFillColor(...cardColor);
  doc.rect(pageWidth / 2, y - 2, pageWidth / 2 - margin, 42, "F");
  const totalsX = pageWidth / 2 + 5;
  const totalsValX = pageWidth - margin - 3;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);

  doc.text("Materials Total", totalsX, y + 3);
  doc.setTextColor(...darkColor);
  doc.text(fmt(totalMaterialCost), totalsValX, y + 3, { align: "right" });

  doc.setTextColor(...grayColor);
  doc.text("Labor Total", totalsX, y + 9);
  doc.setTextColor(...darkColor);
  doc.text(fmt(totalLaborCost), totalsValX, y + 9, { align: "right" });

  doc.setTextColor(...grayColor);
  doc.text("Additional Costs", totalsX, y + 15);
  doc.setTextColor(...darkColor);
  doc.text(fmt(totalCustomCosts), totalsValX, y + 15, { align: "right" });

  drawLine(y + 20);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("ESTIMATE TOTAL", totalsX, y + 28);
  doc.text(fmt(estimateTotal), totalsValX, y + 28, { align: "right" });

  // Margin info
  if (targetMarginPct > 0 && requiredCustomerPrice > 0) {
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayColor);
    doc.text("At " + targetMarginPct + "% margin, charge:", totalsX, y + 35);
    doc.setTextColor(...greenColor);
    doc.setFont("helvetica", "bold");
    doc.text(fmt(requiredCustomerPrice), totalsValX, y + 35, { align: "right" });
  }

  y += 50;

  // Footer
  checkPageBreak(15);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);
  doc.text("Generated by Shingles.ai. All prices are estimates and subject to change.", margin, pageHeight - 10);

  // Save
  const fileName = (state.jobName || "estimate").replace(/[^a-zA-Z0-9]/g, "_") + "_" + new Date().toISOString().slice(0, 10) + ".pdf";
  doc.save(fileName);
}
