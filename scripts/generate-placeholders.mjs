// Generates neutral placeholder images so the app never shows broken images
// before real product photos are added. Safe to re-run.
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { products } from '../src/data/products.js'
import { categories } from '../src/data/categories.js'

const PUBLIC_DIR = new URL('../public/images/', import.meta.url).pathname
const BACKGROUNDS = ['#eef0f3', '#e8ecf3', '#f0eeea']

const escapeXml = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function wrapText(text, maxChars) {
  const lines = []
  let line = ''
  for (const word of text.split(' ')) {
    if ((line + ' ' + word).trim().length > maxChars) {
      lines.push(line)
      line = word
    } else {
      line = (line + ' ' + word).trim()
    }
  }
  if (line) lines.push(line)
  return lines
}

function buildSvg({ background, title, subtitle, caption }) {
  const lines = wrapText(title, 26)
  const startY = 400 - ((lines.length - 1) * 30) / 2
  const titleLines = lines
    .map((line, index) => `<text x="400" y="${startY + index * 34}" text-anchor="middle" font-size="26" font-weight="600" fill="#2a3037">${escapeXml(line)}</text>`)
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" role="img" aria-label="${escapeXml(title)}">
<rect width="800" height="800" fill="${background}"/>
<text x="400" y="${startY - 40}" text-anchor="middle" font-size="18" fill="#5b6470">${escapeXml(subtitle)}</text>
${titleLines}
<text x="400" y="720" text-anchor="middle" font-size="16" fill="#8a929d">${escapeXml(caption)}</text>
</svg>
`
}

let written = 0

for (const product of products) {
  const directory = join(PUBLIC_DIR, 'products', product.slug)
  mkdirSync(directory, { recursive: true })
  product.images.forEach((_, index) => {
    const svg = buildSvg({
      background: BACKGROUNDS[index % BACKGROUNDS.length],
      title: product.name,
      subtitle: product.brand,
      caption: `Image ${index + 1} of ${product.images.length} (placeholder)`,
    })
    writeFileSync(join(directory, `${index + 1}.svg`), svg)
    written += 1
  })
}

mkdirSync(join(PUBLIC_DIR, 'categories'), { recursive: true })
for (const category of categories) {
  const svg = buildSvg({
    background: BACKGROUNDS[0],
    title: category.name,
    subtitle: 'Category',
    caption: 'Placeholder',
  })
  writeFileSync(join(PUBLIC_DIR, 'categories', `${category.slug}.svg`), svg)
  written += 1
}

console.log(`Generated ${written} placeholder images in public/images/`)
