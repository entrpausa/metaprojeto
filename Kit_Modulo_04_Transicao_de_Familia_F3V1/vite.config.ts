import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';
const path=(v:string)=>fileURLToPath(new URL(v,import.meta.url));
export default defineConfig({root:path('./apps/migrator/'),base:'./',build:{outDir:path('./dist/migrator/'),emptyOutDir:true,sourcemap:false},server:{host:'127.0.0.1'}});
