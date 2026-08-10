/**
 * Конвертирует PNG из public/niches в WebP (16:9, качество 80)
 * и печатает base64-LQIP для вставки в lib/content.ts.
 *
 * Запуск: node scripts/optimize-images.mjs
 */
import sharp from 'sharp'
import { readdir, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'

const NICHES_DIR = 'public/niches'
const TARGET_WIDTH = 1280 // достаточно для карточки 4:3 в бенто на 2x

async function run() {
  const files = (await readdir(NICHES_DIR)).filter((f) => f.endsWith('.png'))
  const lqip = {}

  for (const file of files) {
    const name = path.basename(file, '.png')
    const src = path.join(NICHES_DIR, file)

    await sharp(src)
      .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(path.join(NICHES_DIR, `${name}.webp`))

    const tiny = await sharp(src).resize({ width: 20 }).webp({ quality: 50 }).toBuffer()
    lqip[name] = `data:image/webp;base64,${tiny.toString('base64')}`

    await unlink(src)
    console.log(`[v0] ${name}.webp готов`)
  }

  // Иконки PWA из icon-512.png
  const iconSrc = 'public/icon-512.png'
  for (const size of [192, 512]) {
    await sharp(iconSrc).resize(size, size).png({ compressionLevel: 9 }).toFile(`public/icons/icon-${size}.png`)
  }
  await sharp(iconSrc).resize(180, 180).png({ compressionLevel: 9 }).toFile('public/icons/apple-touch-icon.png')
  await sharp(iconSrc).resize(32, 32).png({ compressionLevel: 9 }).toFile('public/favicon.png')
  console.log('[v0] иконки готовы')

  await writeFile('scripts/lqip.json', JSON.stringify(lqip, null, 2))
  console.log('[v0] LQIP записан в scripts/lqip.json')
}

run()
