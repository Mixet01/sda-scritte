import { defineConfig } from 'vite';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
const version=process.env.RENDER_GIT_COMMIT || createHash('sha256').update(['src/main.js','src/style.css','src/destinations.js','src/config.js','vite.config.js'].map(path=>readFileSync(new URL(path,import.meta.url))).join('\n')).digest('hex').slice(0,16);
export default defineConfig({define:{__APP_VERSION__:JSON.stringify(version)},plugins:[{name:'app-version',generateBundle(){this.emitFile({type:'asset',fileName:'version.json',source:JSON.stringify({version})});}}]});
