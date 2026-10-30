import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseKey } from './config.js';
import { destinations, dailyPdfPages } from './destinations.js';
import './style.css';
import { romeDate } from './date.js';
const db=createClient(supabaseUrl,supabaseKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const groups=['HUB','Calabria','Reverse','Banche','Internazionale','Altre'];
let items=destinations,filter=null,signature='',syncing=false,displayDate=romeDate();
const app=document.querySelector('#app');
app.innerHTML=`<main class="shell"><header class="topbar"><button class="brand" id="home" aria-label="Schermata principale"><img class="brand-logo" src="/sda-poste-logo.svg" alt="SDA Poste Italiane"><h1>Scritte</h1></button><span class="live" role="status"><i></i> Live</span></header><nav class="filters" aria-label="Tipo di scritta">${groups.map(g=>`<button data-filter="${g}" class="filter" aria-pressed="false">${g}</button>`).join('')}</nav><div id="archive"></div></main>`;
function render(){
 document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b.dataset.filter===filter);b.setAttribute('aria-pressed',String(b.dataset.filter===filter));});
 if(!filter){document.querySelector('#archive').innerHTML=`<section class="home-screen" aria-label="Messaggio di Donato Langerame"><div class="home-message"><p class="message-main">«Passo dall’altra parte della barricata e vado a consegnarli, questi maledetti pacchi. Ma la mia pelle e il mio sudore restano qui dentro con voi: possa ogni goccia versata tra questi scaffali logorare le scatole di chi compra senza sapere la fatica che c'è dietro. Rispetto vero per chi mandava e continua a mandare avanti la baracca ogni giorno. Ero lì a spaccarmi la schiena con voi e non lo dimenticherò mai. Ci vediamo alle ribalte!»</p><p class="message-signature">DONATO LANGERAME</p><div class="message-contact"><p>PER QUALSIASI AGGIUNTA CONTATTATEMI AL MIO NUMERO</p><a href="tel:+393716167880">3716167880</a></div></div></section>`;return;}
 document.querySelector('#archive').innerHTML=groups.filter(g=>g===filter).map(g=>{
  const entries=items.filter(i=>i.hub===g);
  if(g==='HUB') entries.sort((a,b)=>a.label.split(' ')[0].localeCompare(b.label.split(' ')[0],'it',{numeric:true}) || (a.label.endsWith('FLY')?-1:1));
  return `<section class="group group-${g.toLowerCase()}" aria-label="${g}"><div class="group-heading"><h2><i></i>${g}</h2><span>${entries.length}</span><div></div></div><div class="destinations">${entries.map(i=>`<a class="destination" href="${escape(i.pdf_path)}" target="_blank" rel="noopener" aria-label="Apri PDF ${escape(i.label)}"><span>${escape(i.label)}${dailyPdfPages[i.id]?`<small class="daily-date">${romeDate()}</small>`:''}</span></a>`).join('')}</div>${!entries.length?'<p class="empty-category">Nessuna scritta presente.</p>':''}</section>`;
 }).join('');
}
app.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;render();});
document.querySelector('#home').onclick=()=>{filter=null;render();};
render();
async function sync(){
 const today=romeDate();if(today!==displayDate){displayDate=today;render();}
 if(syncing||document.visibilityState==='hidden'||!navigator.onLine)return;
 syncing=true;
 try{
  const [{data,error},version]=await Promise.all([
   db.from('sda_public_signs').select('id,label,hub,pdf_path,sort_order').order('sort_order'),
   fetch(`/version.json?t=${Date.now()}`,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null)
  ]);
  if(version?.version&&version.version!==__APP_VERSION__){
   // Reload only after the new entry point is available, avoiding stale-page loops.
   const html=await fetch(`/index.html?t=${Date.now()}`,{cache:'no-store'}).then(r=>r.ok?r.text():'').catch(()=>'');
   const currentScript=document.querySelector('script[type="module"][src]')?.getAttribute('src');
   if(html&&currentScript&&!html.includes(currentScript)){location.replace(`/index.html?v=${version.version}${location.hash}`);return;}
  }
  if(!error&&data){
   const valid=data.map(i=>({...i,hub:['FLY','COY'].includes(i.hub)?'HUB':i.hub})).filter(i=>groups.includes(i.hub)&&typeof i.pdf_path==='string'&&(/^\/pdf\/[a-z0-9-]+\.pdf$/.test(i.pdf_path)||dailyPdfPages[i.id]===i.pdf_path));
   const nextSignature=JSON.stringify(valid);
   if(nextSignature!==signature){signature=nextSignature;items=valid;render();}
  }
 }catch{}finally{syncing=false;}
}
setInterval(sync,30000);
document.addEventListener('visibilitychange',sync);
window.addEventListener('focus',sync);
window.addEventListener('online',sync);
sync();
