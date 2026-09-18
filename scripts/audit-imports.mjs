// Audits every .jsx file: any <Component> used in JSX must be imported or defined locally.
import fs from 'fs'
import path from 'path'

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f)
    const st = fs.statSync(p)
    if (st.isDirectory()) walk(p, out)
    else if (p.endsWith('.jsx')) out.push(p)
  }
  return out
}

const files = walk('client/src')
let issues = 0
for (const file of files) {
  const src = fs.readFileSync(file, 'utf8')
  const tags = new Set([...src.matchAll(/<([A-Z][A-Za-z0-9_]*)/g)].map((m) => m[1]))
  const known = new Set()
  for (const m of src.matchAll(/import\s+([A-Za-z_$][\w$]*)\s*(?:,\s*\{([^}]*)\})?\s*from/g)) {
    if (m[1]) known.add(m[1])
    if (m[2]) m[2].split(',').forEach((x) => { const n = x.trim().split(/\s+as\s+/).pop(); if (n) known.add(n) })
  }
  for (const m of src.matchAll(/import\s*\{([^}]*)\}\s*from/g)) {
    m[1].split(',').forEach((x) => { const n = x.trim().split(/\s+as\s+/).pop(); if (n) known.add(n) })
  }
  for (const m of src.matchAll(/(?:function|const|class)\s+([A-Z][A-Za-z0-9_]*)/g)) known.add(m[1])
  const missing = [...tags].filter((t) => !known.has(t))
  if (missing.length) {
    console.log(`${file}: MISSING IMPORTS → ${missing.join(', ')}`)
    issues++
  }
}
if (issues) {
  console.error(`\n${issues} file(s) with missing imports — these crash at runtime (white screen)!`)
  process.exit(1)
}
console.log('import audit OK ✓')
