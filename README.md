[![Encapsule Project](https://encapsule.io/images/blue-burst-encapsule.io-icon-72x72.png "Encapsule Project")](https://encapsule.io)

# Encapsule/holistic

## Summary

This repo serves as my development home base for working on the platform runtime libraries and tools behind the `appgen` script.

Briefly, `appgen` creates and updates a derived app and/or service project in a separate repo through code generation, and interaction with your locally installed `git`.

The files created include:

- Project configuration artifacts such as `package.json` and `yarn.lock` that define all of required dependencies and versions.
- `Makefile` with registered shortcuts in `package.json` that builds, tests, and packages a derived "holistic application" for test deployment on localhost. Or, wherever in the cloud.
- Copies of the latest @encapsule/holistic runtime library packages.

## Documentation

Currently, there's no documentation about how to use the holistic platform.

The goal was (is) to only write documentation manually for _arccore_. And, then never again. The code should self-document thereafter.

I want to see if this is possible for @encapsule/holistic. And, I want to see what points people find difficult to understand and apply.

An approach where we incrementally add documentation by (e.g.) creating a markdown doc w/a script that runs during build time seems feasible.

## Encpasule/holistic monorepo access

@encapsule/holistic repo on GitHub is managed by me (i.e. [ChrisRus](https://github.com/ChrisRus)).

The work contained in this repo + the @encapsule/arccore package represent a massive investment (risk) over many years.

Please use GitHub 2FA and protect your access to this repo.

### License

The `appgen` utility writes MIT-licensed files into an external project repo. It's the files that are written to the external repo that are MIT-licensed.

Those resources are built, tested, and perfected here in this repo. But, this repo **is not a community open source project.**

Rather, it is part of a long-running effort to adapt a set of design principles and practices to modern web development and distributed cloud services.

And, it's not currently public in any form. Let's keep it that way until we prove it's worth all the effort it took to build it.

So offically, you shouldn't take anything from this repo and bolt it into your whatever you're building unless it got put into your repo by `appgen`. Then it's MIT-licensed and you can do whatever you like with it.

### Next steps

As a brief aside, I'm not 100% pleased w/the above as it is still too closely coupled to derived app service development.

So, at some point in the future (maybe early 2020 or whenever we decide this is substantially stable) I intend to do some additional work to @encapsule/holistic monorepo build to make it product docs. And, a distribution package version of `appgen` I can publish in the npm registry for initial public consumption.

## Derived apps and services

`./appgen` is an executable alias for the `./PROJECT/GENERATOR/holistic-app-gen.js` script that is used to initialize and subsequently upgrade derived app/service projects.

It works by using your local Node.js installation as an execution host from where it performs code generation, filesystem operations, and git interactions with your local clone (or new) git repo.

### Create a new holistic app project

```
$ mkdir test
$ cd test
$ git init
$ yarn init
$ git commit -a
$ appgen
$ git status // see what it did
$ git commit -a
$ Makefile
// ? :) it crashes due to missing entry point(s)
```

What this gets you is a pristine environment to build holistic platform-derived apps (+ React). All setup. Ready to go.

But, `appgen` doesn't actually build your app. It just sets you up to build your app using a pre-configured build environment that includes:

- `Makefile` that controls everything.
- Managed platform and application dependencies.
- Dependency checking and version checking.
- Synthesized `package.json`.
- Tool chains for building, packaging and, testing:
    - eslint for source code static analysis
    - Babel toolchain for transpilation of sources
    - webpack for bundling hundreds of discrete JavaScript files into a single bundle we can version and tag for aggressive caching.
- Developer shortcuts for common build, debug, clean, package, publish operations.
- Copies of @encapsule/holistic platform RTL packages (currently eight of them) registered via package.json (so referenced normally - not from SOURCE tree)
- Dependency on @encapsule/arccore (1 package containing 8 libs).
- Dependency on @encapsule/arctools (1 package containing a small collection of useful command line scripts that are registered under your project's `./node_modules/.bin/`

<hr>

Published by [Encapsule Project](https://encapsule.io) Seattle, Washington

Copyright &copy; 2011-2020 [Christopher D. Russell](https://github.com/ChrisRus)
