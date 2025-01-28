# Developer README

This document is intended for contributors. It explains how to set up the development environment for this project.<br>
User-oriented documentation, including installation and usage instructions, can be found in [README.md](/README.md).

## initial setup

### VM ID

Development VM ID from Thorsten for this project: `014`<br>
(Only interesting to him.)

### project setup

1. execute a `git pull`
2. open project in VSCode
3. If you work with VSCode via remote software:
   - `{Ctrl}+{Shift}+{P}` -> `>Preferences: Open Settings (UI)` -> search for `keyboard.dispatch` and set it to `keyCode`
   - Restart or reload VSCode.
4. Install recommended extensions/ plugins:
   - Open Extensions menu in VSCode (`{Ctrl}+{Shift}+{X}`)
   - type in the search `@recommended`
   - install and enable the plugins
   - see file `.vscode/extensions.json` for configuring some of the extensions
   - Restart or reload VSCode.
5. In VSCode on the bottom left click your profile image and log in all services (GitHub due to VSCode extensions, ...)<br>
   If the browser to VSCode callback fails, wait for the login popup on the bottom right to timeout (ca. 5 minutes) and
   then on the upcoming popup question `You have not yet finished authorizing [...] Would you like to try a different way? (local server)` click `Yes` and use this alternative login mechanic.<br>
   (When you do not want to wait for the timeout to happen, you can also click the `Cancel` to trigger the dialog faster.)
6. Install dependencies: `pnpm i`
7. Happy coding <3

## lint and prettier

This project uses [antfu/eslint-config](https://github.com/antfu/eslint-config) for eslint most of the files.
The following extend it:

- [antfu/eslint-plugin-format](https://github.com/antfu/eslint-plugin-format) for using external formatters like
  e.g. `prettier` for the file types that eslint cannot handle.
- [azat-io/eslint-plugin-perfectionist](https://github.com/azat-io/eslint-plugin-perfectionist) for
  sorting object keys, imports, etc. - with auto-fix.

Keep in mind that the plugin names are renamed, see
[Plugins Rename](https://github.com/antfu/eslint-config?tab=readme-ov-file#plugins-renaming), e.g.:

```diff
-// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
+// eslint-disable-next-line ts/consistent-type-definitions
type foo = { bar: 2 }
```

[Why I don't use Prettier for every file type](https://antfu.me/posts/why-not-prettier)

## GitHub Release & NPM Publishing

Using the suffix `[create-release]` or `[create-release-TYPE]` in a commit message on branch `main` will trigger
the GitHub workflow (CI action) that:

- uses `pnpx changelogen` to analyze the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) from
  the last version to the current commit for:
  - bumping the version in `package.json` via:
    - automatically when no `TYPE` is given
    - manually with a given `TYPE` where the following is possible:
      - `major`: Bump as a semver-major version
      - `minor`: Bump as a semver-minor version
      - `patch`: Bump as a semver-patch version
      - `premajor`: Bump as a semver-premajor version, can set id with string.
      - `preminor`: Bump as a semver-preminor version, can set id with string.
      - `prepatch`: Bump as a semver-prepatch version, can set id with string.
      - `prerelease`: Bump as a semver-prerelease version, can set id with string.
  - creating a new changelog entry in `CHANGELOG.md` from the last version to the new version
- Committing these changes as author `github-actions[bot] <no-reply@todde.tv>` directly on branch `main`
- Creating a tag at the new version commit on with the version number
- Creating a GitHub Release out of it
- Publishing the package into the [NPM Registry](https://registry.npmjs.org/)

You can use `pnpx changelogen --dry` to generate the new changelog in a dry run to preview in development.

## Template Compilation and Usage

It uses Handlebars to generate the code.

Here's a more detailed explanation of how everything works:

1. During local installation, all Handlebars templates are precompiled into JavaScript code so they can be bundled
   without the need to manually specify which `*.hbs` files need to be included or reference them at runtime.

   1. The process works by scanning all files in the `src` directory and generating a TypeScript file for each
      found template.
   2. These files contain the precompiled Handlebars code and export the instantiated template (which is a regular
      function) as the default export. This allows the templates to be used simply by importing them.
   3. The script treats partials (identified by being in `_partials` directories) differently: They are also
      precompiled as described above, but for each `_partials` directory, an index file is generated that registers
      all the contained partials on import.
   4. To generate these two types of files, the script itself uses Handlebars templates. These do not need to be
      precompiled or bundled as they are only used during the plugin's development.

2. The templates themselves are fairly simple but split across multiple files and helpers to reduce duplication.

   1. The `fn_prefix` partial generates code for the node getter function and is adaptable for both `.d.ts`
      and `.js` code. For example, in declaration files, the use of `async function` is not allowed.
   2. The `children` partial is recursive and constructs the tree of child indices, using a helper function to
      build the index array.
   3. The `imports` partial builds a list of imports and takes into account type-only imports. Currently, this is not
      required and is a remnant of a previous iteration. I decided to keep it in, as it might be useful in the future.
   4. The main templates, `declaration` and `runtime`, are now simply wrappers around these partials.

See [PR #16](https://github.com/toddeTV/gltf-type-toolkit/pull/16), which introduces this logic for the first time.

## Docs and helper websites

\[currently none\]
