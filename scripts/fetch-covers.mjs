import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import sharp from 'sharp'

const POSTS_DIR = join(process.cwd(), 'content', 'posts')
const OUT_DIR = join(process.cwd(), 'public', 'covers')
const API = 'https://t.alcy.cc/pc'
const CONCURRENCY = 4

function seedHash(seed) {
  return Math.abs([...seed].reduce((acc, c) => ((acc << 5) - acc + c.charCodeAt(0)) | 0, 0))
}

function readFrontmatter(file) {
  const text = readFileSync(file, 'utf8')
  const block = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  return block ? block[1] : ''
}

function field(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'))
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : ''
}

function listPosts(dir) {
  return readdirSync(dir, { recursive: true })
    .filter(rel => typeof rel === 'string' && rel.endsWith('.md'))
    .map(rel => join(dir, rel))
}

async function download(slug) {
  const outPath = join(OUT_DIR, `${slug}.webp`)
  if (existsSync(outPath)) return 'cached'

  const url = `${API}?v=${seedHash(slug)}`
  const resp = await fetch(url, { signal: AbortSignal.timeout(25000) })
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
  const type = resp.headers.get('content-type') || ''
  if (!type.startsWith('image/')) throw new Error(`非图片响应: ${type}`)
  const buf = Buffer.from(await resp.arrayBuffer())
  await sharp(buf).resize(640, 360, { fit: 'cover' }).webp({ quality: 70 }).toFile(outPath)
  return 'fetched'
}

const posts = listPosts(POSTS_DIR)
const tasks = []
for (const file of posts) {
  const fm = readFrontmatter(file)
  if (field(fm, 'image')) continue
  const slug = field(fm, 'slug') || basename(file, '.md')
  tasks.push(slug)
}

mkdirSync(OUT_DIR, { recursive: true })

let ok = 0
let skipped = 0
let failed = 0
for (let i = 0; i < tasks.length; i += CONCURRENCY) {
  const batch = tasks.slice(i, i + CONCURRENCY)
  await Promise.all(batch.map(async (slug) => {
    try {
      const r = await download(slug)
      if (r === 'cached') skipped++
      else {
        ok++
        console.log(`[cover] ${slug}`)
      }
    } catch (e) {
      failed++
      console.warn(`[cover] 失败 ${slug}: ${e.message}`)
    }
  }))
}

console.log(`[cover] 新增 ${ok} · 已存在 ${skipped} · 失败 ${failed}`)
