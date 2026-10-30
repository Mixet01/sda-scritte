import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PDFDocument} from 'pdf-lib';
import {destinations} from '../src/destinations.js';
test('Ogni destinazione ha un PDF A4 distinto di una pagina',async()=>{
 assert.equal(destinations.length,26);
 assert.equal(new Set(destinations.map(i=>i.pdf_path)).size,26);
 for(const item of destinations.filter(i=>i.pdf_path.endsWith('.pdf'))){
  const pdf=await PDFDocument.load(await readFile(new URL(`../public${item.pdf_path}`,import.meta.url)));
  assert.equal(pdf.getPageCount(),item.id==='foglio-banche'?4:1);
  const {width,height}=pdf.getPage(0).getSize();
  assert.ok(Math.abs(width-595.2756)<.01);
  assert.ok(Math.abs(height-841.8898)<.01);
 }
});
test('Le diciture corrispondono alle 26 scritte richieste',()=>{
 assert.deepEqual(destinations.map(i=>i.label),['COSENZA','CATANZARO','REGGIO CALABRIA','HB2 FLY','HB2 COY','HP3 FLY','HP3 COY','HM4 FLY','HM4 COY','HQ2 FLY','HQ2 COY','HR2 FLY','HR2 COY','POSTE PRODOTTO LENTO','HB AMAZON REVERSE','HB REVERSE YOOX','HP REV','UCA SALERNO','MY DA POTENZA','HM EURODIS','HP3 TO EURODIS','HW REVERSE ZALANDO','FOGLIO BANCHE','HR DA TRABALZARE','PRODOTTO LENTO','POTENZA X ROMA1 BANCHE']);
});

test('Internazionale contiene le tre destinazioni richieste',()=>{
 assert.deepEqual(destinations.filter(i=>i.hub==='Internazionale').map(i=>i.label),['MY DA POTENZA','HM EURODIS','HP3 TO EURODIS']);
});

test('Banche contiene Foglio banche e Altre usa il modulo Poste',()=>{assert.equal(destinations.find(i=>i.id==='foglio-banche').hub,'Banche');assert.equal(destinations.find(i=>i.id==='poste-prodotto-lento').hub,'Altre');assert.equal(destinations.find(i=>i.id==='prodotto-lento').hub,'Altre');});
