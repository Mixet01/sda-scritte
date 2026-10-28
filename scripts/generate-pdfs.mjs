import {mkdir,writeFile} from 'node:fs/promises';
import {destinations} from '../src/destinations.js';
import {createLabelPdf} from '../src/pdf.js';
await mkdir(new URL('../public/pdf/',import.meta.url),{recursive:true});
for(const item of destinations.filter(i=>i.pdf_path.endsWith('.pdf'))){await writeFile(new URL(`../public${item.pdf_path}`,import.meta.url),await createLabelPdf(item.label));}
console.log('PDF statici generati; HW REVERSE ZALANDO viene generato ogni volta con la data italiana corrente.');
