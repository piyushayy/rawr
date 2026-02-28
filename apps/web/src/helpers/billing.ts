import { jsPDF } from "jspdf";
import "jspdf-autotable";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateInvoice = (order: any) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("RAWR STORE", 20, 20);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("INVOICE / RECEIPT", 20, 30);
  doc.text(`Order #${order.id.slice(0, 8)}`, 20, 36);
  doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 20, 42);

  // Customer Info
  doc.text(`Bill To:`, 140, 30);
  // Assuming we have profile data attached
  if (order.profiles?.full_name) {
    doc.text(order.profiles.full_name, 140, 36);
  }
  if (order.profiles?.email) {
    doc.text(order.profiles.email, 140, 42);
  }

  // Line Divider
  doc.setLineWidth(0.5);
  doc.line(20, 50, 190, 50);

  // Items
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items = order.order_items.map((item: any) => [
    item.products?.title || "Unknown Item",
    "$" + item.price?.toFixed(2),
    "1", // Quantity default 1 for now
    "$" + item.price?.toFixed(2),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (doc as any).autoTable({
    startY: 60,
    head: [["Item", "Price", "Qty", "Total"]],
    body: items,
    theme: "plain",
    headStyles: { fontStyle: "bold", fillColor: [240, 240, 240] },
  });

  // Totals
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = (doc as any).lastAutoTable.finalY + 10;

  doc.text(`Total Paid: $${order.total?.toFixed(2)}`, 140, finalY);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Thank you for shopping with RAWR.", 20, finalY + 20);

  doc.save(`RAWR_Invoice_${order.id.slice(0, 8)}.pdf`);
};
