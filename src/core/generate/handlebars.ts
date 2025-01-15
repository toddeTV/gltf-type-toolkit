import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import Handlebars from 'handlebars'

export const handlebars = Object.assign(Handlebars.create(), {
  async compileFile(this: typeof Handlebars, path: string) {
    const contents = await readFile(path, { encoding: 'utf-8' })
    return this.compile(contents, {
      strict: true,
    })
  },
})

registerHelpers()
await registerPartials()

function registerHelpers(): void {
  // Join strings with a separator.
  handlebars.registerHelper('join', (list, options) =>
    list.map((item: any) => options.fn(item, { data: options.data })).join(options.hash.sep))

  // Create an array with a single element.
  handlebars.registerHelper('singleton', val => [val])

  // Append an element to an array.
  handlebars.registerHelper('append', (arr, val) => [...arr, val])
}

async function registerPartials(): Promise<void> {
  // TODO: Somehow get these to be bundled.
  const partialsDir = join(fileURLToPath(import.meta.url), '../templates/_partials')

  const dirsToScan = [partialsDir]

  while (dirsToScan.length > 0) {
    const dir = dirsToScan.shift()
    if (dir) {
      const entries = await readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        if (entry.name.endsWith('.hbs')) {
          const name = join('_partials', entry.parentPath.replace(partialsDir, ''), entry.name)

          handlebars.registerPartial(name, await handlebars.compileFile(join(entry.parentPath, entry.name)))
        }
        else if (entry.isDirectory()) {
          dirsToScan.push(join(entry.parentPath, entry.name))
        }
      }
    }
  }
}
