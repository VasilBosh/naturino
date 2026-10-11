import sharp from 'sharp';
import { readdir, mkdir, stat, writeFile, unlink } from 'fs/promises';
import path from 'path';

const INBOX = './new-reviews';        // тук пускаш НОВИТЕ снимки (каквото и да е име и формат)
const OUT = './public/social-webp';   // оттук сайтът показва отзивите (готовите .webp)
const SIZES_FILE = './src/data/review-sizes.ts';
const WIDTH = 800;

sharp.cache(false); // за да може Windows да изтрие оригинала веднага след обработка

await mkdir(INBOX, { recursive: true });
await mkdir(OUT, { recursive: true });

const isNumber = name => /^[1-9]\d*$/.test(name);
const byName = (a, b) => a.localeCompare(b, undefined, { numeric: true });

// Кои номера вече са заети в сайта
const taken = new Set(
  (await readdir(OUT))
    .filter(f => /\.webp$/i.test(f))
    .map(f => path.parse(f).name)
    .filter(isNumber)
    .map(Number)
);

// 1) Обработваме всичко от new-reviews
const all = (await readdir(INBOX)).filter(f => !f.startsWith('.')).sort(byName);
const images = all.filter(f => /\.(jpe?g|png|webp|avif|gif|tiff?)$/i.test(f));
const notImages = all.filter(f => !images.includes(f));

// Снимка с име-число (5.png) заема точно този номер и заменя стария отзив 5.
// Всяка друга (screenshot.png) получава следващия свободен номер.
const numbered = images.filter(f => isNumber(path.parse(f).name));
const unnamed = images.filter(f => !isNumber(path.parse(f).name));
for (const f of numbered) taken.add(Number(path.parse(f).name));

// Номерът за снимка без число в името се избира чак при обработката ѝ,
// за да не остават дупки в номерацията, ако някой файл се окаже повреден.
const jobs = [
  ...numbered.map(f => ({ file: f, n: Number(path.parse(f).name) })),
  ...unnamed.map(f => ({ file: f, n: null })),
];
const nextFree = () => Math.max(0, ...taken) + 1; // винаги след най-големия досегашен номер

let before = 0, after = 0, done = 0;
const failed = [];

for (const job of jobs) {
  const file = job.file;
  const n = job.n ?? nextFree();
  const inPath = path.join(INBOX, file);
  const outPath = path.join(OUT, `${n}.webp`);
  try {
    const size = (await stat(inPath)).size;
    await sharp(inPath)
      .resize({ width: WIDTH, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outPath);

    taken.add(n);

    // Готовото копие е записано успешно -> чак сега трием тежкия оригинал
    await unlink(inPath);

    before += size;
    after += (await stat(outPath)).size;
    done++;
    console.log(`${file} -> ${n}.webp  (оригиналът е изтрит)`);
  } catch (err) {
    failed.push(`${file}: ${err.message}`);
  }
}

if (done) {
  const mb = n => (n / 1048576).toFixed(2);
  console.log(`\nОбработени: ${done}   Преди: ${mb(before)} MB   След: ${mb(after)} MB`);
} else if (!failed.length) {
  console.log('Няма нови снимки в new-reviews - само обновявам списъка с отзиви.');
}

// 2) Четем размерите на ВСИЧКИ готови снимки и ги записваме във файл, който сайтът чете сам
const sizes = {};
for (const file of (await readdir(OUT)).filter(f => /\.webp$/i.test(f))) {
  const name = path.parse(file).name;
  if (!isNumber(name)) continue;
  const meta = await sharp(path.join(OUT, file)).metadata();
  sizes[Number(name)] = [meta.width, meta.height];
}

const numbers = Object.keys(sizes).map(Number).sort((a, b) => a - b);
const lines = numbers.map(n => `  ${n}: [${sizes[n][0]}, ${sizes[n][1]}],`);
const content =
  '// АВТОМАТИЧНО ГЕНЕРИРАН ФАЙЛ - не го редактирай на ръка.\n' +
  '// Създава се от командата: node optimize-social.js\n\n' +
  'export const SIZES: Record<number, [number, number]> = {\n' +
  lines.join('\n') +
  '\n};\n';

await mkdir(path.dirname(SIZES_FILE), { recursive: true });
await writeFile(SIZES_FILE, content);

console.log(`\nОтзиви в сайта: ${numbers.length}`);

if (failed.length) {
  console.log('\nВНИМАНИЕ: тези снимки НЕ можаха да се обработят и са оставени в new-reviews:');
  for (const f of failed) console.log(`  - ${f}`);
}
if (notImages.length) {
  console.log('\nВНИМАНИЕ: тези файлове не са снимки и са оставени в new-reviews:');
  for (const f of notImages) console.log(`  - ${f}`);
}