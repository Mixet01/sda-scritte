import {createClient} from '@supabase/supabase-js';
import {supabaseUrl,supabaseKey} from './config.js';

const email = 'sda-mixet-owner-138730e@example.com';
const client = createClient(supabaseUrl,supabaseKey,{
  auth:{storageKey:'sda-mixet-auth',persistSession:false,detectSessionInUrl:false}
});
const files = client.storage.from('sda-mixet-private');
let setupToken = new URLSearchParams(location.hash.slice(1)).get('mixet-setup');
if (setupToken) history.replaceState(null,'',location.pathname + location.search);
let unlocked = false;

export function showMixet(root) {
  root.innerHTML = '<section class="mixet-panel"><h2>Mixet</h2><div class="mixet-content"></div><p class="mixet-status" role="status"></p></section>';
  const content = root.querySelector('.mixet-content');
  const status = root.querySelector('.mixet-status');
  if (unlocked) {
    showFiles(content,status);
    return;
  }
  content.innerHTML = '<form><label for="mixet-password">Password</label><input id="mixet-password" type="password" required><button type="submit"></button></form>';
  const form = content.querySelector('form');
  const password = form.querySelector('input');
  const button = form.querySelector('button');
  const setup = Boolean(setupToken);
  password.autocomplete = setup ? 'new-password' : 'current-password';
  if (setup) password.minLength = 12;
  button.textContent = setup ? 'Imposta password' : 'Accedi';
  if (setup) status.textContent = 'Scegli una password di almeno 12 caratteri.';
  form.onsubmit = async event => {
    event.preventDefault();
    button.disabled = true;
    try {
      if (setupToken) {
        const response = await fetch(supabaseUrl + '/functions/v1/sda-mixet-setup',{
          method:'POST',headers:{'Content-Type':'application/json'},
          body:JSON.stringify({token:setupToken,password:password.value})
        });
        if (!response.ok && response.status !== 409) throw new Error('Configurazione non riuscita. Controlla il link e la password.');
      }
      const {data,error} = await client.auth.signInWithPassword({email,password:password.value});
      if (error || data.user?.app_metadata?.mixet_owner !== true) throw new Error('Accesso non riuscito. Controlla la password e riprova.');
      setupToken = null;
      unlocked = true;
      showFiles(content,status);
    } catch (error) {
      status.textContent = error.message;
    } finally {
      password.value = '';
      button.disabled = false;
    }
  };
}

async function showFiles(content,status) {
  content.innerHTML = '<form><label for="mixet-file">Carica un file privato</label><input id="mixet-file" type="file" required><button type="submit">Carica</button></form><ul></ul><button type="button" class="mixet-lock">Blocca</button>';
  status.textContent = '';
  const list = content.querySelector('ul');
  const form = content.querySelector('form');
  const lock = content.querySelector('.mixet-lock');
  const refresh = async () => {
    const fragment = document.createDocumentFragment();
    for (let offset = 0;; offset += 100) {
      const {data,error} = await files.list('',{limit:100,offset,sortBy:{column:'name',order:'asc'}});
      if (error) throw new Error('Impossibile leggere i file.');
      for (const file of data) {
        const row = document.createElement('li');
        const button = document.createElement('button');
        const name = decodeURIComponent(file.name.slice(37));
        button.textContent = name;
        button.onclick = async () => {
          button.disabled = true;
          try {
            const {data,error} = await files.download(file.name);
            if (error) throw error;
            const url = URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = url;
            link.download = name;
            link.click();
            setTimeout(() => URL.revokeObjectURL(url),60000);
          } catch {
            status.textContent = 'Impossibile scaricare il file.';
          } finally {
            button.disabled = false;
          }
        };
        row.append(button);
        fragment.append(row);
      }
      if (data.length < 100) break;
    }
    list.replaceChildren(fragment);
    if (!list.children.length) list.textContent = 'Nessun file caricato.';
  };
  lock.onclick = async () => {
    unlocked = false;
    const root = content.closest('#archive');
    content.replaceChildren();
    await client.auth.signOut({scope:'local'});
    if (root?.contains(content)) showMixet(root);
  };
  form.onsubmit = async event => {
    event.preventDefault();
    const file = form.querySelector('input').files[0];
    if (!file || file.size > 20 * 1024 * 1024) {
      status.textContent = 'Scegli un file fino a 20 MB.';
      return;
    }
    const button = form.querySelector('button');
    button.disabled = true;
    status.textContent = 'Caricamento in corso…';
    try {
      const name = crypto.randomUUID() + '-' + encodeURIComponent(file.name);
      const {error} = await files.upload(name,file,{upsert:false,contentType:'application/octet-stream'});
      if (error) throw new Error('Caricamento non riuscito.');
      form.reset();
      status.textContent = 'File caricato.';
      await refresh();
    } catch (error) {
      status.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  };
  try { await refresh(); } catch (error) { status.textContent = error.message; }
}

export const opensMixetSetup = Boolean(setupToken);
