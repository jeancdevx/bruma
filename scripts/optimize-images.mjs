import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const directory = resolve(root, 'public/images');
const metadataPath = resolve(root, 'src/data/image-assets.json');
const originals = JSON.parse(await readFile(resolve(root, 'docs/design/assets.json'), 'utf8'));
const hash = buffer => createHash('sha256').update(buffer).digest('hex');
const options = { widths: [400, 800, 1200], webp: { quality: 76, effort: 5 }, jpeg: { quality: 80, progressive: true } };
const previousText = await readFile(metadataPath, 'utf8').catch(() => '');
const previous = previousText ? JSON.parse(previousText) : null;
const compatible = JSON.stringify(previous?.options) === JSON.stringify(options);
await mkdir(directory, { recursive: true });

async function valid(file) {
  try { return hash(await readFile(resolve(root, `public${file.url}`))) === file.sha256; }
  catch { return false; }
}

async function save(id, buffer, info, extension) {
  const sha256 = hash(buffer);
  const filename = `${id}-${info.width}-${sha256.slice(0, 12)}.${extension}`;
  await writeFile(resolve(directory, filename), buffer);
  return { url: `/images/${filename}`, width: info.width, height: info.height, bytes: buffer.length, sha256 };
}

const images = {};
let converted = 0;
for (const asset of originals.assets) {
  const source = await readFile(resolve(root, asset.path));
  const sourceHash = hash(source);
  const cached = previous?.images?.[asset.id];
  if (compatible && cached?.sourceSha256 === sourceHash && (await Promise.all(cached.variants.map(valid))).every(Boolean)) {
    images[asset.id] = cached;
    continue;
  }
  const metadata = await sharp(source).metadata();
  const widths = [...new Set(options.widths.map(width => Math.min(width, metadata.width)))];
  const variants = [];
  for (const width of widths) {
    const { data, info } = await sharp(source).resize({ width, withoutEnlargement: true }).webp(options.webp).toBuffer({ resolveWithObject: true });
    variants.push(await save(asset.id, data, info, 'webp'));
    converted++;
  }
  images[asset.id] = { source: asset.path, sourceBytes: source.length, sourceSha256: sourceHash, variants };
}

let social = previous?.social;
if (!compatible || social?.sourceSha256 !== images.facade.sourceSha256 || !(await valid(social))) {
  const source = await readFile(resolve(root, images.facade.source));
  const { data, info } = await sharp(source).resize({ width: 1200, withoutEnlargement: true }).jpeg(options.jpeg).toBuffer({ resolveWithObject: true });
  social = { ...await save('facade-social', data, info, 'jpg'), sourceSha256: images.facade.sourceSha256 };
}

const output = { options, images, social };
const serialized = JSON.stringify(output, null, 2) + '\n';
if (serialized !== previousText) await writeFile(metadataPath, serialized);

// Remove only obsolete outputs recorded by this generator, preserving unrelated files.
const files = value => [...Object.values(value?.images ?? {}).flatMap(image => image.variants.map(file => file.url)), value?.social?.url].filter(Boolean);
const current = new Set(files(output));
for (const url of files(previous)) {
  if (!current.has(url) && /^\/images\/[a-z0-9-]+-\d+-[a-f0-9]{12}\.(webp|jpg)$/.test(url)) {
    await unlink(resolve(root, `public${url}`)).catch(error => { if (error.code !== 'ENOENT') throw error; });
  }
}

const variants = Object.values(images).flatMap(image => image.variants);
console.log(`${variants.length} static WebP variants ready (${converted} converted, ${variants.length - converted} cached). Total: ${Math.round(variants.reduce((sum, file) => sum + file.bytes, 0) / 1024)} KiB.`);
