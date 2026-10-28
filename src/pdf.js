import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export function cleanLabel(value) {
  return value.trim().replace(/\s+/g, ' ').toUpperCase();
}

export async function createLabelPdf(label, { date = null } = {}) {
  const text = cleanLabel(label);
  if (!text || text.length > 80) throw new Error('Inserisci una scritta da 1 a 80 caratteri.');
  const pdf = await PDFDocument.create();
  pdf.setTitle(date ? `${text} ${date}` : text); pdf.setAuthor('SDA Scritte');
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  try { font.encodeText(text); } catch { throw new Error('Usa lettere latine, numeri e simboli comuni per la scritta.'); }
  const width = 595.2756, height = 841.8898;
  const page = pdf.addPage([width, height]);
  // Every part of a destination gets its own line, with a full-width bold font.
  const lines = text.split(' ');
  const capHeight = font.heightAtSize(1, { descender: false });
  const lineSpacing = 1.06;
  const size = Math.min(210, (width - 96) / Math.max(...lines.map(line => font.widthOfTextAtSize(line, 1))), (height / 2 - 72 - (date ? 70 : 0)) / ((lines.length - 1) * lineSpacing + capHeight));
  const lineHeight = size * lineSpacing;
  const blockHeight = (lines.length - 1) * lineHeight + size * capHeight;
  for (const center of [height * .25, height * .75]) {
    lines.forEach((line, i) => page.drawText(line, {
      x: (width - font.widthOfTextAtSize(line, size)) / 2,
      y: center + (date ? 32 : 0) + blockHeight / 2 - size * capHeight - i * lineHeight,
      size, font, color: rgb(0, 0, 0),
    }));
    if (date) page.drawText(date, { x: (width - font.widthOfTextAtSize(date, 40)) / 2, y: center - height / 4 + 36, size: 40, font, color: rgb(0, 0, 0) });
  }
  page.drawLine({ start: { x: 18, y: height / 2 }, end: { x: width - 18, y: height / 2 }, thickness: .4, color: rgb(.7, .7, .7), dashArray: [4, 4] });
  return pdf.save();
}
