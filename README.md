# gltf-type-toolkit

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle size][bundle-size-src]][bundle-size-href]
[![license][license-src]][license-href]

This plugin generates type-safe glTF file representations in TypeScript and optimizes the loading and bundling of
models in web projects, while being bundler-agnostic (Vite, Rollup, Webpack, esbuild, Rspack, ...).

## project overview

This plugin scans all model files in the project source, deconstructs the glTF JSON representation, and places
generated type files next to them. It uses [three.js](https://github.com/mrdoob/three.js/) to parse the glTF files,
including modifications like path resolutions etc.

With this plugin you get:

- ✅ Type safe glTF file representations with correct inner [three.js](https://github.com/mrdoob/three.js/) types
  like `Object3D`, `Mesh`, etc..
- ✅ Building will fail if a model is missing due to type-safe workflow.
- ✅ Only the used models are bundled in the final product, not all included in your dev project.
- ⚠️ Detects and handles [Draco Compression](https://github.com/google/draco) during type generation automatically,
  see [Draco Compression handling](#draco-compression-handling) below for more information.
- ✅ Works with glTF Seperate (`.gltf` + `.bin` + textures) and glTF Embedded (only `.gltf`) files,
  see [glTF Versions and Representations](#gltf-versions-and-representations) below for more information.
- ✅ ESM ready.
- ⚠️ Build tool & bundler agnostic thanks to [Unplugin](https://github.com/unjs/unplugin), so use it with your
  favorite one, but see chapter
  [Build Tool, Bundler and Framework Compatibility](#build-tool-bundler-and-framework-compatibility)
  below for more details like compatibility or known problems:
  - [Astro](https://astro.build/)
  - [esbuild](https://esbuild.github.io/)
  - [Farm](https://www.farmfe.org/)
  - [Nuxt3](https://nuxt.com/)
  - [Rollup](https://rollupjs.org/)
  - [Rspack](https://www.rspack.dev/)
  - [Vite](https://vitejs.dev/)
  - [Webpack](https://webpack.js.org/)
  - [Rolldown](https://rolldown.rs/)
  - And every framework build on top of them.
- ✅ Use it with your favorite framework built on top of the listed build tools above, such as:
  - [React](https://react.dev/)
  - [Svelte](https://svelte.dev/)
  - [Vue3](https://vuejs.org/)
  - ...

It will run when your dev server starts and also when you build your project.

## Sponsoring

If you like this plugin and want to support us, we would be very happy to see you as a sponsor on GitHub ❤️<br>
You can find the `Sponsor` button on the top right of the
[GitHub project page](https://github.com/toddeTV/gltf-type-toolkit).<br>
Thanks a lot for the support <3

## Developer Documentation

For development-related information, including setup instructions for contributors, please refer to the
[Developer README](./README.dev.md).

## Getting Started

### Installation

1. Install with your package manager (we use pnpm and recommend it):<br>
   ```bash
   # choose only one
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
       gltf({ // Plugin options are defined in: `@todde.tv/gltf-type-toolkit/src/entries/types.ts`
         /**
          * Module that provides an instance of a three.js GLTFLoader as the default export.
          */
         // customGltfLoaderModule: '@/utils/customGltfLoader.ts',

         /**
          * Print extra information.
          */
         // verbose: true,
       }),
     ],
   })
   ```

### usage example with explanations

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
   +@/assets/models/MyModel.gltf.js      <- actual code with node get helper function and scene/ model graph representation
   ```

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

| Build Tool                            | Status | Note                                                                      |
| ------------------------------------- | ------ | ------------------------------------------------------------------------- |
| [esbuild](https://esbuild.github.io/) | 🟢     |                                                                           |
| [Rollup](https://rollupjs.org/)       | 🟢     |                                                                           |
| [Rspack](https://www.rspack.dev/)     | 🟢     |                                                                           |
| [Vite](https://vitejs.dev/)           | 🟢     |                                                                           |
| [Webpack](https://webpack.js.org/)    | 🟢     |                                                                           |
| [Astro](https://astro.build/)         | 🟡     |                                                                           |
| [Nuxt3](https://nuxt.com/)            | 🟡     |                                                                           |
| [Rolldown](https://rolldown.rs/)      | 🟡     | ⚠️ currently experimental in [Unplugin](https://github.com/unjs/unplugin) |
| [Farm](https://www.farmfe.org/)       | 🔴     | Tested & not working. Contributions welcome! ❤️                           |

## glTF Versions and Representations

(Legend: 🟢 Tested & Supported | 🟡 Not Yet Tested | 🔴 Not Supported)

| glTF Version | File Representation                    | Status | Note                                                                                                                                                            |
| ------------ | -------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| glTF 1.0     | Any                                    | 🔴     | glTF 2.0 was introduced in 2017 with major improvements. Avoid using the outdated glTF 1.0 standard in your projects.                                           |
| glTF 2.0     | Separate (`.gltf` + `.bin` + textures) | 🟢     | Recommended! Offers better performance, version control, caching, transferability, and debugging.                                                               |
| glTF 2.0     | Embedded (only `.gltf`)                | 🟢     | Assets are embedded directly into the `.gltf` file as `uri:` data sources using base64 encoding, simplifying single-file management.                            |
| glTF 2.0     | Binary (`.glb`)                        | 🔴     | Currently not supported because we scan JSON-encoded `.gltf` files for type generation and cannot yet process binary representations. Contributions welcome! ❤️ |

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

## idea behind the scenes

On runtime it runs `useGLTF` under the hood. So no extra layer and therefore correct objects that
[three.js](https://github.com/mrdoob/three.js/) would give you when importing it yourself in runtime.

To achieve this, we patch a `useGLTF` from `three.js` to be able to run it in CLI because originally you can only use
this in a browser runtime.

So we do not parse the glTF JSON file ourself but work with the representation after the
[three.js](https://github.com/mrdoob/three.js/) `useGLTF` parsing. For code completion and for working with the
scene/ model graph, we store the paths in the graph by caching the child indices in the `childs` array from each
object. With this, we can O(1) look up what the user requests without the need of traversing - neither depth first
(default approach from [three.js](https://github.com/mrdoob/three.js/)), nor breath first.

One of the biggest challenges was making the plugin build tool agnostic bc not every build tool handles inner path
references the same. Therefore, we have to reconstruct the buffers that link the glTF file with the binary and
textures by text string & replace - kinda hacky, but reliable and the additional runtime is only performed in dev
and build, not in the production runtime.

## Troubleshooting with Known Problems and Limitations

If you have problems, maybe one of the following will help:

- Delete your build output folder (maybe some old builds copied model files in there and our plugin is now scanning them).
- We currently do not provide a watcher. Restart your dev environment when changing model files.

## Attribution/ Contribution

Project founder & head of project:

- [Thorsten Seyschab](https://todde.tv)

Honorable mentions to people that helped this project:

- [Andreas Fehn](https://github.com/fehnomenal) as contributor who helped incredible with the project and the magic
  behind the core. Thank you <3

Respectable mentions to projects that helped this project:

- \[currently none\]

Used programs/ softwares, services and dependencies - besides the ones in `./package.json`:

- [GitHub Copilot](https://github.com/features/copilot) was used in private mode for programming questions.

Used assets/ materials including images and 3D models:

- \[currently none\]

## License

Copyright (c) 2025-PRESENT [Thorsten Seyschab](https://todde.tv)<br>
This project is licensed under the MIT License, see the `LICENSE.md` file for more details.

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@todde.tv/gltf-type-toolkit?style=flat&colorA=181818&colorB=26ab7a
[npm-version-href]: https://npmjs.com/package/@todde.tv/gltf-type-toolkit
[npm-downloads-src]: https://img.shields.io/npm/dm/@todde.tv/gltf-type-toolkit?style=flat&colorA=181818&colorB=26ab7a
[npm-downloads-href]: https://npmjs.com/package/@todde.tv/gltf-type-toolkit
[bundle-size-src]: https://img.shields.io/bundlephobia/minzip/toddeTV/gltf-type-toolkit?style=flat&colorA=181818&colorB=26ab7a
[bundle-size-href]: https://bundlephobia.com/package/@toddeTV/gltf-type-toolkit
[license-src]: https://img.shields.io/github/license/toddeTV/gltf-type-toolkit?style=flat&colorA=181818&colorB=26ab7a
[license-href]: https://github.com/toddeTV/gltf-type-toolkit/blob/main/LICENSE
