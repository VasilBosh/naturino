import sharp from 'sharp';
import { readdir, mkdir, stat } from 'fs/promises';
import path from 'path';

const SRC = './public/social';
const OUT = './public/social-webp';
const WIDTH = 800;

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter(f => /\.(jpg|jpeg|png)$/i.test(f));

let before = 0, after = 0;

for (const file of files) {
  const name = path.parse(file).name;
  const inPath = path.join(SRC, file);
  const outPath = path.join(OUT, `${name}.webp`);

  before += (await stat(inPath)).size;

  await sharp(inPath)
    .resize({ width: WIDTH, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(outPath);

  after += (await stat(outPath)).size;
  console.log(`${file} -> ${name}.webp`);
}

const mb = n => (n / 1048576).toFixed(2);
console.log(`\nПреди: ${mb(before)} MB`);
console.log(`След:  ${mb(after)} MB`);