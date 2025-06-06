# gltf-type-toolkit

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![license][license-src]][license-href]

This plugin generates type-safe glTF file representations in TypeScript and optimizes the loading and bundling of
models in web projects, while being bundler-agnostic (Vite, Rollup, Webpack, esbuild, Rspack, ...).

## project overview

This plugin scans all model files in the project source, deconstructs the glTF JSON representation, and places
generated type files next to them. It creates [three.js](https://github.com/mrdoob/three.js/) types and uses
it internally to parse the glTF files, including modifications like path resolutions etc.

With this plugin you get:

- ✅ Type safe glTF file representations with correct inner [three.js](https://github.com/mrdoob/three.js/) types
  like `Object3D`, `Mesh`, etc..
  - ❗ Currently, we primarily support and generate the [three.js](https://github.com/mrdoob/three.js/) types
    `Object3D`, `Group`, and `Mesh`. Support for generating types for lights, cameras, materials, and other
    components is not yet implemented. See and subscribe to
    [Issue #22](https://github.com/toddeTV/gltf-type-toolkit/issues/22) to stay updated on this development and
    be notified when these features are added.
- ✅ Building will fail if a model is missing due to type-safe workflow.
- ✅ Only the used models are bundled in the final product, not all included in your dev project.
- ⚠️ Detects and handles [Draco Compression](https://github.com/google/draco) during type generation automatically,
  see [Draco Compression handling](#draco-compression-handling) below for more information.
- ✅ Works with glTF Seperate (`.gltf` + `.bin` + textures), glTF Embedded (only `.gltf`) and glTF Binary (`.glb`)
  files, see [glTF Versions and Representations](#gltf-versions-and-representations) below for more information.
- ✅ ESM ready.
- ⚠️ Build tool & bundler agnostic thanks to [Unplugin](https://github.com/unjs/unplugin), so use it with your
  favorite one, but see chapter
  [Build Tool, Bundler and Framework Compatibility](#build-tool-bundler-and-framework-compatibility)
  below for more details like compatibility or known problems:
  - [Astro](https://astro.build/)
  - [esbuild](https://esbuild.github.io/)
  - [Farm](https://www.farmfe.org/)
  - [Nuxt3](https://nuxt.com/)
  - [Rolldown](https://rolldown.rs/)
  - [Rollup](https://rollupjs.org/)
  - [Rspack](https://www.rspack.dev/)
  - [Vite](https://vitejs.dev/)
  - [Webpack](https://webpack.js.org/)
  - And every framework build on top of them.
- ✅ Use it with your favorite framework built on top of the listed build tools above, such as:
  - [React](https://react.dev/)
  - [Svelte](https://svelte.dev/)
  - [Vue3](https://vuejs.org/)
  - [Angular](https://angular.dev/)
  - ...

## Sponsoring

If you like this plugin and want to support us, we would be very happy to see you as a sponsor on GitHub ❤️<br>
You can find the `Sponsor` button on the top right of the
[GitHub project page](https://github.com/toddeTV/gltf-type-toolkit).<br>
Thanks a lot for the support <3

## Developer Documentation

For development-related information, including setup instructions for contributors, please refer to the
Developer README [`README-dev.md`](./README-dev.md).

## Getting Started

### Installation

1. Install with your package manager (we use pnpm and recommend it):

   ```bash
   # choose your package manager
   pnpm add -D @todde.tv/gltf-type-toolkit
   npm install --save-dev @todde.tv/gltf-type-toolkit
   yarn add --dev @todde.tv/gltf-type-toolkit
   bun add --dev @todde.tv/gltf-type-toolkit
   ```

2. Extend your `.gitignore` file to exclude generated files:

   ```sh
   # Generated glTF model files
   *.gltf.d.ts
   *.gltf.js
   ```

3. Add the plugin to your build tool, for example with [Vite](https://vitejs.dev/):

   ```ts
   // vite.config.ts
   import gltf from '@todde.tv/gltf-type-toolkit/vite.js'

   export default defineConfig({
     plugins: [
       // TODO while this list of possible plugin options is complete, better outsource them in a own section of the README
       gltf({ // Plugin options are defined in: `@todde.tv/gltf-type-toolkit/src/entries/types.ts`
         /**
          * Module that provides an instance of a three.js GLTFLoader as the default export.
          */
         // customGltfLoaderModule: '@/utils/customGltfLoader.ts', // type: string | undefined

         /**
          * Print extra information.
          */
         // verbose: true, // type: boolean | undefined

         /**
          * This string is prefixed to all model file references. If missing it will be guessed from your build tool.
          */
         // forceBasePath: '/foo/bar', // type: string | undefined
       }),
     ],
   })
   ```

### usage example with explanations

The plugin will run on:

- on dependency installation
- on dev server start
- on project build

Here's an example of how to use the plugin. You can customize this example to suit your needs, such as saving models
to different folders, changing paths, or adjusting how the model is handled after import.

1. Install the plugin (See [Installation](#installation) above).

2. Add a model to your project, here in the project source under `@/assets/models`. We copy the following in it:

   1. `MyModel.gltf` The glTF JSON representation that describes the model.
   2. `MyModel.bin` The binary file of the model, compressed with the [Draco Compression](https://github.com/google/draco).
   3. `MyModel-texture1.png` A texture that the model uses.
   4. `MyModel-texture2.png` A second texture that the model uses.

3. Start your dev to generate all files. With our example model we get:

   ```diff
    @/assets/models/MyModel.gltf
    @/assets/models/MyModel.bin
    @/assets/models/MyModel-texture1.png
    @/assets/models/MyModel-texture2.png
   +@/assets/models/MyModel.gltf.d.ts    <- the typing
   +@/assets/models/MyModel.gltf.js      <- actual code with node get helper function and model graph representation
   ```

   > Alternatively, you can run the script `gltf-codegen` supplied by the package to manually create those files. More details at [Binary scripts](#binary-scripts).

4. Import the type safe model in your code and use it, e.g.:

   ```ts
   // yourCustomFile.ts
   import { getNode, MyModelScene } from '@/assets/models/MyModel.gltf.js'

   // load the main model, so to say the wrapper in the scene
   const model = await getNode(MyModelScene)

   // load a child
   const innerModel = await getNode(MyModelScene.someInnerModel)

   // work with a model
   innerModel.receiveShadow = true
   innerModel.castShadow = true
   ```

## Build Tool, Bundler and Framework Compatibility

Thanks to [Unplugin](https://github.com/unjs/unplugin), we support a wide variety of build tools and bundlers,
resulting in the following compatibility in our project:

(Legend: 🟢 Tested & Supported | 🟡 Not Yet Tested | 🔴 Not Supported)

| Build Tool                            | Status | Note                                                                                                                                      |
| ------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| [esbuild](https://esbuild.github.io/) | 🟢     |                                                                                                                                           |
| [Nuxt3](https://nuxt.com/)            | 🟢     |                                                                                                                                           |
| [Rolldown](https://rolldown.rs/)      | 🟢     | ⚠️ currently experimental in [Unplugin](https://github.com/unjs/unplugin)                                                                 |
| [Rollup](https://rollupjs.org/)       | 🟢     |                                                                                                                                           |
| [Rspack](https://www.rspack.dev/)     | 🟢     |                                                                                                                                           |
| [Vite](https://vitejs.dev/)           | 🟢     |                                                                                                                                           |
| [Astro](https://astro.build/)         | 🟡     |                                                                                                                                           |
| [Farm](https://www.farmfe.org/)       | 🔴     | Tested & model files are not emitted (see [Issue #27](https://github.com/toddeTV/gltf-type-toolkit/issues/27)). Contributions welcome! ❤️ |
| [Webpack](https://webpack.js.org/)    | 🔴     | Tested & model files are borked (see [Issue #30](https://github.com/toddeTV/gltf-type-toolkit/issues/30)). Contributions welcome! ❤️      |

## glTF Versions and Representations

(Legend: 🟢 Tested & Supported | 🟡 Partially Supported | 🔴 Not Supported)

| glTF Version | File Representation                    | Status | Note                                                                                                                                                 |
| ------------ | -------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| glTF 1.0     | Any                                    | 🔴     | glTF 2.0 was introduced in 2017 with major improvements. Avoid using the outdated glTF 1.0 standard in your projects.                                |
| glTF 2.0     | Separate (`.gltf` + `.bin` + textures) | 🟢     | Recommended! Offers better performance, version control, caching, transferability, and debugging.                                                    |
| glTF 2.0     | Embedded (only `.gltf`)                | 🟢     | Assets are embedded directly into the `.gltf` file as base64 encoded `data:` sources within the `uri` fields, making single-file management simpler. |
| glTF 2.0     | Binary (`.glb`)                        | 🟡     | Currently, only works with models that contain all referenced files in the binary chunk without external file references. Contributions welcome! ❤️  |

## Draco Compression handling

This plugin can handle the [Draco Compression](https://github.com/google/draco) during the type generation and handles
your draco compressed models just fine.

On runtime though, you have to handle the draco compression yourself depending on your architecture and setup.<br>
You can do this by creating a custom `gltfLoader` and pass it in the `customGltfLoaderModule` prop whn initializing
the plugin. In this loader, you can handle the draco loader.

For example with [Vite](https://vitejs.dev/):

```ts
// vite.config.ts
import gltf from '@todde.tv/gltf-type-toolkit/vite.js'

export default defineConfig({
  plugins: [
    gltf({
      customGltfLoaderModule: '@/utils/gltfLoader.ts',
    }),
  ],
})
```

```ts
// @/utils/gltfLoader.ts
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const dracoLoader = undefined // use an existing draco loader or create a custom one by extending `DRACOLoader`

const gltfLoader = new GLTFLoader().setDRACOLoader(dracoLoader)

export default gltfLoader
```

## Binary scripts

In addition to the commands in the `scripts` section of the `package.json`, this plugin also provides binary scripts.

Run them by adding this plugin to your project, be sure to have the dependencies installed and then
add `npx` or `pnpx` before the commands.

### `gltf-codegen [DIR]`

This script generates types and runtime code for all models found in `DIR` and sub-directories. `DIR` defaults to
the current directory.

Run `gltf-codegen --help` for more options and details.

## idea behind the scenes

On runtime it runs the default glTF loader mechanics of [three.js](https://github.com/mrdoob/three.js/) under the
hood. So, there is no extra layer of processing and therefore correct objects that three.js would give you when
importing it yourself in your application.

To achieve this, we use patched versions of `DRACOLoader` and `GLTFLoader` to be able to run it in CLI because
originally you can only use them in a browser runtime.

So we do not parse the glTF JSON file ourself but work with the representation after the
[three.js](https://github.com/mrdoob/three.js/) parsing. For code completion and for working with the
model graph, we store the paths in the graph by caching the child indices in the `children` array from each
object. With this, we can O(1) look up what the user requests without the need of traversing - neither depth first
(default approach from [three.js](https://github.com/mrdoob/three.js/)), nor breadth first.

One of the biggest challenges was making the plugin build tool agnostic bc not every build tool handles inner path
references the same. Therefore, we have to reconstruct the buffers that link the glTF file with the binary and
textures by text string & replace - kinda hacky, but reliable and the additional runtime is only performed in dev
and build, not in the production runtime.

## Troubleshooting with Known Problems and Limitations

If you have problems, maybe one of the following will help:

- Delete your build output folder (maybe some old builds copied model files in there and our plugin is now scanning them).
- We currently do not provide a watcher. Restart your dev environment when changing model files.

## Contribution & Attribution

### Project Contributors

<a href="https://github.com/toddeTV/gltf-type-toolkit/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=toddeTV/gltf-type-toolkit" />
</a>

### Core Team

**Project Founder & Lead:**

- [Thorsten Seyschab](https://todde.tv)

**Current Additional Core Team Members:**

- [Andreas Fehn](https://github.com/fehnomenal) as contributor who helped incredible with the project. Thank you mate,
  you rock!

### Acknowledgments

**Special Thanks:**<br>
_(People who provided valuable help on specific topics or issues)_

- \[currently none\]

**Helpful Projects:**<br>
_(Projects that provided valuable inspiration or resources.)_

- [zlig (zen-landscape-idle-game)](https://github.com/toddeTV/zlig): A Japanese zen-inspired idle browser game that
  showcases lightweight web technologies like `Vue` and `Three.js` to create fully browser-based games. The idea and
  initial implementation of this plugin [@todde.tv/gltf-type-toolkit](https://github.com/toddeTV/gltf-type-toolkit)
  originated during the development of zlig, where we required type-safe glTF representations to enable faster and
  more reliable development.

**Additional Tools:**<br>
_(excluding those listed in `./package.json`)_

- [GitHub Copilot](https://github.com/features/copilot) was used in private mode for programming questions.

**Assets & Materials Used:**<br>
_(including images & 3D models; mostly only those requiring attribution)_

- \[currently none\]

## License

Copyright (c) 2025-PRESENT [Thorsten Seyschab](https://todde.tv)<br>
This project is licensed under the MIT License, see the [`LICENSE.md`](./LICENSE.md) file for more details.

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@todde.tv/gltf-type-toolkit?style=flat&colorA=181818&colorB=26ab7a
[npm-version-href]: https://npmjs.com/package/@todde.tv/gltf-type-toolkit
[npm-downloads-src]: https://img.shields.io/npm/dm/@todde.tv/gltf-type-toolkit?style=flat&colorA=181818&colorB=26ab7a
[npm-downloads-href]: https://npmjs.com/package/@todde.tv/gltf-type-toolkit
[license-src]: https://img.shields.io/github/license/toddeTV/gltf-type-toolkit?style=flat&colorA=181818&colorB=26ab7a
[license-href]: https://github.com/toddeTV/gltf-type-toolkit/blob/main/LICENSE.md

<!-- Not used, as we are a build tool plugin. If our goal were to minimize size, we should ship one plugin per build tool, rather than a single agnostic plugin for all. -->
<!-- [bundle-size-src]: https://img.shields.io/bundlephobia/minzip/todde.tv/gltf-type-toolkit?style=flat&colorA=181818&colorB=26ab7a -->
<!-- [bundle-size-href]: https://bundlephobia.com/package/@todde.tv/gltf-type-toolkit -->
