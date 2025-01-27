import type { UnpluginFactory } from 'unplugin'
import type { Options } from './types'
import { createUnplugin } from 'unplugin'
import { createBuildStart } from './plugin/build-start.js'
import { buildDetector } from './plugin/dev.js'
import { createLoad, loadInclude } from './plugin/load.js'

export const unpluginFactory: UnpluginFactory<Options | undefined> = options => ({
  ...buildDetector,

  buildStart: createBuildStart(options),

  enforce: 'pre',

  load: createLoad(options),

  loadInclude,

  name: '@todde.tv/gltf-type-toolkit',
})

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
