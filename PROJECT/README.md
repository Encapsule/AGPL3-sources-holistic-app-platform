# @encapsule/holodev/PROJECT/README.md

At the outermost level of the holistic platform is the @encapsule/holodev monorepo.

@encapsule/holodev/package.json is used to set the platform revision etc.

@encapsule/holodev/Makefile is used to synthesize a new version of the @encapsule/holistic distribution package that contains the developer-facing `appgen` CLI utility.

@encapsule/holodev/Makefile leverages the contents of the directories contained in the `./PROJECTS/` directory as follows:

## PLATFORM

The `./PROJECT/PLATFORM/` directory contains scripts and assets for building the @encapsule/holistic platform distribution package.

None of the scripts or assets contained in this directory are copied directly into the @encapsule/holistic distribution package.

## GENERATOR

The `./PROJECT/GENERATOR/` directory contains scipts and assets that are copied into and included in the @encapsule/holistic platform distribution package for use by that package's included `appgen` CLI utility.

`appgen` leverages the scripts and assets discovered in its `encapsule/holistic/PROJECT/GENERATOR/` directory to customize its operation when making changes to a developer-defined holistic app service project monorepo.

