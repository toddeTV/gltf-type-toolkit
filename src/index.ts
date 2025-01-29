import type { UnpluginFactory } from 'unplugin'
import type { Options } from './types'
import { createUnplugin } from 'unplugin'
import { name } from '../package.json'
import { basePathDetector } from './plugin/base-path.js'
import { createBuildStart } from './plugin/build-start.js'
import { buildDetector } from './plugin/dev.js'
import { createLoad, loadInclude } from './plugin/load.js'

export const unpluginFactory: UnpluginFactory<Options | undefined, true> = (options = {}, meta) => [
  buildDetector(options, meta),
  basePathDetector(options, meta),
  {
    buildStart: createBuildStart(options),

    enforce: 'pre',

    load: createLoad(options),

    loadInclude,

    name,
  },
]

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
