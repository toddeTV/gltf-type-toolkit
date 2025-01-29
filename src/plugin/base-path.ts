import type { Compiler as RspackCompiler } from '@rspack/core'
import type { UnpluginOptions } from 'unplugin'
import type { Compiler as WebpackCompiler } from 'webpack'
import { name } from '../../package.json'

let basePath = '/'

export function getBasePath(): string {
  return basePath
}

export const basePathDetector: UnpluginOptions = {
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

  name: `${name}:base-path-detector`,

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

function getWebpackBasePath(compiler: WebpackCompiler | RspackCompiler): void {
  if (typeof compiler.options.output.publicPath === 'string') {
    basePath = compiler.options.output.publicPath
  }
}
