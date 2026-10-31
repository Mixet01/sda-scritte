import {createBanksPdf,createPostePdf} from './special-pdfs.js';
import banks from '../data/foglio-banche.json';

(async()=>{
 try{
  const isBanks=document.body.dataset.document==='banche';
  const name=isBanks?'Foglio banche':'Poste prodotto lento';
  const bytes=isBanks?await createBanksPdf(banks):await createPostePdf();
  document.title=name;
  const url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
  const link=document.createElement('a');link.href=url;link.textContent='Apri PDF';
  document.querySelector('#status').replaceChildren(link);
  location.replace(url);
 }catch{
  document.querySelector('#status').textContent='Non riesco a preparare il PDF. Controlla la connessione e riprova.';
  document.querySelector('#retry').hidden=false;
 }
})();
