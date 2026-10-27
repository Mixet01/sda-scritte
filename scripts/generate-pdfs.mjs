import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {destinations} from '../src/destinations.js';
import {createLabelPdf} from '../src/pdf.js';
await mkdir(new URL('../public/pdf/',import.meta.url),{recursive:true});
const fontBytes=await readFile(new URL('../public/fonts/Anton-Regular.ttf',import.meta.url));
for(const item of destinations.filter(i=>i.pdf_path.endsWith('.pdf'))){await writeFile(new URL(`../public${item.pdf_path}`,import.meta.url),await createLabelPdf(item.label,fontBytes));}
console.log('PDF statici generati; HW REVERSE ZALANDO viene generato ogni volta con la data italiana corrente.');
