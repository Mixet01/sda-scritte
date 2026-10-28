import { PDFDocument, StandardFonts, degrees, rgb } from 'pdf-lib';

// Lay out the two labels side by side in landscape, then physically rotate
// their content onto an upright A4 sheet. The final page has no /Rotate flag.
export async function createZalandoPdf({ date, logoBytes }) {
  const landscape = await PDFDocument.create();
  const width = 841.8898, height = 595.2756, panel = width / 2;
  const page = landscape.addPage([width, height]);
  const regular = await landscape.embedFont(StandardFonts.Helvetica);
  const bold = await landscape.embedFont(StandardFonts.HelveticaBold);
  const logo = await landscape.embedPng(logoBytes);
  const black = rgb(0, 0, 0);

  for (const left of [0, panel]) {
    const centerText = (text, y, size, font = regular, underline = false) => {
      const textWidth = font.widthOfTextAtSize(text, size);
      const x = left + (panel - textWidth) / 2;
      page.drawText(text, { x, y, size, font, color: black });
      if (underline) page.drawLine({ start: { x: x - 3, y: y - 7 }, end: { x: x + textWidth + 3, y: y - 7 }, thickness: 2, color: black });
    };
    const logoWidth = panel - 62;
    page.drawImage(logo, { x: left + 31, y: 498, width: logoWidth, height: logoWidth * logo.height / logo.width });
    centerText('REVERSE', 425, 54);
    page.drawText('da:   Potenza', { x: left + 34, y: 365, size: 22, font: regular, color: black });
    page.drawText('destino:', { x: left + 27, y: 300, size: 29, font: regular, color: black });
    centerText('HUB PIACENZA', 225, 42, bold, true);
    centerText('(ZA)', 165, 45, bold, true);
    centerText(date, 62, 40);
  }
  page.drawLine({ start: { x: panel, y: 20 }, end: { x: panel, y: height - 20 }, color: rgb(.75, .75, .75), thickness: .4, dashArray: [4, 4] });

  const output = await PDFDocument.create();
  output.setTitle(`HW REVERSE ZALANDO ${date}`);
  output.setAuthor('SDA Scritte');
  const [embedded] = await output.embedPdf(await landscape.save());
  const portrait = output.addPage([height, width]);
  portrait.drawPage(embedded, { x: height, y: 0, width, height, rotate: degrees(90) });
  return output.save();
}
