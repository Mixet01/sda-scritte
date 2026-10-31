import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PDFDocument} from 'pdf-lib';
import {createBanksPdf,createPostePdf} from '../src/special-pdfs.js';
import {dailyPdfPages,specialPdfPages} from '../src/destinations.js';

test('Banche e Poste si aprono senza data automatica; Zalando resta giornaliero',async()=>{
 const data=JSON.parse(await readFile(new URL('../data/foglio-banche.json',import.meta.url),'utf8'));
 const banks=await PDFDocument.load(await createBanksPdf(data));
 const poste=await PDFDocument.load(await createPostePdf());
 assert.equal(banks.getPageCount(),4);
 assert.equal(banks.getTitle(),'Foglio banche');
 assert.equal(poste.getPageCount(),1);
 assert.equal(poste.getTitle(),'Poste prodotto lento');
 assert.deepEqual(Object.keys(dailyPdfPages),['hw-reverse-zalando']);
 assert.equal(specialPdfPages['foglio-banche'],'/print-banche.html');
 assert.equal(specialPdfPages['poste-prodotto-lento'],'/print-poste-lento.html');
 const entry=await readFile(new URL('../src/special-dated-pdf.js',import.meta.url),'utf8');
 assert.ok(!entry.includes('romeDate')&&!entry.includes('{date}'));
});
