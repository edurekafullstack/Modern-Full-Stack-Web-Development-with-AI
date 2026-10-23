import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'

const distDir = join(import.meta.dirname, '..', 'dist')

const patterns = [/sk-ant-[A-Za-z0-9_-]+/, /ANTHROPIC_API_KEY/]

function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? listFiles(path) : [path]
  })
}

if (!existsSync(distDir)) {
  console.error('dist/ not found. Run "npm run build" first.')
  process.exit(1)
}

const files = listFiles(distDir)
const matches = []

for (const file of files) {
  const contents = readFileSync(file, 'latin1')
  for (const pattern of patterns) {
    if (pattern.test(contents)) {
      matches.push({ file: relative(distDir, file), pattern })
    }
  }
}

if (matches.length > 0) {
  console.error('Possible API keys found in dist/:')
  for (const { file, pattern } of matches) {
    console.error(`  ${file}: ${pattern}`)
  }
  process.exit(1)
}

console.log(`Scanned ${files.length} files. No API keys found.`)
