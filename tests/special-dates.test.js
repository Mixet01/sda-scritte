import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PDFDocument} from 'pdf-lib';
import {createBanksPdf,createPostePdf} from '../src/special-pdfs.js';
import {dailyPdfPages} from '../src/destinations.js';
test('Banche e Poste vengono generati nuovamente con date diverse',async()=>{
 const data=JSON.parse(await readFile(new URL('../data/foglio-banche.json',import.meta.url),'utf8'));
 for(const date of ['30/10/2026','31/10/2026']){
  const banks=await PDFDocument.load(await createBanksPdf(data,{date}));
  const poste=await PDFDocument.load(await createPostePdf({date}));
  assert.equal(banks.getPageCount(),4);
  assert.equal(banks.getTitle(),`Foglio banche ${date}`);
  assert.equal(poste.getPageCount(),1);
  assert.equal(poste.getTitle(),`Poste prodotto lento ${date}`);
 }
 assert.equal(dailyPdfPages['foglio-banche'],'/print-banche.html');
 assert.equal(dailyPdfPages['poste-prodotto-lento'],'/print-poste-lento.html');
});
