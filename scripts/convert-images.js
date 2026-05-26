const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const IMG_DIR = path.join(__dirname, '..', 'img')
const PORTFOLIO_DIR = path.join(IMG_DIR, 'работы')
const OUT_DIR = IMG_DIR

const files = {
  'hero': { src: 'маникюр с покрытием.jpg', w: 1200, q: 60 },
  'about': { src: 'О мастере.jpg', w: 500, q: 65 },
  'service-manicure-coating': { src: 'маникюр с покрытием.jpg', w: 300, q: 60 },
  'service-manicure-natural': { src: 'Маникюр без покрытия.jpg', w: 300, q: 60 },
  'service-strengthening': { src: 'Укрепление ногтей.jpg', w: 300, q: 60 },
  'service-extension': { src: 'наращивание ногтей.jpg', w: 300, q: 60 },
  'service-design': { src: 'дизайн ногтей.jpg', w: 300, q: 60 },
  'service-pedicure': { src: 'педикюр.jpg', w: 300, q: 60 },
}

async function convert(srcFile, outName, w, q, srcDir) {
  srcDir = srcDir || IMG_DIR
  const src = path.join(srcDir, srcFile)
  const out = path.join(OUT_DIR, outName + '.webp')
  if (!fs.existsSync(src)) { console.log('  NOT FOUND:', srcFile); return }
  try {
    await sharp(src)
      .resize(w, undefined, { fit: 'cover', withoutEnlargement: true })
      .webp({ quality: q })
      .toFile(out)
    const orig = fs.statSync(src).size
    const comp = fs.statSync(out).size
    console.log(`  ${srcFile}: ${(orig/1024).toFixed(0)}KB → ${(comp/1024).toFixed(0)}KB (${(comp/orig*100).toFixed(0)}%)`)
  } catch(e) { console.log('  ERROR:', srcFile, e.message) }
}

;(async () => {
  // Convert all named files
  for (const [name, cfg] of Object.entries(files)) {
    console.log(`Converting ${name}...`)
    await convert(cfg.src, name, cfg.w, cfg.q)
  }

  // Convert portfolio (работы/)
  if (fs.existsSync(PORTFOLIO_DIR)) {
    const entries = fs.readdirSync(PORTFOLIO_DIR).filter(f => /\.(jpg|jpeg|png)$/i.test(f))
    for (let i = 0; i < entries.length; i++) {
      console.log(`Converting portfolio-${i+1}...`)
      await convert(entries[i], `portfolio-${i+1}`, 400, 60, PORTFOLIO_DIR)
    }
  }

  console.log('\nDone!')
})()
