import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export function cleanLabel(value) {
  return value.trim().replace(/\s+/g, ' ').toUpperCase();
}

export async function createLabelPdf(label) {
  const text = cleanLabel(label);
  if (!text || text.length > 80) throw new Error('Inserisci una scritta da 1 a 80 caratteri.');
  const pdf = await PDFDocument.create();
  pdf.setTitle(text); pdf.setAuthor('SDA Scritte');
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  try { font.encodeText(text); } catch { throw new Error('Usa lettere latine, numeri e simboli comuni per la scritta.'); }
  const width = 595.2756, height = 841.8898;
  const page = pdf.addPage([width, height]);
  const words = text.split(' ');
  let lines = [text];
  if (font.widthOfTextAtSize(text, 90) > width - 56 && words.length > 1) {
    let best = Infinity;
    for (let i = 1; i < words.length; i++) {
      const candidate = [words.slice(0, i).join(' '), words.slice(i).join(' ')];
      const span = Math.max(...candidate.map(line => font.widthOfTextAtSize(line, 1)));
      if (span < best) { best = span; lines = candidate; }
    }
  }
  const size = Math.min(120, (width - 88) / Math.max(...lines.map(line => font.widthOfTextAtSize(line, 1))));
  const lineHeight = size * 1.12;
  for (const center of [height * .25, height * .75]) {
    lines.forEach((line, i) => page.drawText(line, {
      x: (width - font.widthOfTextAtSize(line, size)) / 2,
      y: center + ((lines.length - 1) / 2 - i) * lineHeight - size * .35,
      size, font, color: rgb(0, 0, 0),
    }));
  }
  page.drawLine({ start: { x: 18, y: height / 2 }, end: { x: width - 18, y: height / 2 }, thickness: .4, color: rgb(.7, .7, .7), dashArray: [4, 4] });
  return pdf.save();
}
