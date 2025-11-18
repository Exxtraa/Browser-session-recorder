import { SessionEvent } from "@/types/events";

export async function generatePDFReport(
  title: string,
  events: SessionEvent[]
) {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({
    unit: "pt",
    format: "a4",
  });

  doc.setFontSize(22);
  doc.text(title, 40, 60);
  doc.setFontSize(12);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 90);

  doc.addPage();
  let y = 40;

  for (const ev of events) {
    doc.setFontSize(12);

    doc.text(
      `${new Date(ev.timestamp).toLocaleString()} — ${ev.type}`,
      40,
      y
    );
    y += 14;

    doc.text(ev.description, 40, y);
    y += 14;

    if ("value" in ev && ev.value) {
      doc.text(`Value: ${ev.value}`, 40, y);
      y += 14;
    }

    if (ev.screenshot) {
      try {
        const img = ev.screenshot;
        const imgProps = (doc as any).getImageProperties(img);
        const pageWidth = doc.internal.pageSize.getWidth() - 80;
        const ratio = pageWidth / imgProps.width;
        const height = imgProps.height * ratio;

        doc.addImage(img, "JPEG", 40, y, pageWidth, height);
        y += height + 20;
      } catch {
        doc.text("[Image failed]", 40, y);
        y += 14;
      }
    }

    if (y > 750) {
      doc.addPage();
      y = 40;
    }
  }

  doc.save("session_report.pdf");
}
