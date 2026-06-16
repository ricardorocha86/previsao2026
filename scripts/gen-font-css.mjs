// Gera public/fonts/montserrat-embed.css com a Montserrat (pesos 600/700/800/900)
// SUBSETADA só nos glifos usados pelo card (letras, acentos PT, dígitos, símbolos),
// com os woff2 embutidos como data-URI. Self-hosted + minúsculo => geração rápida.
import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

// Todos os glifos que aparecem no card (rótulos fixos + nomes das 48 seleções + dígitos/símbolos).
const GLYPHS =
  ' 0123456789' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
  'abcdefghijklmnopqrstuvwxyz' +
  'ÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜ' +
  'àáâãäçèéêëìíîïñòóôõöùúûü' +
  '×·★º.,-/:&()!?\'’%';

mkdirSync('/tmp', { recursive: true });
writeFileSync('/tmp/__glyphs.txt', GLYPHS, 'utf8');

const css = execSync(
  `curl -sS -A "${UA}" -G "https://fonts.googleapis.com/css2" ` +
  `--data-urlencode "family=Montserrat:wght@600;700;800;900" ` +
  `--data-urlencode "display=swap" ` +
  `--data-urlencode "text@/tmp/__glyphs.txt"`,
  { maxBuffer: 1 << 24 },
).toString();

const urls = [...new Set([...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/g)].map((m) => m[1]))];
if (!urls.length) { console.error('Nenhuma URL woff2. CSS:\n', css.slice(0, 400)); process.exit(1); }

let out = css;
for (const u of urls) {
  const b64 = execSync(`curl -sS "${u}" | base64 -w 0`, { maxBuffer: 1 << 26 }).toString().trim();
  out = out.split(u).join(`data:font/woff2;base64,${b64}`);
}
mkdirSync('public/fonts', { recursive: true });
writeFileSync('public/fonts/montserrat-embed.css', out, 'utf8');
console.log(`OK: montserrat-embed.css (${out.length} chars, ${urls.length} fontes embutidas)`);
