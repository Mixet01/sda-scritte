import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PDFDocument} from 'pdf-lib';
import {destinations} from '../src/destinations.js';
test('Ogni destinazione ha un PDF A4 distinto di una pagina',async()=>{
 assert.equal(destinations.length,18);
 assert.equal(new Set(destinations.map(i=>i.pdf_path)).size,18);
 for(const item of destinations){
  const pdf=await PDFDocument.load(await readFile(new URL(`../public${item.pdf_path}`,import.meta.url)));
  assert.equal(pdf.getPageCount(),1);
  const {width,height}=pdf.getPage(0).getSize();
  assert.ok(Math.abs(width-595.2756)<.01);
  assert.ok(Math.abs(height-841.8898)<.01);
 }
});
test('Le diciture corrispondono alle 18 scritte richieste',()=>{
 assert.deepEqual(destinations.map(i=>i.label),['COSENZA','CATANZARO','REGGIO CALABRIA','HB2 FLY','HB2 COY','HP3 FLY','HP3 COY','HM4 FLY','HM4 COY','HQ2 FLY','HQ2 COY','HR2 FLY','HR2 COY','PRODOTTO LENTO','HB AMAZON REVERSE','HB REVERSE YHOOX','HP REV','UCA SALERNO']);
});
