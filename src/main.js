import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseKey } from './config.js';
import { destinations } from './destinations.js';
import './style.css';
const db=createClient(supabaseUrl,supabaseKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const groups=['Calabria','FLY','COY','Reverse','Altre'];
let items=destinations,filter='Tutte',signature='',syncing=false;
const app=document.querySelector('#app');
app.innerHTML=`<main class="shell"><header class="topbar"><div class="brand"><span class="brand-icon" aria-hidden="true">S<span>↗</span></span><h1>SDA <span>Scritte</span></h1></div><span class="live" role="status"><i></i> Live</span></header><nav class="filters" aria-label="Tipo di scritta">${['Tutte',...groups].map(g=>`<button data-filter="${g}" class="filter ${g==='Tutte'?'active':''}" aria-pressed="${g==='Tutte'}">${g}</button>`).join('')}</nav><div id="archive"></div></main>`;
function render(){
 document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b.dataset.filter===filter);b.setAttribute('aria-pressed',String(b.dataset.filter===filter));});
 document.querySelector('#archive').innerHTML=groups.filter(g=>filter==='Tutte'||g===filter).map(g=>{
  const entries=items.filter(i=>i.hub===g);
  if(!entries.length)return '';
  return `<section class="group group-${g.toLowerCase()}" aria-label="${g}"><div class="group-heading"><h2><i></i>${g}</h2><span>${entries.length}</span><div></div></div><div class="destinations">${entries.map(i=>`<a class="destination" href="${escape(i.pdf_path)}" target="_blank" rel="noopener" aria-label="Apri PDF ${escape(i.label)}"><span>${escape(i.label)}</span></a>`).join('')}</div></section>`;
 }).join('');
}
app.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;render();});
render();
async function sync(){
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
   if(html&&currentScript&&!html.includes(currentScript)){location.replace(`${location.pathname}?v=${version.version}${location.hash}`);return;}
  }
  if(!error&&data){
   const valid=data.filter(i=>groups.includes(i.hub)&&typeof i.pdf_path==='string'&&/^\/pdf\/[a-z0-9-]+\.pdf$/.test(i.pdf_path));
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
