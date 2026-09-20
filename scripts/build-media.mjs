/**
 * Build pipeline for the demo media library.
 *
 *   node scripts/build-media.mjs
 *
 * What it does (all offline, no network):
 *   1. Slices the two 3x3 portrait contact sheets into 18 individual avatars (320px webp).
 *   2. Re-encodes the source photos to 1080px webp + computes a ~20px base64 LQIP
 *      (low quality image placeholder) so the feed can blur-up exactly like Instagram.
 *   3. Emits extra procedurally generated SVG "art" posts so the seed feed is full
 *      without shipping more binary data.
 *   4. Writes src/data/media.generated.ts — a typed manifest the app imports.
 */
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '')
const SRC = join(ROOT, 'media-src')
const OUT = join(ROOT, 'public', 'media')

const POST_TARGETS = [
  { file: 'p1.png', ratio: 0.8 },
  { file: 'p2.png', ratio: 1 },
  { file: 'p3.png', ratio: 0.8 },
  { file: 'p4.png', ratio: 1 },
  { file: 'p5.png', ratio: 0.8 },
  { file: 'p6.png', ratio: 1 },
  { file: 'p7.png', ratio: 1 },
  { file: 'p8.png', ratio: 0.8 },
]

/** Procedural SVG art used to round out the feed without more binary assets. */
const SVG_ART = [
  { id: 'a1', from: '#ff6b6b', to: '#4c1d95', seed: 3 },
  { id: 'a2', from: '#22d3ee', to: '#0f172a', seed: 11 },
  { id: 'a3', from: '#facc15', to: '#7c2d12', seed: 23 },
  { id: 'a4', from: '#34d399', to: '#064e3b', seed: 41 },
  { id: 'a5', from: '#f472b6', to: '#312e81', seed: 57 },
  { id: 'a6', from: '#fb923c', to: '#451a03', seed: 71 },
]

function svgArt({ from, to, seed }) {
  const circles = Array.from({ length: 9 }, (_, i) => {
    const x = ((seed * (i + 7) * 37) % 100) / 100
    const y = ((seed * (i + 13) * 53) % 100) / 100
    const r = 8 + (((seed + i * 17) % 40) / 100) * 45
    return `<circle cx="${(x * 100).toFixed(1)}" cy="${(y * 100).toFixed(1)}" r="${r.toFixed(
      1,
    )}" fill="${i % 2 ? '#ffffff' : '#000000'}" opacity="${(0.05 + (i % 5) * 0.03).toFixed(2)}"/>`
  }).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 125" preserveAspectRatio="xMidYMid slice">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient>
<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3"/><feColorMatrix type="saturate" values="0"/></filter></defs>
<rect width="100" height="125" fill="url(#g)"/>${circles}
<rect width="100" height="125" filter="url(#n)" opacity="0.12"/>
</svg>`
}

async function lqip(buffer) {
  const tiny = await sharp(buffer).resize(20, undefined, { withoutEnlargement: true }).blur(0.6).webp({ quality: 38 }).toBuffer()
  return `data:image/webp;base64,${tiny.toString('base64')}`
}

async function dominant(buffer) {
  const { data, info } = await sharp(buffer).resize(1, 1).raw().toBuffer({ resolveWithObject: true })
  const [r, g, b] = data
  const hex = (n) => n.toString(16).padStart(2, '0')
  return `#${hex(r)}${hex(g)}${hex(b)}`
}

async function main() {
  if (!existsSync(SRC)) {
    console.error('media-src/ not found — run image generation first. Skipping binary assets.')
  }
  await mkdir(join(OUT, 'avatars'), { recursive: true })
  await mkdir(join(OUT, 'posts'), { recursive: true })
  for (const junk of await readdir(join(OUT, 'avatars')).catch(() => [])) {
    await rm(join(OUT, 'avatars', junk))
  }
  for (const junk of await readdir(join(OUT, 'posts')).catch(() => [])) {
    await rm(join(OUT, 'posts', junk))
  }

  const avatars = []
  for (const [sheet, prefix] of [
    ['avatars-a.png', 'a'],
    ['avatars-b.png', 'b'],
  ]) {
    const path = join(SRC, sheet)
    if (!existsSync(path)) continue
    const meta = await sharp(path).metadata()
    const cell = Math.floor(Math.min(meta.width, meta.height) / 3)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const name = `${prefix}${row * 3 + col + 1}`
        await sharp(path)
          .extract({ left: col * cell, top: row * cell, width: cell, height: cell })
          .resize(320, 320)
          .webp({ quality: 76 })
          .toFile(join(OUT, 'avatars', `${name}.webp`))
        avatars.push(`/media/avatars/${name}.webp`)
      }
    }
  }

  const posts = []
  for (const [i, target] of POST_TARGETS.entries()) {
    const path = join(SRC, target.file)
    if (!existsSync(path)) continue
    const meta = await sharp(path).metadata()
    const srcW = meta.width
    const srcH = meta.height
    // centre-crop to the requested ratio, then scale to 1080 wide (Instagram-ish)
    let w = srcW
    let h = srcH
    if (srcW / srcH > target.ratio) w = Math.round(srcH * target.ratio)
    else h = Math.round(srcW / target.ratio)
    const out = await sharp(path)
      .extract({ left: Math.round((srcW - w) / 2), top: Math.round((srcH - h) / 2), width: w, height: h })
      .resize(1080, undefined, { withoutEnlargement: true })
      .webp({ quality: 76, effort: 5 })
      .toBuffer()
    const name = `p${i + 1}`
    await writeFile(join(OUT, 'posts', `${name}.webp`), out)
    posts.push({
      id: name,
      src: `/media/posts/${name}.webp`,
      width: 1080,
      height: Math.round(1080 / target.ratio),
      ratio: target.ratio,
      bytes: out.length,
      lqip: await lqip(out),
      color: await dominant(out),
    })
  }

  for (const art of SVG_ART) {
    const name = `art-${art.id}`
    await writeFile(join(OUT, 'posts', `${name}.svg`), svgArt(art))
    posts.push({
      id: name,
      src: `/media/posts/${name}.svg`,
      width: 800,
      height: 1000,
      ratio: 0.8,
      bytes: 0,
      lqip: '',
      color: art.to,
    })
  }

  const manifest = `/* eslint-disable */
// AUTO-GENERATED by scripts/build-media.mjs — do not edit by hand.
export interface MediaAsset {
  id: string
  src: string
  width: number
  height: number
  ratio: number
  bytes: number
  lqip: string
  color: string
}
export const AVATARS: string[] = ${JSON.stringify(avatars, null, 2)}
export const POST_MEDIA: MediaAsset[] = ${JSON.stringify(posts, null, 2)}
`
  await writeFile(join(ROOT, 'src', 'data', 'media.generated.ts'), manifest)
  const totalKb = Math.round(posts.reduce((s, p) => s + p.bytes, 0) / 1024)
  console.log(`avatars: ${avatars.length}, posts: ${posts.length}, post payload: ${totalKb}kb`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
