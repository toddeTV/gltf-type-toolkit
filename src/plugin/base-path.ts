import type { Compiler as RspackCompiler } from '@rspack/core'
import type { UnpluginFactory } from 'unplugin'
import type { Compiler as WebpackCompiler } from 'webpack'
import type { Options } from '../types.js'
import { name as pkgName } from '../../package.json'

const name = `${pkgName}:base-path-detector`

let basePath = '/'

export function getBasePath(): string {
  return basePath
}
export const basePathDetector: UnpluginFactory<Options, false> = (options) => {
  if (options.forceBasePath !== undefined) {
    basePath = options.forceBasePath

    // Nothing to do.

    return {
      name,
    }
  }

  return {
    esbuild: {
      config(options) {
        if (options.publicPath) {
          basePath = options.publicPath
        }
      },
    },

    farm: {
      configResolved(config) {
        if (config.compilation?.output?.publicPath) {
          basePath = config.compilation.output.publicPath
        }
      },
    },

    name,

    rolldown: {
      // Not possible.
    },

    rollup: {
      // Not possible.
    },

    rspack(compiler) {
      getWebpackBasePath(compiler)
    },

    vite: {
      configResolved(config) {
        basePath = config.base
      },
    },

    webpack(compiler) {
      getWebpackBasePath(compiler)
    },
  }
}

function getWebpackBasePath(compiler: WebpackCompiler | RspackCompiler): void {
  if (typeof compiler.options.output.publicPath === 'string') {
    basePath = compiler.options.output.publicPath
  }
}
