import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {destinations} from '../src/destinations.js';
import {createLabelPdf} from '../src/pdf.js';
await mkdir(new URL('../public/pdf/',import.meta.url),{recursive:true});
const fontBytes=await readFile(new URL('../public/fonts/Anton-Regular.ttf',import.meta.url));
for(const item of destinations){await writeFile(new URL(`../public${item.pdf_path}`,import.meta.url),await createLabelPdf(item.label,fontBytes));}
console.log(`Generati ${destinations.length} PDF A4, due copie per foglio.`);
