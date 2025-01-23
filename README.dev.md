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

## Docs and helper websites

\[currently none\]
