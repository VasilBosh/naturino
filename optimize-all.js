import sharp from 'sharp';
import { readdir, mkdir, stat } from 'fs/promises';
import path from 'path';

const ROOT = './public';
const SKIP = ['social-webp'];
const WIDTH = 1200;

let before = 0, after = 0, count = 0;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (SKIP.includes(entry.name)) continue;
      await walk(full);
      continue;
    }

    if (!/\.(jpg|jpeg|png)$/i.test(entry.name)) continue;
    if (entry.name === 'favicon.webp') continue;

    const rel = path.relative(ROOT, dir);
    const outDir = path.join('./public-webp', rel);
    await mkdir(outDir, { recursive: true });

    const name = path.parse(entry.name).name;
    const outPath = path.join(outDir, `${name}.webp`);

    before += (await stat(full)).size;

    await sharp(full)
      .resize({ width: WIDTH, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(outPath);

    after += (await stat(outPath)).size;
    count++;
    console.log(`${path.join(rel, entry.name)}`);
  }
}

await walk(ROOT);

const mb = n => (n / 1048576).toFixed(2);
console.log(`\nФайлове: ${count}`);
console.log(`Преди: ${mb(before)} MB`);
console.log(`След:  ${mb(after)} MB`);