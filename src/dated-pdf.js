import { createZalandoPdf } from './zalando-pdf.js';
import { romeDate } from './date.js';

(async () => {
try {
  const logoResponse = await fetch('/zalando-logo.png');
  if (!logoResponse.ok) throw new Error('Logo non disponibile.');
  const logoBytes = await logoResponse.arrayBuffer();
  const date = romeDate();
  const bytes = await createZalandoPdf({ date, logoBytes });
  document.title = `HW REVERSE ZALANDO ${date}`;
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.textContent = `Apri PDF del ${date}`;
  document.querySelector('#status').replaceChildren(link);
  location.replace(url);
} catch {
  document.querySelector('#status').textContent = 'Non riesco a preparare il PDF. Controlla la connessione e riprova.';
  document.querySelector('#retry').hidden = false;
}

})();
