import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export function cleanLabel(value) {
  return value.trim().replace(/\s+/g, ' ').toUpperCase();
}

export async function createLabelPdf(label, fontBytes) {
  const text = cleanLabel(label);
  if (!text || text.length > 80) throw new Error('Inserisci una scritta da 1 a 80 caratteri.');
  const pdf = await PDFDocument.create();
  pdf.setTitle(text); pdf.setAuthor('SDA Scritte');
  pdf.registerFontkit(fontkit);
  const font = await pdf.embedFont(fontBytes, { subset: true });
  try { font.encodeText(text); } catch { throw new Error('Usa lettere latine, numeri e simboli comuni per la scritta.'); }
  const width = 595.2756, height = 841.8898;
  const page = pdf.addPage([width, height]);
  const words = text.split(' ');
  let lines = [text];
  if (words.length > 1) {
    let best = Infinity;
    for (let i = 1; i < words.length; i++) {
      const candidate = [words.slice(0, i).join(' '), words.slice(i).join(' ')];
      const span = Math.max(...candidate.map(line => font.widthOfTextAtSize(line, 1)));
      if (span < best) { best = span; lines = candidate; }
    }
  }
  const size = Math.min(200, (width - 64) / Math.max(...lines.map(line => font.widthOfTextAtSize(line, 1))), (height / 2 - 78) / (lines.length * .98));
  const lineHeight = size * .98;
  for (const center of [height * .25, height * .75]) {
    lines.forEach((line, i) => page.drawText(line, {
      x: (width - font.widthOfTextAtSize(line, size)) / 2,
      y: center + ((lines.length - 1) / 2 - i) * lineHeight - size * .38,
      size, font, color: rgb(0, 0, 0),
    }));
  }
  page.drawLine({ start: { x: 18, y: height / 2 }, end: { x: width - 18, y: height / 2 }, thickness: .4, color: rgb(.7, .7, .7), dashArray: [4, 4] });
  return pdf.save();
}
