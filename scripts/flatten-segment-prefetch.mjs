// The static export writes segment prefetch data as nested folders
// (`about/__next.about/__PAGE__.txt`), but the client requests a flat name
// (`about/__next.about.__PAGE__.txt`). Copy each file to the flat name so plain
// static hosts serve it instead of returning 404 on every prefetch.
import { copyFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const OUT = 'out'
let copied = 0

const filesIn = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? filesIn(path) : [path]
  })

const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (!statSync(path).isDirectory()) continue
    if (!name.startsWith('__next.')) {
      walk(path)
      continue
    }
    for (const file of filesIn(path)) {
      const flat = join(dir, [name, ...relative(path, file).split(sep)].join('.'))
      if (existsSync(flat)) continue
      copyFileSync(file, flat)
      copied++
    }
  }
}

if (!existsSync(OUT)) {
  console.error(`No "${OUT}" folder found. Run the static export build first.`)
  process.exit(1)
}

walk(OUT)
console.log(`Segment prefetch files flattened: ${copied}`)
