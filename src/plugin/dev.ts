import type { Compiler as RspackCompiler } from '@rspack/core'
import type { UnpluginFactory } from 'unplugin'
import type { Compiler as WebpackCompiler } from 'webpack'
import type { Options } from '../types.js'
import { name as pkgName } from '../../package.json'

const name = `${pkgName}:build-detector`

let _isBuild = true

export function isBuild(): boolean {
  return _isBuild
}

export const buildDetector: UnpluginFactory<Options, false> = () => ({
  esbuild: {
    // No way to detect build/serve mode.
  },

  farm: {
    configureDevServer() {
      _isBuild = false
    },
  },

  name,

  rolldown: {
    // Has only build mode.
  },

  rollup: {
    // Has only build mode.
  },

  rspack(compiler) {
    detectWebpackDevServer(compiler, () => _isBuild = false)
  },

  vite: {
    configResolved(config) {
      _isBuild = config.command === 'build'
    },
  },

  webpack(compiler) {
    detectWebpackDevServer(compiler, () => _isBuild = false)
  },
})

function detectWebpackDevServer(compiler: WebpackCompiler | RspackCompiler, onDev: () => void): void {
  let orig = (): void => {}

  if (compiler.options.devServer) {
    orig = compiler.options.devServer.onListening
  }

  compiler.options.devServer = {
    ...compiler.options.devServer,
    onListening: () => {
      onDev()
      orig()
    },
  }
}
