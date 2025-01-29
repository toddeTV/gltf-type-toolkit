import type { Compiler as RspackCompiler } from '@rspack/core'
import type { UnpluginOptions } from 'unplugin'
import type { Compiler as WebpackCompiler } from 'webpack'
import { name } from '../../package.json'

let _isBuild = true

export function isBuild(): boolean {
  return _isBuild
}

export const buildDetector: UnpluginOptions = {
  esbuild: {
    // No way to detect build/serve mode.
  },

  farm: {
    configureDevServer() {
      _isBuild = false
    },
  },

  name: `${name}:build-detector`,

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
}

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
