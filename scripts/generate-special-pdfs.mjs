import { readFile, writeFile } from 'node:fs/promises';
import {createBanksPdf,createPostePdf} from '../src/special-pdfs.js';
const banks=JSON.parse(await readFile(new URL('../data/foglio-banche.json',import.meta.url),'utf8'));
await writeFile(new URL('../public/pdf/foglio-banche.pdf',import.meta.url),await createBanksPdf(banks));
await writeFile(new URL('../public/pdf/poste-prodotto-lento.pdf',import.meta.url),await createPostePdf());
