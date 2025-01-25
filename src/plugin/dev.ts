import type { Compiler as RspackCompiler } from '@rspack/core'
import type { UnpluginOptions } from 'unplugin'
import type { Compiler as WebpackCompiler } from 'webpack'

let _isBuild = true

export function isBuild(): boolean {
  return _isBuild
}

export const buildDetector = {
  esbuild: {
    // No way to detect build/serve mode.
  },

  farm: {
    configureDevServer() {
      _isBuild = false
    },
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
} satisfies Omit<UnpluginOptions, 'name'>

function detectWebpackDevServer(compiler: WebpackCompiler | RspackCompiler, onDev: () => void): void {
  let orig = (): void => {}

  if (compiler.options.devServer) {
    // @ts-expect-error Types are not available but this should match.
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
