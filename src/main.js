import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseKey } from './config.js';
import { destinations } from './destinations.js';
import './style.css';

const db=createClient(supabaseUrl,supabaseKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const app=document.querySelector('#app');
function render(items){
 app.innerHTML=`<main class="destinations" aria-label="Scritte delle destinazioni">${items.map(item=>`<a class="destination" href="${escape(item.pdf_path)}" target="_blank" rel="noopener" aria-label="Apri PDF ${escape(item.label)}"><span>${escape(item.label)}</span></a>`).join('')}</main>`;
}
render(destinations);
// The included archive keeps every PDF accessible if Supabase is unavailable.
db.from('sda_public_signs').select('id,label,pdf_path,sort_order').order('sort_order').then(({data,error})=>{
 if(error||!data?.length)return;
 const valid=data.filter(item=>typeof item.pdf_path==='string'&&/^\/pdf\/[a-z0-9-]+\.pdf$/.test(item.pdf_path));
 if(valid.length)render(valid);
}).catch(()=>{});
