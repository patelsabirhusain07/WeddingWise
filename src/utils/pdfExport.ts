import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { WeddingParameters, ExpenseItem, WeddingEvent } from '../types/wedding';
import { CATEGORY_LABELS } from './budgetCalculations';

export function generateWeddingReportPDF(
  params: WeddingParameters,
  expenses: ExpenseItem[],
  events: WeddingEvent[]
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const currency = params.currency || 'Rs.';
  const totalBudget = params.totalBudget;
  const totalEstimated = expenses.reduce((sum, item) => sum + item.estimatedCost, 0);
  const totalActual = expenses.reduce((sum, item) => sum + item.actualCost, 0);
  const totalAdvance = expenses.reduce((sum, item) => sum + item.advancePaid, 0);
  const totalPending = totalActual - totalAdvance;
  const remainingBudget = totalBudget - totalActual;

  // Header Banner
  doc.setFillColor(225, 29, 72); // Rose 600
  doc.rect(0, 0, 595, 80, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('WeddingWise', 40, 42);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Complete Wedding Budget & Financial Plan', 40, 62);

  // Date and Meta
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 420, 42);
  doc.text(`Wedding Date: ${params.weddingDate}`, 420, 62);

  // Couple Summary Card
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`${params.coupleName}'s Wedding Overview`, 40, 115);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Destination / City: ${params.city}  |  Guests: ${params.guestCount}  |  Duration: ${params.totalDays} Days`, 40, 132);

  // Financial Highlights Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(40, 145, 515, 65, 6, 6, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(40, 145, 515, 65, 6, 6, 'D');

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('TOTAL BUDGET', 55, 168);
  doc.text('ACTUAL COMMITTED', 180, 168);
  doc.text('ADVANCE PAID', 315, 168);
  doc.text('PENDING BALANCE', 435, 168);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${currency} ${totalBudget.toLocaleString()}`, 55, 192);

  doc.setTextColor(totalActual > totalBudget ? 225 : 15, totalActual > totalBudget ? 29 : 23, totalActual > totalBudget ? 72 : 42);
  doc.text(`${currency} ${totalActual.toLocaleString()}`, 180, 192);

  doc.setTextColor(16, 185, 129); // emerald
  doc.text(`${currency} ${totalAdvance.toLocaleString()}`, 315, 192);

  doc.setTextColor(217, 119, 6); // amber
  doc.text(`${currency} ${totalPending.toLocaleString()}`, 435, 192);

  // Table of Expenses
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Expense Breakdown & Payment Tracker', 40, 240);

  const tableRows = expenses.map((item) => {
    const categoryName = CATEGORY_LABELS[item.category]?.name || item.category;
    const pending = item.actualCost - item.advancePaid;
    return [
      item.title,
      categoryName,
      item.vendorName || 'Not Assigned',
      `${currency} ${item.estimatedCost.toLocaleString()}`,
      `${currency} ${item.actualCost.toLocaleString()}`,
      `${currency} ${item.advancePaid.toLocaleString()}`,
      `${currency} ${pending.toLocaleString()}`,
      item.status.replace('_', ' ').toUpperCase(),
    ];
  });

  autoTable(doc, {
    startY: 250,
    head: [['Item Description', 'Category', 'Vendor', 'Estimated', 'Actual', 'Advance', 'Pending', 'Status']],
    body: tableRows,
    theme: 'striped',
    headStyles: {
      fillColor: [225, 29, 72],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [51, 65, 85],
    },
    alternateRowStyles: {
      fillColor: [253, 242, 248],
    },
    margin: { left: 40, right: 40 },
    columnStyles: {
      0: { cellWidth: 110 },
      1: { cellWidth: 70 },
      2: { cellWidth: 70 },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'right' },
      7: { halign: 'center' },
    },
  });

  // Event Itinerary Summary
  const lastY = (doc as any).lastAutoTable.finalY || 450;
  let nextSectionY = lastY + 30;

  if (nextSectionY > 700) {
    doc.addPage();
    nextSectionY = 50;
  }

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Scheduled Wedding Events & Budgets', 40, nextSectionY);

  const eventRows = events.map((evt) => [
    `Day ${evt.dayNumber}: ${evt.title}`,
    `${evt.date} (${evt.time})`,
    evt.venue,
    `${evt.guestCount} Guests`,
    `${currency} ${evt.estimatedBudget.toLocaleString()}`,
  ]);

  autoTable(doc, {
    startY: nextSectionY + 10,
    head: [['Event Title', 'Date & Time', 'Venue', 'Guests', 'Budget']],
    body: eventRows,
    theme: 'grid',
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [51, 65, 85],
    },
    margin: { left: 40, right: 40 },
  });

  // Footer on all pages
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `WeddingWise Planner - Crafted with love for ${params.coupleName}  |  Page ${i} of ${pageCount}`,
      40,
      820
    );
  }

  // Save the PDF
  const filename = `${params.coupleName.replace(/[^a-zA-Z0-9]/g, '_')}_Wedding_Financial_Plan.pdf`;
  doc.save(filename);
}
