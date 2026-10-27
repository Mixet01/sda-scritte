import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
const version=process.env.RENDER_GIT_COMMIT || createHash('sha256').update(['src/main.js','src/style.css','src/destinations.js','src/config.js','src/date.js','src/dated-pdf.js','src/pdf.js','print-zalando.html','vite.config.js'].map(path=>readFileSync(new URL(path,import.meta.url))).join('\n')).digest('hex').slice(0,16);
export default defineConfig({define:{__APP_VERSION__:JSON.stringify(version)},build:{rollupOptions:{input:{main:fileURLToPath(new URL('index.html',import.meta.url)),zalando:fileURLToPath(new URL('print-zalando.html',import.meta.url))}}},plugins:[{name:'app-version',generateBundle(){this.emitFile({type:'asset',fileName:'version.json',source:JSON.stringify({version})});}}]});
