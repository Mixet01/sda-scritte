import test from 'node:test';
import assert from 'node:assert/strict';
import { PDFDocument } from 'pdf-lib';
import { readFile } from 'node:fs/promises';
import { romeDate } from '../src/date.js';
import { createZalandoPdf } from '../src/zalando-pdf.js';
test('La data segue la mezzanotte italiana, anche con ora legale',()=>{
  assert.equal(romeDate(new Date('2026-10-26T22:59:59Z')),'26/10/2026');
  assert.equal(romeDate(new Date('2026-10-26T23:00:00Z')),'27/10/2026');
  assert.equal(romeDate(new Date('2026-07-15T22:00:00Z')),'16/07/2026');
});
test('Ogni apertura genera il PDF con la data richiesta, senza una data fissata nella build',async()=>{
  const logoBytes=await readFile(new URL('../public/zalando-logo.png',import.meta.url));
  for(const date of ['27/10/2026','28/10/2026']){
    const pdf=await PDFDocument.load(await createZalandoPdf({date,logoBytes}));
    assert.equal(pdf.getPageCount(),1);
    assert.equal(pdf.getTitle(),`HW REVERSE ZALANDO ${date}`);
    const page=pdf.getPage(0);
    assert.ok(Math.abs(page.getWidth()-595.2756)<.01);
    assert.ok(Math.abs(page.getHeight()-841.8898)<.01);
    assert.equal(page.getRotation().angle,0);
  }
});
