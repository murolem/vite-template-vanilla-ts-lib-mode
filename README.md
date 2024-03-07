# vite-template-vanilla-ts-lib-mode

A vanilla typescript vite template using lib mode with support for multiple entries.

Note: it's in no way a refined and robust setup, but it's enough to get most of my simple projects running.

# Usage

1. Install using:

```text
npx degit murolem/vite-template-vanilla-ts-lib-mode my-new-project
```

This will clone the repo, but without `.git` folder (=no repo history).

Or you can just clone the repo the regular way.

2. Go to `package.json`, change the name, set the version to `0.0.0` (or whatever you prefer).

3. Configure the `.github` actions however you like. By default, it uses `release-please-action@v3` to increment the package version based on `cz-conventional-changelog` commits, creating pull requested on commits that increment the version.
   The latter must be enabled in your project repo settings → Actions → General → Workflow permissions → «Allow GitHub Actions to create and approve pull requests».

# What's inside

**Vite with a custom build script**

Allows you to define however many entry points you would like (you can build like 20 scripts at the same time):

-   `build` command runs all commands that start with `build:` in parallel (except the ones ending in `watch`).
-   You can add any amount of new build commands that should be run under the general `build` command. They can utilize either the build script (see `build:index` command for example), or whatever else you put there.

Run `build` to build everything once.
Run `build -- -w` to build in watch mode, rebuilding on changes.
You can also run any build "subcommand" (e.g. `build:index`) individually, including in the watch mode.

**Commits following Conventional Commits**

Running `sendit` stages all unstaged changes and promts you to pick the commit params (like type, message, etc.). After you done, it pushes your changes to the origin.

`cz` command (coming from `cz-conventional-changelog`) ensures that the commits will follow Conventional Commits, which allows them e.g. to be gathered into a nice changelog using `release-please-action@v3` action (see the Usage section for directions).
