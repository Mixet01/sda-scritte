import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseKey } from './config.js';
import { destinations } from './destinations.js';
import './style.css';
const db=createClient(supabaseUrl,supabaseKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
const icons={print:'<path d="M6 9V3h12v6M6 18H4V9h16v9h-2M6 14h12v7H6z"/>',search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',arrow:'<path d="M7 17 17 7M7 7h10v10"/>',star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3L7.5 14 3 9.6l6.2-.9z"/>',folder:'<path d="M3 6h6l2 2h10v12H3z"/>'};
const icon=name=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let items=destinations,query='',group='Tutte',onlyFavorites=false;
let favorites;try{favorites=new Set(JSON.parse(localStorage.getItem('sda-favorites')||'[]'));}catch{favorites=new Set();}
document.querySelector('#app').innerHTML=`<header><a class="brand" href="/" aria-label="SDA Scritte, homepage"><span class="brand-symbol">S<span>↗</span></span><span>SDA <b>Scritte</b><small>ARCHIVIO DESTINAZIONI</small></span></a><div class="header-right"><span class="online"><i></i> Accesso libero</span><a class="button light" href="#destinazioni">${icon('folder')} Tutte le scritte</a></div></header><main><section class="hero"><div><div class="eyebrow">IL TUO HUB, IN ORDINE</div><h1>Trova. Apri.<br><span>Stampa.</span></h1><p>Tutte le destinazioni in un posto solo.<br>Le tue scritte A4, pronte quando servono.</p><div class="hero-tags"><span>${icon('print')} Formato A4</span><span>2 scritte per foglio</span></div></div><div class="paper-scene" aria-hidden="true"><div class="paper-back"></div><div class="paper"><div class="paper-top">ANTEPRIMA DI STAMPA <span>A4</span></div><div class="paper-label">HM4<br>FLY</div><div class="cut-line"></div><div class="paper-label">HM4<br>FLY</div></div><span class="paper-badge">Una destinazione.<br>Due copie.</span></div></section><section id="destinazioni" class="library" aria-label="Archivio destinazioni"><div class="section-heading"><div><div class="eyebrow">PRONTE PER IL TUO TURNO</div><h2>Le destinazioni <span id="count">18</span></h2></div><span class="library-note">Scegli una scritta e apri il PDF ${icon('arrow')}</span></div><div class="toolbar"><label class="search">${icon('search')}<input id="search" type="search" placeholder="Cerca una destinazione, un hub, una scritta…" aria-label="Cerca destinazioni"><kbd>/</kbd></label><button id="favorites" class="button favorite-filter" aria-pressed="false">${icon('star')} Preferiti</button></div><div id="groups" class="groups"></div><p id="results" class="sr-only" aria-live="polite"></p><div id="empty"></div><div id="grid" class="grid"></div></section><aside class="tip">${icon('print')}<div><strong>Dal riquadro alla stampante.</strong><p>Apri una destinazione e stampa il PDF al 100% su un foglio A4. Ogni foglio contiene due scritte uguali.</p></div><span>A4 · 210 × 297 mm</span></aside></main><footer><span>SDA Scritte <b>↗</b></span><span>Un posto per ogni destinazione.</span></footer>`;
const $=s=>document.querySelector(s);
function render(){
 $('#count').textContent=items.length;
 const groups=['Tutte','Calabria','FLY','COY','Reverse','Altre'];
 $('#groups').innerHTML=groups.map(g=>`<button class="chip ${group===g?'active':''}" data-group="${g}" aria-pressed="${group===g}">${g}</button>`).join('');
 $('#groups').querySelectorAll('button').forEach(b=>b.onclick=()=>{group=b.dataset.group;render();});
 const filtered=items.filter(i=>(group==='Tutte'||i.hub===group)&&(!onlyFavorites||favorites.has(i.id))&&`${i.label} ${i.hub}`.toLocaleLowerCase('it').includes(query));
 $('#results').textContent=`${filtered.length} destinazioni visualizzate`;
 $('#grid').innerHTML=filtered.map(i=>`<article class="card"><div class="card-head"><span class="hub-tag">${escape(i.hub)}</span><button class="star ${favorites.has(i.id)?'selected':''}" data-favorite="${i.id}" aria-label="${favorites.has(i.id)?'Rimuovi dai':'Aggiungi ai'} preferiti ${escape(i.label)}" aria-pressed="${favorites.has(i.id)}">${icon('star')}</button></div><a class="open-card" href="${escape(i.pdf_path)}" target="_blank" rel="noopener" aria-label="Apri PDF ${escape(i.label)}"><span class="label-preview">${escape(i.label)}</span><span class="card-description">Due scritte in grassetto per foglio</span><span class="card-foot"><span>${icon('print')} PDF · A4 · 2 copie</span><span class="open-arrow">${icon('arrow')}</span></span></a></article>`).join('');
 $('#empty').innerHTML=filtered.length?'':`<div class="empty">${icon('folder')}<h3>Nessuna scritta trovata</h3><p>Prova un’altra ricerca o cambia filtro.</p><button class="button light" id="reset">Mostra tutte le scritte</button></div>`;
 $('#reset')?.addEventListener('click',()=>{group='Tutte';query='';onlyFavorites=false;$('#search').value='';$('#favorites').setAttribute('aria-pressed','false');render();});
 document.querySelectorAll('[data-favorite]').forEach(b=>b.onclick=()=>{const id=b.dataset.favorite;favorites.has(id)?favorites.delete(id):favorites.add(id);try{localStorage.setItem('sda-favorites',JSON.stringify([...favorites]));}catch{}render();});
}
$('#search').oninput=e=>{query=e.target.value.trim().toLocaleLowerCase('it');render();};
$('#favorites').onclick=()=>{onlyFavorites=!onlyFavorites;$('#favorites').setAttribute('aria-pressed',String(onlyFavorites));render();};
document.addEventListener('keydown',e=>{if(e.key==='/'&&document.activeElement.tagName!=='INPUT'){e.preventDefault();$('#search').focus();}});
render();
// The bundled archive also works while the database is temporarily unavailable.
db.from('sda_public_signs').select('id,label,hub,pdf_path,sort_order').order('sort_order').then(({data,error})=>{
 if(error||!data?.length)return;
 const valid=data.filter(i=>typeof i.pdf_path==='string'&&/^\/pdf\/[a-z0-9-]+\.pdf$/.test(i.pdf_path));
 if(valid.length){items=valid;render();}
}).catch(()=>{});
