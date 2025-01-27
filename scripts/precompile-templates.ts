import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import Handlebars from 'handlebars'

const __dirname = dirname(fileURLToPath(import.meta.url))

// This template is used to generate the files.
const template = Handlebars.compile(
  await readFile(resolve(__dirname, './templates/template.hbs'), { encoding: 'utf8' }),
  { strict: true },
)

// Begin traversal at this directory.
const dirsToScan = [resolve(__dirname, '../src/')]

// Marker for partial templates.
const PARTIALS_DIR = '_partials'

// Memory to build index files for partials.
const partialsIndices: Record<string, string[]> = {}

// This template is used to generate the partial index files.
const partialIndex = Handlebars.compile(
  await readFile(resolve(__dirname, './templates/register.hbs'), { encoding: 'utf8' }),
  { strict: true },
)

while (dirsToScan.length > 0) {
  const dir = dirsToScan.shift()
  if (dir) {
    // Get directory contents.
    const entries = await readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(entry.parentPath, entry.name)

      if (entry.isDirectory()) {
        // Enqueue directories into the list to check. This does a breadth-first search.
        dirsToScan.push(fullPath)
      }
      else if (entry.name.endsWith('.hbs')) {
        // Precompile the template...
        const templateSpec = Handlebars.precompile(await readFile(fullPath, { encoding: 'utf8' }), {
          strict: true,
        })

        // ... and save it into a file.
        await writeFile(
          `${fullPath}.ts`,
          template({
            templateSpec,
          }),
          { encoding: 'utf8' },
        )

        // Check if this is a partial template.
        const partialsIdx = fullPath.indexOf(PARTIALS_DIR)
        if (partialsIdx > -1) {
          const partialDir = fullPath.slice(0, partialsIdx + PARTIALS_DIR.length)
          const partialName = fullPath.slice(partialsIdx + PARTIALS_DIR.length + 1)

          const index = partialsIndices[partialDir] ?? (partialsIndices[partialDir] = [])
          index.push(partialName)
        }
      }
    }
  }
}

// Generate index files for partials that register them on import.
for (const [dir, partials] of Object.entries(partialsIndices)) {
  await writeFile(
    join(dir, 'register__generated.ts'),
    partialIndex({
      partials,
    }),
    { encoding: 'utf8' },
  )
}
