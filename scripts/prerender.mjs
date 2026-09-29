// Стъпка след build: вмъква готовия HTML на първия екран в dist/index.html
// и казва на браузъра да изтегли шрифта веднага. Пуска се автоматично от "npm run build".
import { readFileSync, writeFileSync, readdirSync, rmSync } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const dist = path.resolve('dist');
const ssrDir = path.resolve('dist-ssr');

const entry = readdirSync(ssrDir).find((f) => f.startsWith('entry-shell') && f.endsWith('.js'));
const { render } = await import(pathToFileURL(path.join(ssrDir, entry)).href);
// React добавя свои <link rel="preload"> за снимките най-отпред — махаме ги, самите <img> стигат.
// (Трябва да махнем и тях, иначе HTML-ът няма да съвпадне при "съживяването".)
const html = render().replace(/<link rel="preload" as="image"[^>]*\/?>/g, '');

const assets = readdirSync(path.join(dist, 'assets'));
const fontPreloads = assets
  .filter((f) => /^inter-(cyrillic|latin)-wght-normal-.*\.woff2$/.test(f))
  .map((f) => `    <link rel="preload" as="font" type="font/woff2" href="/assets/${f}" crossorigin />`)
  .join('\n');

const indexPath = path.join(dist, 'index.html');
let index = readFileSync(indexPath, 'utf8');

if (!index.includes('<div id="root"></div>')) throw new Error('Не намерих <div id="root"></div> в dist/index.html');

index = index.replace('</head>', `${fontPreloads}\n  </head>`);
index = index.replace(
  '<div id="root"></div>',
  `<div id="root">${html}</div>\n    <script>if(location.pathname!=='/'){document.getElementById('root').innerHTML=''}</script>`
);

writeFileSync(indexPath, index);
rmSync(ssrDir, { recursive: true, force: true });
console.log('✓ Първият екран е вграден в index.html (' + Math.round(html.length / 1024) + ' KB HTML)');
