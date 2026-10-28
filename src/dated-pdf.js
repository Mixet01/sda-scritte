import { createLabelPdf } from './pdf.js';
import { romeDate } from './date.js';

(async () => {
try {
  const date = romeDate();
  const bytes = await createLabelPdf('HW REVERSE ZALANDO', { date });
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
